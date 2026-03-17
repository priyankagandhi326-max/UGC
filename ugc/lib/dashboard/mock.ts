import type { Campaign, Creator, DemoState, Payout } from "@/lib/demo/data";
import { getCampaignSpend, getCampaignViews } from "@/lib/demo/store";

export type RangeOption = "7d" | "30d" | "90d";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: value >= 100000 ? "compact" : "standard",
    maximumFractionDigits: value >= 100000 ? 1 : 0,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function getFollowerBand(followers: number) {
  if (followers >= 300000) return "250K-500K";
  if (followers >= 150000) return "150K-250K";
  if (followers >= 90000) return "90K-150K";
  return "50K-90K";
}

function getCreatorMap(state: DemoState) {
  return new Map(state.creators.map((creator) => [creator.id, creator]));
}

function getCampaignHealth(campaign: Campaign) {
  const spend = getCampaignSpend(campaign);
  const views = getCampaignViews(campaign);
  const approved = campaign.creatorStatuses.filter((item) => item.status === "approved").length;
  const pending = campaign.creatorStatuses.filter((item) => item.status === "pending").length;
  const budgetUsed = campaign.budget > 0 ? spend / campaign.budget : 0;
  const creatorFill = Math.min(1, (approved + pending) / Math.max(approved + pending, approved + 2));
  const viewPace = campaign.viewCap > 0 ? views / campaign.viewCap : 0;
  const score = Math.round((budgetUsed * 34 + creatorFill * 28 + viewPace * 38) * 100);
  return Math.max(41, Math.min(96, score));
}

function getCampaignCtr(campaign: Campaign) {
  const score = getCampaignHealth(campaign);
  return Number((1.3 + score / 35).toFixed(1));
}

function getCampaignImpressions(campaign: Campaign) {
  return Math.round(getCampaignViews(campaign) * 1.72);
}

function getCampaignReach(campaign: Campaign) {
  return Math.round(getCampaignImpressions(campaign) * 0.58);
}

function getCreatorPayout(state: DemoState, creatorId: string) {
  return state.payouts
    .filter((payout) => payout.creatorId === creatorId)
    .reduce((sum, payout) => sum + payout.amount, 0);
}

function getCreatorViews(state: DemoState, creatorId: string) {
  return state.campaigns.reduce(
    (sum, campaign) => sum + (campaign.creatorStatuses.find((item) => item.creatorId === creatorId)?.views ?? 0),
    0,
  );
}

function createSeries(total: number, range: RangeOption) {
  const configs: Record<RangeOption, { labels: string[]; weights: number[] }> = {
    "7d": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weights: [0.1, 0.12, 0.14, 0.16, 0.15, 0.17, 0.16],
    },
    "30d": {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      weights: [0.1, 0.13, 0.18, 0.21, 0.2, 0.18],
    },
    "90d": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      weights: [0.09, 0.11, 0.15, 0.18, 0.22, 0.25],
    },
  };

  const config = configs[range];
  return config.labels.map((label, index) => ({
    label,
    value: Math.round(total * config.weights[index]),
  }));
}

export function getOverviewData(state: DemoState) {
  const activeCampaigns = state.campaigns.filter((campaign) => campaign.status === "active");
  const totalViews = state.campaigns.reduce((sum, campaign) => sum + getCampaignViews(campaign), 0);
  const totalSpend = state.campaigns.reduce((sum, campaign) => sum + getCampaignSpend(campaign), 0);
  const creatorsLive = state.campaigns.reduce(
    (sum, campaign) => sum + campaign.creatorStatuses.filter((item) => item.status === "approved").length,
    0,
  );
  const impressions = state.campaigns.reduce((sum, campaign) => sum + getCampaignImpressions(campaign), 0);
  const reach = state.campaigns.reduce((sum, campaign) => sum + getCampaignReach(campaign), 0);
  const ctr = activeCampaigns.length > 0
    ? activeCampaigns.reduce((sum, campaign) => sum + getCampaignCtr(campaign), 0) / activeCampaigns.length
    : 0;
  const totalBudget = state.campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const budgetUsed = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  const topCreators = state.creators
    .map((creator) => ({
      ...creator,
      views: getCreatorViews(state, creator.id),
      payout: getCreatorPayout(state, creator.id),
    }))
    .filter((creator) => creator.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const activeCampaignCards = activeCampaigns
    .map((campaign) => {
      const spend = getCampaignSpend(campaign);
      const views = getCampaignViews(campaign);
      const liveCreators = campaign.creatorStatuses.filter((item) => item.status === "approved").length;
      const creatorsNeeded = Math.max(liveCreators + campaign.creatorStatuses.filter((item) => item.status === "pending").length, liveCreators + 2);
      return {
        id: campaign.id,
        title: campaign.title,
        niche: campaign.niche,
        healthScore: getCampaignHealth(campaign),
        liveCreators,
        creatorsNeeded,
        views,
        spend,
        budget: campaign.budget,
      };
    })
    .sort((a, b) => b.healthScore - a.healthScore);

  const topCampaign = activeCampaignCards[0];

  const hookPreview = state.campaigns
    .flatMap((campaign) =>
      campaign.latestHooks.slice(0, 3).map((hook, index) => ({
        id: `${campaign.id}-${index}`,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        hook,
        score: Math.round(Math.min(96, getCampaignHealth(campaign) + 8 - index * 3)),
      })),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const pendingActions = [
    {
      id: "creator-review",
      title: `${state.campaigns.reduce((sum, campaign) => sum + campaign.creatorStatuses.filter((item) => item.status === "pending").length, 0)} creator applications need review`,
      note: "Clear pending creators to keep active campaigns staffed.",
      href: "/creators",
    },
    {
      id: "payout-approval",
      title: `${state.payouts.filter((payout) => payout.status === "pending").length} payouts pending approval`,
      note: "Finance is waiting on campaign-linked payout sign-off.",
      href: "/payouts",
    },
    {
      id: "asset-upload",
      title: "1 campaign needs assets uploaded",
      note: "Kindred Meals is still missing final product assets and CTA frames.",
      href: "/campaigns",
    },
  ];

  return {
    topMetrics: [
      { label: "Total Views", value: formatCompactNumber(totalViews), detail: `${formatCompactNumber(impressions)} impressions in motion`, tone: "default" as const },
      { label: "Active Campaigns", value: String(activeCampaigns.length), detail: `${state.campaigns.filter((campaign) => campaign.status === "planning").length} in planning`, tone: "default" as const },
      { label: "Total Spend", value: formatCurrency(totalSpend), detail: `${formatPercent(budgetUsed)} of live budget deployed`, tone: "accent" as const },
      { label: "Creators Live", value: String(creatorsLive), detail: `${topCreators.length} top performers tracked`, tone: "default" as const },
    ],
    secondaryMetrics: [
      { label: "Reach", value: formatCompactNumber(reach), detail: "Unique audience delivered" },
      { label: "Impressions", value: formatCompactNumber(impressions), detail: "Across all live content" },
      { label: "CTR", value: formatPercent(ctr), detail: "Average across active campaigns" },
      { label: "Used Budget", value: formatPercent(budgetUsed), detail: `${formatCurrency(totalSpend)} of ${formatCurrency(totalBudget)}` },
    ],
    chart: {
      "7d": {
        views: createSeries(totalViews * 0.21, "7d"),
        reach: createSeries(reach * 0.22, "7d"),
        spend: createSeries(totalSpend * 0.19, "7d"),
      },
      "30d": {
        views: createSeries(totalViews * 0.63, "30d"),
        reach: createSeries(reach * 0.58, "30d"),
        spend: createSeries(totalSpend * 0.62, "30d"),
      },
      "90d": {
        views: createSeries(totalViews, "90d"),
        reach: createSeries(reach, "90d"),
        spend: createSeries(totalSpend, "90d"),
      },
    },
    campaignHealth: activeCampaignCards.map((campaign) => ({
      ...campaign,
      healthLabel: campaign.healthScore >= 82 ? "Strong pace" : campaign.healthScore >= 65 ? "Needs attention" : "At risk",
    })),
    topCreators,
    topCampaign,
    hookPreview,
    pendingActions,
  };
}

export function getCampaignsPageData(state: DemoState) {
  const creatorsById = getCreatorMap(state);
  return state.campaigns.map((campaign) => {
    const spend = getCampaignSpend(campaign);
    const views = getCampaignViews(campaign);
    const liveCreators = campaign.creatorStatuses.filter((item) => item.status === "approved").length;
    const pendingCreators = campaign.creatorStatuses.filter((item) => item.status === "pending").length;
    const creatorsNeeded = Math.max(liveCreators + pendingCreators, liveCreators + 2);
    const assignedCreators = campaign.creatorStatuses
      .map((item) => creatorsById.get(item.creatorId))
      .filter(Boolean)
      .map((creator) => creator as Creator);

    return {
      id: campaign.id,
      title: campaign.title,
      niche: campaign.niche,
      region: campaign.region,
      brief: campaign.brief,
      budget: campaign.budget,
      spend,
      views,
      status: campaign.status,
      contentType: campaign.contentType,
      creatorsNeeded,
      creatorsLive: liveCreators,
      assetsCount: campaign.status === "planning" ? 6 : 12,
      payoutModel: `CPM aligned at ${formatCurrency(campaign.ratePerView * 1000)}`,
      healthScore: getCampaignHealth(campaign),
      ctr: getCampaignCtr(campaign),
      assignedCreators,
      hooks: campaign.latestHooks,
      requirements: [
        `${campaign.contentType} first 2 seconds must land the problem clearly`,
        `${campaign.region} creators with ${campaign.niche.toLowerCase()} audience fit`,
        "CTA should point to trial, bundle, or add-to-cart intent",
      ],
    };
  });
}

export function getCreatorsPageData(state: DemoState) {
  const creatorsById = getCreatorMap(state);
  const creatorRows = state.campaigns.flatMap((campaign) =>
    campaign.creatorStatuses.map((item) => {
      const creator = creatorsById.get(item.creatorId);
      if (!creator) {
        return null;
      }

      const payout = state.payouts.find(
        (current) => current.creatorId === creator.id && current.campaignId === campaign.id,
      );

      const status = item.status === "approved"
        ? "approved"
        : item.status === "pending"
          ? "pending"
          : "applied";

      return {
        id: `${campaign.id}-${creator.id}`,
        creatorId: creator.id,
        handle: creator.handle,
        name: creator.name,
        niche: creator.niche,
        region: creator.region,
        followerBand: getFollowerBand(creator.followers),
        followers: creator.followers,
        status,
        views: item.views,
        campaign: campaign.title,
        payoutStatus: payout?.status === "paid" ? "paid" : payout ? "pending" : "not-started",
        payoutAmount: payout?.amount ?? item.earningsEstimate,
        score: Math.round(Math.min(98, creator.credits * 18 + item.views / 6000)),
      };
    }),
  ).filter(Boolean);

  const creatorList = creatorRows.filter((item): item is NonNullable<typeof item> => Boolean(item));

  const topPerformers = [...creatorList]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const nicheMatches = [...state.creators]
    .filter((creator) => creator.niche === "Beauty" || creator.niche === "Tech" || creator.niche === "Lifestyle")
    .sort((a, b) => b.credits - a.credits)
    .slice(0, 3)
    .map((creator) => ({
      id: creator.id,
      handle: creator.handle,
      niche: creator.niche,
      fit: `${getFollowerBand(creator.followers)} fit`,
    }));

  return {
    creatorList,
    topPerformers,
    nicheMatches,
    quickMatches: [
      "12 creators fit your lifestyle + beauty brief in North America",
      "PulsePod has 4 high-intent tech reviewers ready for invite",
      "Food creators in Canada are underutilized for Kindred Meals",
    ],
  };
}

export function getHookEngineData(state: DemoState) {
  const rankedHooks = state.campaigns.flatMap((campaign) =>
    campaign.latestHooks.map((hook, index) => {
      const views = Math.round(getCampaignViews(campaign) * (0.38 - index * 0.05));
      const ctr = Number((getCampaignCtr(campaign) + 0.2 - index * 0.12).toFixed(1));
      const engagement = Number((5.4 - index * 0.35 + campaign.ratePerView * 10).toFixed(1));
      return {
        id: `${campaign.id}-${index}`,
        hook,
        campaign: campaign.title,
        views,
        ctr,
        engagement,
        score: Math.round(Math.min(97, getCampaignHealth(campaign) + 10 - index * 4)),
      };
    }),
  ).sort((a, b) => b.score - a.score);

  const topHook = rankedHooks[0];

  return {
    summary: [
      { label: "Winning Format", value: "Talking-head with product cutaway", detail: "Outperforming montage-led edits by 18%" },
      { label: "Top Audio Trend", value: "Low-fi tension bed", detail: "Used in 6 of the top 10 winning posts" },
      { label: "Replicate Winner", value: "12 more creators", detail: "Best expansion path in beauty + lifestyle" },
    ],
    heroInsight: topHook
      ? {
          title: "Replicate this angle with 12 more creators in beauty",
          description: `The best-performing opening from ${topHook.campaign} is breaking the pattern early and sustaining a stronger click-through rate than the rest of the cohort.`,
          hook: topHook.hook,
        }
      : {
          title: "Generate your first hook set",
          description: "Once creators go live, CREATR.UGC will rank hooks, formats, and audio angles here.",
          hook: "No top hook yet.",
        },
    winningScripts: [
      "Problem-first open with clear before-state in the first 1.5 seconds.",
      "Product reveal lands only after the creator frames the friction honestly.",
      "CTA works best when the creator signals what changed after trying it.",
    ],
    rankedHooks: rankedHooks.slice(0, 6),
  };
}

export function getPayoutsPageData(state: DemoState) {
  const creatorsById = getCreatorMap(state);
  const campaignsById = new Map(state.campaigns.map((campaign) => [campaign.id, campaign]));
  const totalApproved = state.payouts
    .filter((payout) => payout.status === "pending")
    .reduce((sum, payout) => sum + payout.amount, 0);
  const paidOut = state.payouts
    .filter((payout) => payout.status === "paid")
    .reduce((sum, payout) => sum + payout.amount, 0);
  const averageCpm = state.payouts.length > 0
    ? state.payouts.reduce((sum, payout) => {
        const campaign = campaignsById.get(payout.campaignId);
        if (!campaign) {
          return sum;
        }
        return sum + campaign.ratePerView * 1000;
      }, 0) / state.payouts.length
    : 0;

  return {
    summary: [
      { label: "Total Approved", value: formatCurrency(totalApproved), detail: "Ready for finance release" },
      { label: "Pending Approval", value: String(state.payouts.filter((payout) => payout.status === "pending").length), detail: "Awaiting ops sign-off" },
      { label: "Paid Out", value: formatCurrency(paidOut), detail: "Closed creator payouts" },
      { label: "Average CPM", value: formatCurrency(averageCpm), detail: "Across active payout models" },
    ],
    rows: state.payouts.map((payout: Payout) => {
      const creator = creatorsById.get(payout.creatorId);
      const campaign = campaignsById.get(payout.campaignId);
      const campaignViews = campaign ? getCampaignViews(campaign) : 0;
      return {
        id: payout.id,
        creator: creator?.name ?? "Creator",
        handle: creator?.handle ?? "@creator",
        campaign: campaign?.title ?? "Campaign",
        model: campaign ? `CPM · ${formatCurrency(campaign.ratePerView * 1000)}` : "CPM",
        views: campaignViews,
        amount: payout.amount,
        status: payout.status === "paid" ? "paid" : payout.amount > 3000 ? "approved" : "pending",
        action: payout.status === "paid" ? "Receipt sent" : payout.amount > 3000 ? "Release" : "Review",
      };
    }),
  };
}
