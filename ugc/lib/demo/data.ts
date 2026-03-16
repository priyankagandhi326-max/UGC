export type CampaignStatus = "active" | "planning" | "completed";
export type CreatorDecision = "pending" | "approved" | "rejected";
export type ContentType = "Reel" | "Short" | "Story";
export type PayoutStatus = "pending" | "paid";

export type ActivityItem = {
  id: string;
  createdAt: string;
  message: string;
  campaignId?: string;
  creatorId?: string;
  payoutId?: string;
};

export type Creator = {
  id: string;
  handle: string;
  name: string;
  niche: string;
  region: string;
  platforms: string[];
  followers: number;
  credits: number;
};

export type CampaignCreator = {
  creatorId: string;
  status: CreatorDecision;
  views: number;
  earningsEstimate: number;
  invitedAt: string;
  respondedAt?: string;
};

export type Campaign = {
  id: string;
  title: string;
  brand: string;
  niche: string;
  region: string;
  contentType: ContentType;
  budget: number;
  ratePerView: number;
  viewCap: number;
  brief: string;
  status: CampaignStatus;
  sourceUrl?: string;
  latestHooks: string[];
  creatorStatuses: CampaignCreator[];
  createdAt: string;
  updatedAt: string;
};

export type Payout = {
  id: string;
  creatorId: string;
  campaignId: string;
  period: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  paidAt?: string;
};

export type DemoState = {
  campaigns: Campaign[];
  creators: Creator[];
  payouts: Payout[];
  activity: ActivityItem[];
};

export type CreateCampaignInput = {
  title: string;
  brand: string;
  niche: string;
  region: string;
  contentType: ContentType;
  budget: number;
  ratePerView: number;
  viewCap: number;
  brief: string;
};

export const seedState: DemoState = {
  creators: [
    { id: "creator-ava", handle: "@avaedits", name: "Ava Hart", niche: "Beauty", region: "US", platforms: ["TikTok", "Instagram"], followers: 148000, credits: 4.9 },
    { id: "creator-omar", handle: "@omareats", name: "Omar Vega", niche: "Food", region: "US", platforms: ["TikTok", "YouTube"], followers: 231000, credits: 4.8 },
    { id: "creator-lena", handle: "@lenalifts", name: "Lena Brooks", niche: "Fitness", region: "Canada", platforms: ["Instagram", "YouTube"], followers: 194000, credits: 4.7 },
    { id: "creator-noah", handle: "@noahgadgets", name: "Noah Kim", niche: "Tech", region: "US", platforms: ["YouTube", "TikTok"], followers: 305000, credits: 4.9 },
    { id: "creator-mila", handle: "@milamoves", name: "Mila Ortiz", niche: "Lifestyle", region: "UK", platforms: ["Instagram", "TikTok"], followers: 126000, credits: 4.6 },
    { id: "creator-zoe", handle: "@zoeskincarelab", name: "Zoe Lane", niche: "Beauty", region: "US", platforms: ["Instagram", "TikTok"], followers: 87000, credits: 4.5 },
    { id: "creator-isaac", handle: "@isaacreviews", name: "Isaac Cole", niche: "Tech", region: "US", platforms: ["YouTube", "Instagram"], followers: 92000, credits: 4.4 },
    { id: "creator-rhea", handle: "@rhearefresh", name: "Rhea Singh", niche: "Lifestyle", region: "India", platforms: ["Instagram", "YouTube"], followers: 158000, credits: 4.8 },
  ],
  campaigns: [
    {
      id: "camp-luma",
      title: "LumaSkin Spring Reset",
      brand: "CREATR.UGC",
      niche: "Beauty",
      region: "North America",
      contentType: "Reel",
      budget: 18000,
      ratePerView: 0.045,
      viewCap: 240000,
      brief: "Position LumaSkin as the easy morning routine upgrade. Show texture, before-and-after glow, and a confident voiceover about why the routine sticks.",
      status: "active",
      sourceUrl: "https://demo.creatrugc.com/briefs/lumaskin-spring-reset",
      latestHooks: [
        "My skin stopped looking tired when I simplified to this 2-step reset.",
        "If your morning routine feels too heavy, try this glow-first swap.",
        "I tested a spring skin reset for 5 days and my makeup sat better immediately.",
        "This is the skincare combo I keep reaching for before every content day.",
        "The easiest way to look more awake on camera starts here.",
      ],
      creatorStatuses: [
        { creatorId: "creator-ava", status: "approved", views: 81200, earningsEstimate: 3654, invitedAt: "2026-03-01T09:30:00.000Z", respondedAt: "2026-03-02T14:10:00.000Z" },
        { creatorId: "creator-zoe", status: "approved", views: 43600, earningsEstimate: 1962, invitedAt: "2026-03-01T10:10:00.000Z", respondedAt: "2026-03-02T16:40:00.000Z" },
        { creatorId: "creator-mila", status: "pending", views: 0, earningsEstimate: 0, invitedAt: "2026-03-09T11:15:00.000Z" },
      ],
      createdAt: "2026-02-27T08:00:00.000Z",
      updatedAt: "2026-03-09T11:15:00.000Z",
    },
    {
      id: "camp-pulse",
      title: "PulsePod Creator Sprint",
      brand: "CREATR.UGC",
      niche: "Tech",
      region: "United States",
      contentType: "Short",
      budget: 24000,
      ratePerView: 0.052,
      viewCap: 300000,
      brief: "Drive launches for PulsePod by focusing on commute use cases, mic quality, and battery life. Frame the product as the default work-to-gym earbuds.",
      status: "active",
      sourceUrl: "https://demo.creatrugc.com/briefs/pulsepod-creator-sprint",
      latestHooks: [
        "I stopped carrying over-ear headphones after this one commute test.",
        "These earbuds survived my train ride, coffee run, and gym session.",
        "Here is the feature I noticed before I even looked at the price.",
        "If your calls sound muffled outside, this is the fix I kept.",
        "The battery test that made these my everyday pair.",
      ],
      creatorStatuses: [
        { creatorId: "creator-noah", status: "approved", views: 128400, earningsEstimate: 6677, invitedAt: "2026-02-25T13:00:00.000Z", respondedAt: "2026-02-26T08:45:00.000Z" },
        { creatorId: "creator-isaac", status: "approved", views: 51400, earningsEstimate: 2673, invitedAt: "2026-02-25T13:20:00.000Z", respondedAt: "2026-02-26T09:05:00.000Z" },
        { creatorId: "creator-rhea", status: "rejected", views: 0, earningsEstimate: 0, invitedAt: "2026-02-25T15:10:00.000Z", respondedAt: "2026-02-27T10:00:00.000Z" },
      ],
      createdAt: "2026-02-24T15:00:00.000Z",
      updatedAt: "2026-03-05T09:00:00.000Z",
    },
    {
      id: "camp-kindred",
      title: "Kindred Meals Trial Wave",
      brand: "CREATR.UGC",
      niche: "Food",
      region: "US + Canada",
      contentType: "Story",
      budget: 12000,
      ratePerView: 0.038,
      viewCap: 175000,
      brief: "Show weeknight convenience without losing taste credibility. Hooks should open on the chaos of deciding dinner and land on speed plus freshness.",
      status: "planning",
      sourceUrl: "https://demo.creatrugc.com/briefs/kindred-meals-trial-wave",
      latestHooks: [],
      creatorStatuses: [
        { creatorId: "creator-omar", status: "pending", views: 0, earningsEstimate: 0, invitedAt: "2026-03-08T18:30:00.000Z" },
        { creatorId: "creator-lena", status: "pending", views: 0, earningsEstimate: 0, invitedAt: "2026-03-08T18:45:00.000Z" },
      ],
      createdAt: "2026-03-07T10:00:00.000Z",
      updatedAt: "2026-03-08T18:45:00.000Z",
    },
  ],
  payouts: [
    { id: "payout-1", creatorId: "creator-ava", campaignId: "camp-luma", period: "Mar 1 - Mar 7", amount: 3654, status: "pending", createdAt: "2026-03-08T08:00:00.000Z" },
    { id: "payout-2", creatorId: "creator-zoe", campaignId: "camp-luma", period: "Mar 1 - Mar 7", amount: 1962, status: "paid", createdAt: "2026-03-08T08:00:00.000Z", paidAt: "2026-03-09T12:20:00.000Z" },
    { id: "payout-3", creatorId: "creator-noah", campaignId: "camp-pulse", period: "Feb 24 - Mar 2", amount: 6677, status: "pending", createdAt: "2026-03-03T09:30:00.000Z" },
    { id: "payout-4", creatorId: "creator-isaac", campaignId: "camp-pulse", period: "Feb 24 - Mar 2", amount: 2673, status: "paid", createdAt: "2026-03-03T09:30:00.000Z", paidAt: "2026-03-04T15:45:00.000Z" },
  ],
  activity: [
    { id: "activity-1", createdAt: "2026-03-09T12:20:00.000Z", payoutId: "payout-2", campaignId: "camp-luma", creatorId: "creator-zoe", message: "Paid Zoe Lane ₹1,962 for LumaSkin Spring Reset." },
    { id: "activity-2", createdAt: "2026-03-09T11:15:00.000Z", campaignId: "camp-luma", creatorId: "creator-mila", message: "Invited Mila Ortiz to LumaSkin Spring Reset." },
    { id: "activity-3", createdAt: "2026-03-08T18:45:00.000Z", campaignId: "camp-kindred", creatorId: "creator-lena", message: "Invited Lena Brooks to Kindred Meals Trial Wave." },
    { id: "activity-4", createdAt: "2026-03-08T18:30:00.000Z", campaignId: "camp-kindred", creatorId: "creator-omar", message: "Invited Omar Vega to Kindred Meals Trial Wave." },
    { id: "activity-5", createdAt: "2026-03-05T09:00:00.000Z", campaignId: "camp-pulse", message: "Pushed fresh tech hooks to approved creators for PulsePod Creator Sprint." },
    { id: "activity-6", createdAt: "2026-03-02T16:40:00.000Z", campaignId: "camp-luma", creatorId: "creator-zoe", message: "Approved Zoe Lane for LumaSkin Spring Reset." },
    { id: "activity-7", createdAt: "2026-03-02T14:10:00.000Z", campaignId: "camp-luma", creatorId: "creator-ava", message: "Approved Ava Hart for LumaSkin Spring Reset." },
    { id: "activity-8", createdAt: "2026-02-27T10:00:00.000Z", campaignId: "camp-pulse", creatorId: "creator-rhea", message: "Rejected Rhea Singh for PulsePod Creator Sprint." },
  ],
};
