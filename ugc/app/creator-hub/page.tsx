"use client";

import Link from "next/link";

import { CreatorCard, CreatorH2, CreatorPill, CreatorStat, CreatorSub } from "@/components/creator/ui";
import { creatorHubData } from "@/lib/creator-hub/mock";
import { formatCompactNumber, formatCurrency } from "@/lib/dashboard/mock";

export default function CreatorHubHomePage() {
  const pendingPayouts = creatorHubData.payoutHistory
    .filter((payout) => payout.status === "pending")
    .reduce((sum, payout) => sum + payout.amount, 0);

  const activeCampaigns = creatorHubData.posts.filter((post) => post.status === "approved").length;

  return (
    <div className="space-y-6">
      <CreatorCard className="overflow-hidden bg-[linear-gradient(180deg,rgba(172,225,175,0.28),rgba(255,255,255,0.7))]">
        <CreatorPill>Welcome back</CreatorPill>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CreatorH2>Creator performance overview</CreatorH2>
            <CreatorSub>
              Track approvals, earnings, and active campaigns in one personal hub. Apply faster, post faster, get paid faster.
            </CreatorSub>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/creator-hub/campaigns"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#133019]"
              style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2))" }}
            >
              Browse campaigns
            </Link>
            <Link
              href="/creator-hub/earnings"
              className="rounded-full px-5 py-2.5 text-sm font-semibold"
              style={{ background: "var(--panel-2)", border: "1px solid var(--panel-border)", color: "var(--text-secondary)" }}
            >
              View earnings
            </Link>
          </div>
        </div>
      </CreatorCard>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <CreatorStat
          label="Total earnings"
          value={formatCurrency(creatorHubData.earnings)}
          detail="Includes base pay and view bonuses"
        />
        <CreatorStat
          label="Pending payouts"
          value={formatCurrency(pendingPayouts)}
          detail="Ready to withdraw once approved"
        />
        <CreatorStat
          label="Total views"
          value={formatCompactNumber(creatorHubData.totalViews)}
          detail="Across approved campaign posts"
        />
        <CreatorStat
          label="Revenue generated"
          value={formatCurrency(creatorHubData.totalRevenueGenerated)}
          detail="Estimated brand-attributed value"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <CreatorCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>
                Active work
              </div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>
                {activeCampaigns} active campaigns live
              </div>
              <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                Keep your pipeline warm: apply to 2 more campaigns to stay consistently booked.
              </div>
            </div>
            <Link
              href="/creator-hub/applications"
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--panel-2)", border: "1px solid var(--panel-border)", color: "var(--text-secondary)" }}
            >
              View applications
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {creatorHubData.posts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3"
                style={{ borderColor: "var(--panel-border)" }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {post.campaignName}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {post.uploadedOn} · {post.views} views
                  </div>
                </div>
                <CreatorPill tone={post.status === "approved" ? "mint" : post.status === "under_review" ? "warning" : "neutral"}>
                  {post.status.replace("_", " ")}
                </CreatorPill>
              </div>
            ))}
          </div>
        </CreatorCard>

        <CreatorCard>
          <div className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>
            Notifications
          </div>
          <div className="mt-2 text-xl font-semibold tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>
            Recent updates
          </div>
          <div className="mt-5 space-y-3">
            {creatorHubData.notifications.map((note) => (
              <div key={note.id} className="rounded-2xl border bg-white/70 p-4" style={{ borderColor: "var(--panel-border)" }}>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{note.message}</div>
                <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{note.time}</div>
              </div>
            ))}
          </div>
        </CreatorCard>
      </div>
    </div>
  );
}
