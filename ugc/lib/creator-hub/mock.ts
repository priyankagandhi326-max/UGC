export type CreatorHubCampaign = {
  id: string;
  brandName: string;
  brandColor: string;
  campaignName: string;
  basePay: number;
  claimed: string;
  maxPayout: number;
  pool: string;
  creators: number;
  progress: number;
  exclusive?: boolean;
  description: string;
  requirements: string[];
  payouts: Array<{ views: string; amount: number }>;
};

export type CreatorHubPost = {
  id: string;
  campaignName: string;
  brandName: string;
  brandColor: string;
  status: "approved" | "under_review" | "rejected";
  uploadedOn: string;
  views: string;
  earnings: number;
};

export type CreatorHubActivity = {
  id: string;
  message: string;
  time: string;
  type: "approval" | "milestone" | "campaign" | "application";
};

export type CreatorHubPayout = {
  id: string;
  date: string;
  campaign: string;
  amount: number;
  status: "paid" | "pending";
};

export const creatorHubData = {
  earnings: 2400,
  walletBalance: 12450,
  totalViews: 105514,
  totalRevenueGenerated: 84200,
  campaignOpportunities: [
    {
      id: "1",
      brandName: "CREATR",
      brandColor: "#BFF6C3",
      campaignName: "CREATR.UGC Creator Launch",
      basePay: 2500,
      claimed: "₹58,00,000",
      maxPayout: 15000,
      pool: "₹10,00,000",
      creators: 2847,
      progress: 0.85,
      description:
        "Create native creator-led launch content showing how CREATR.UGC helps creators monetize, ship better briefs, and scale performance-based campaigns.",
      requirements: [
        "Minimum 10K Instagram followers",
        "Three short-form videos over 10 days",
        "Tag @creatrugc and add campaign CTA in caption",
      ],
      payouts: [
        { views: "50K views", amount: 500 },
        { views: "1L views", amount: 1200 },
        { views: "2.5L views", amount: 2500 },
        { views: "5L views", amount: 5000 },
      ],
    },
    {
      id: "2",
      brandName: "GlowLab",
      brandColor: "#F7A8CC",
      campaignName: "GlowLab Reset Routine",
      basePay: 1500,
      claimed: "₹3,20,000",
      maxPayout: 8000,
      pool: "₹5,00,000",
      creators: 1204,
      progress: 0.45,
      description:
        "Film a natural skincare reset with before-and-after framing, texture shots, and a sharp explanation of why the routine is easy to stick with.",
      requirements: [
        "Beauty or lifestyle audience fit",
        "Two reels plus one story frame set",
        "Show routine in natural lighting",
      ],
      payouts: [
        { views: "50K views", amount: 300 },
        { views: "1L views", amount: 700 },
        { views: "2.5L views", amount: 1500 },
        { views: "5L views", amount: 3000 },
      ],
    },
    {
      id: "3",
      brandName: "DeskMate",
      brandColor: "#9CC9FF",
      campaignName: "DeskMate Setup Stories",
      basePay: 2000,
      claimed: "₹95,000",
      maxPayout: 10000,
      pool: "₹12,00,000",
      creators: 3421,
      progress: 0.62,
      exclusive: true,
      description:
        "Build aspirational work-from-home setup content showing how DeskMate improves focus, aesthetics, and everyday creator workflow.",
      requirements: [
        "Desk setup or productivity niche",
        "One hero reel plus static story cutdowns",
        "Product must appear within the first 3 seconds",
      ],
      payouts: [
        { views: "50K views", amount: 400 },
        { views: "1L views", amount: 1000 },
        { views: "2.5L views", amount: 2000 },
        { views: "5L views", amount: 4000 },
      ],
    },
  ] satisfies CreatorHubCampaign[],
  posts: [
    {
      id: "post-1",
      campaignName: "CREATR.UGC Creator Launch",
      brandName: "CREATR",
      brandColor: "#BFF6C3",
      status: "approved",
      uploadedOn: "Mar 14, 2026",
      views: "69,873",
      earnings: 2500,
    },
    {
      id: "post-2",
      campaignName: "GlowLab Reset Routine",
      brandName: "GlowLab",
      brandColor: "#F7A8CC",
      status: "under_review",
      uploadedOn: "Mar 10, 2026",
      views: "23,441",
      earnings: 0,
    },
    {
      id: "post-3",
      campaignName: "DeskMate Setup Stories",
      brandName: "DeskMate",
      brandColor: "#9CC9FF",
      status: "approved",
      uploadedOn: "Feb 28, 2026",
      views: "12,200",
      earnings: 800,
    },
  ] satisfies CreatorHubPost[],
  applications: [
    {
      id: "app-1",
      campaignName: "GlowLab Reset Routine",
      brandName: "GlowLab",
      status: "under review" as const,
      appliedOn: "Mar 11, 2026",
      note: "Awaiting brand approval. Keep posting skincare baseline content for match confidence.",
    },
    {
      id: "app-2",
      campaignName: "DeskMate Setup Stories",
      brandName: "DeskMate",
      status: "approved" as const,
      appliedOn: "Feb 22, 2026",
      note: "Approved. Deliver the hero reel within 5 days to unlock view bonus tier.",
    },
    {
      id: "app-3",
      campaignName: "MorningSip Coffee UGC",
      brandName: "MorningSip",
      status: "rejected" as const,
      appliedOn: "Feb 04, 2026",
      note: "Not a fit for current niche filter. Try lifestyle morning routine briefs next.",
    },
  ],
  notifications: [
    { id: "note-1", message: "Your DeskMate post is approved. Bonuses unlock after 50K views.", time: "2h ago" },
    { id: "note-2", message: "New campaign: GlowLab Reset Routine is trending this week.", time: "1d ago" },
    { id: "note-3", message: "Pending payout available. Add a payment method to withdraw.", time: "2d ago" },
  ],
  activities: [
    { id: "activity-1", message: "Your CREATR.UGC launch post was approved", time: "2h ago", type: "approval" },
    { id: "activity-2", message: "₹500 bonus milestone reached on GlowLab", time: "5h ago", type: "milestone" },
    { id: "activity-3", message: "New campaign available: DeskMate Setup Stories", time: "1d ago", type: "campaign" },
    { id: "activity-4", message: "Application shortlisted for MorningSip", time: "2d ago", type: "application" },
  ] satisfies CreatorHubActivity[],
  payoutHistory: [
    { id: "payout-1", date: "Mar 1, 2026", campaign: "CREATR.UGC Creator Launch", amount: 1200, status: "paid" },
    { id: "payout-2", date: "Feb 15, 2026", campaign: "GlowLab Reset Routine", amount: 800, status: "paid" },
    { id: "payout-3", date: "Mar 18, 2026", campaign: "DeskMate Setup Stories", amount: 600, status: "pending" },
  ] satisfies CreatorHubPayout[],
  paymentMethods: [
    { id: "pm-1", type: "UPI", label: "delhi.vibes@upi", status: "primary" as const },
    { id: "pm-2", type: "Bank", label: "HDFC •••• 2804", status: "backup" as const },
  ],
  withdrawals: [
    { id: "wd-1", requestedOn: "Mar 16, 2026", amount: 600, status: "processing" as const },
    { id: "wd-2", requestedOn: "Feb 28, 2026", amount: 1200, status: "paid" as const },
  ],
  earningsBreakdown: [
    { label: "Base pay", amount: 1200 },
    { label: "View bonuses", amount: 800 },
    { label: "Referral bonus", amount: 400 },
  ],
};
