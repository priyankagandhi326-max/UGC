// ugc/lib/demo/store.ts
import {
  type Campaign,
  type CampaignCreator,
  type CreateCampaignInput,
  type Creator,
  type DemoState,
  seedState,
} from "@/lib/demo/data";

const KEY = "creatrugc_demo_state_v1";

let cached: DemoState = seedState;

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l();
}

function readFromStorage(): DemoState {
  if (typeof window === "undefined") return seedState;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoState) : seedState;
  } catch {
    return seedState;
  }
}

function writeToStorage(state: DemoState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function initDemoStore() {
  if (typeof window === "undefined") return;
  cached = readFromStorage();

  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cached = readFromStorage();
      notify();
    }
  });
}

export function getState(): DemoState {
  return cached;
}

export function getServerState(): DemoState {
  return seedState;
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function saveState(next: DemoState) {
  cached = next;
  writeToStorage(next);
  notify();
}

export function resetDemo() {
  saveState(JSON.parse(JSON.stringify(seedState)) as DemoState);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function mutate(recipe: (draft: DemoState) => void) {
  const draft = JSON.parse(JSON.stringify(cached)) as DemoState;
  recipe(draft);
  saveState(draft);
}

function addActivity(
  state: DemoState,
  message: string,
  refs?: { campaignId?: string; creatorId?: string; payoutId?: string },
) {
  state.activity.unshift({
    id: makeId("activity"),
    createdAt: new Date().toISOString(),
    message,
    ...refs,
  });
}

function resolveApprovedMetrics(campaign: Campaign, creator: Creator) {
  const projectedViews = Math.min(
    campaign.viewCap,
    Math.round(Math.max(creator.followers, 50000) * (0.22 + creator.credits / 10)),
  );
  const earningsEstimate = Math.min(
    campaign.budget,
    Math.round(projectedViews * campaign.ratePerView),
  );
  return { projectedViews, earningsEstimate };
}

function upsertPayout(
  state: DemoState,
  campaign: Campaign,
  creator: Creator,
  member: CampaignCreator,
) {
  const existing = state.payouts.find(
    (p) => p.campaignId === campaign.id && p.creatorId === creator.id && p.status === "pending",
  );
  if (existing) {
    existing.amount = Math.round(member.earningsEstimate);
    return;
  }
  state.payouts.unshift({
    id: makeId("payout"),
    creatorId: creator.id,
    campaignId: campaign.id,
    period: `${new Date(campaign.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric" })} - ${new Date().toLocaleString("en-IN", { month: "short", day: "numeric" })}`,
    amount: Math.round(member.earningsEstimate),
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export function getCampaignSpend(campaign: Campaign) {
  return campaign.creatorStatuses.reduce((sum, m) => sum + m.earningsEstimate, 0);
}

export function getCampaignViews(campaign: Campaign) {
  return campaign.creatorStatuses.reduce((sum, m) => sum + m.views, 0);
}

export function getCampaignCreators(campaign: Campaign, status?: CampaignCreator["status"]) {
  return campaign.creatorStatuses.filter((m) => (status ? m.status === status : true));
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function createCampaign(payload: CreateCampaignInput) {
  const now = new Date().toISOString();
  const campaign: Campaign = {
    id: makeId("campaign"),
    title: payload.title.trim(),
    brand: payload.brand.trim(),
    niche: payload.niche,
    region: payload.region.trim(),
    contentType: payload.contentType,
    budget: payload.budget,
    ratePerView: payload.ratePerView,
    viewCap: payload.viewCap,
    brief: payload.brief.trim(),
    status: "planning",
    sourceUrl: "",
    latestHooks: [],
    creatorStatuses: [],
    createdAt: now,
    updatedAt: now,
  };

  mutate((state) => {
    state.campaigns.unshift(campaign);
    addActivity(state, `Created campaign ${campaign.title}.`, { campaignId: campaign.id });
  });

  return campaign;
}

export function inviteCreator(campaignId: string, creatorId: string) {
  mutate((state) => {
    const campaign = state.campaigns.find((c) => c.id === campaignId);
    const creator = state.creators.find((c) => c.id === creatorId);
    if (!campaign || !creator) return;

    const existing = campaign.creatorStatuses.find((m) => m.creatorId === creatorId);
    if (existing) {
      existing.status = "pending";
      existing.views = 0;
      existing.earningsEstimate = 0;
      existing.invitedAt = new Date().toISOString();
      delete existing.respondedAt;
    } else {
      campaign.creatorStatuses.push({
        creatorId,
        status: "pending",
        views: 0,
        earningsEstimate: 0,
        invitedAt: new Date().toISOString(),
      });
    }

    campaign.updatedAt = new Date().toISOString();
    addActivity(state, `Invited ${creator.name} to ${campaign.title}.`, { campaignId, creatorId });
  });
}

export function approveCreator(campaignId: string, creatorId: string) {
  mutate((state) => {
    const campaign = state.campaigns.find((c) => c.id === campaignId);
    const creator = state.creators.find((c) => c.id === creatorId);
    const member = campaign?.creatorStatuses.find((m) => m.creatorId === creatorId);
    if (!campaign || !creator || !member) return;

    const metrics = resolveApprovedMetrics(campaign, creator);
    member.status = "approved";
    member.views = metrics.projectedViews;
    member.earningsEstimate = metrics.earningsEstimate;
    member.respondedAt = new Date().toISOString();
    campaign.status = "active";
    campaign.updatedAt = new Date().toISOString();
    upsertPayout(state, campaign, creator, member);
    addActivity(state, `Approved ${creator.name} for ${campaign.title}.`, { campaignId, creatorId });
  });
}

export function rejectCreator(campaignId: string, creatorId: string) {
  mutate((state) => {
    const campaign = state.campaigns.find((c) => c.id === campaignId);
    const creator = state.creators.find((c) => c.id === creatorId);
    const member = campaign?.creatorStatuses.find((m) => m.creatorId === creatorId);
    if (!campaign || !creator || !member) return;

    member.status = "rejected";
    member.views = 0;
    member.earningsEstimate = 0;
    member.respondedAt = new Date().toISOString();
    campaign.updatedAt = new Date().toISOString();
    addActivity(state, `Rejected ${creator.name} for ${campaign.title}.`, { campaignId, creatorId });
  });
}

export function pushHooksToCampaign(campaignId: string, hooks: string[]) {
  mutate((state) => {
    const campaign = state.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    campaign.latestHooks = hooks.filter(Boolean);
    campaign.updatedAt = new Date().toISOString();
    addActivity(
      state,
      `Pushed ${campaign.latestHooks.length} hooks to approved creators for ${campaign.title}.`,
      { campaignId },
    );
  });
}

export function markPayoutPaid(payoutId: string) {
  mutate((state) => {
    const payout = state.payouts.find((p) => p.id === payoutId);
    if (!payout || payout.status === "paid") return;

    payout.status = "paid";
    payout.paidAt = new Date().toISOString();

    const campaign = state.campaigns.find((c) => c.id === payout.campaignId);
    const creator = state.creators.find((c) => c.id === payout.creatorId);
    addActivity(
      state,
      `Paid ${creator?.name ?? "creator"} ₹${payout.amount.toLocaleString("en-IN")} for ${campaign?.title ?? "campaign"}.`,
      { payoutId, campaignId: payout.campaignId, creatorId: payout.creatorId },
    );
  });
}

export function exportPayoutsCsv() {
  const header = [
    "payout_id", "creator_name", "creator_handle",
    "campaign_title", "period", "amount", "status", "created_at", "paid_at",
  ];

  const rows = cached.payouts.map((payout) => {
    const creator = cached.creators.find((c) => c.id === payout.creatorId);
    const campaign = cached.campaigns.find((c) => c.id === payout.campaignId);
    return [
      payout.id, creator?.name ?? "", creator?.handle ?? "",
      campaign?.title ?? "", payout.period, String(payout.amount),
      payout.status, payout.createdAt, payout.paidAt ?? "",
    ];
  });

  return [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}
