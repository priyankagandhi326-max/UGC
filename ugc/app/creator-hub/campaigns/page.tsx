"use client";

import { useMemo, useState } from "react";

import { CreatorCard, CreatorH2, CreatorPill, CreatorPrimaryButton, CreatorSub } from "@/components/creator/ui";
import { creatorHubData } from "@/lib/creator-hub/mock";
import { formatCurrency } from "@/lib/dashboard/mock";

export default function CreatorCampaignsPage() {
  const [query, setQuery] = useState("");
  const campaigns = useMemo(
    () =>
      creatorHubData.campaignOpportunities.filter((campaign) =>
        `${campaign.campaignName} ${campaign.brandName}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="space-y-6">
      <CreatorCard>
        <CreatorH2>Campaigns</CreatorH2>
        <CreatorSub>Browse briefs, payout models, and requirements. Apply with one tap once your profile is ready.</CreatorSub>
        <div className="mt-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search campaigns by brand or title"
            className="h-11 w-full rounded-2xl border bg-white/70 px-4 text-sm outline-none placeholder:text-[#7a9481]"
            style={{ borderColor: "var(--panel-border)", color: "var(--text-primary)" }}
          />
        </div>
      </CreatorCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {campaigns.map((campaign) => (
          <CreatorCard key={campaign.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold text-[#0d140f]" style={{ background: campaign.brandColor }}>
                  {campaign.brandName[0]}
                </div>
                <div>
                  <div className="text-base font-semibold tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
                    {campaign.campaignName}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{campaign.brandName}</div>
                </div>
              </div>
              {campaign.exclusive ? <CreatorPill>Exclusive</CreatorPill> : <CreatorPill tone="neutral">Open</CreatorPill>}
            </div>

            <div className="mt-5 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
              {campaign.description}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-white/70 p-4" style={{ borderColor: "var(--panel-border)" }}>
                <div className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--text-tertiary)" }}>Base pay</div>
                <div className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(campaign.basePay)}</div>
              </div>
              <div className="rounded-2xl border bg-white/70 p-4" style={{ borderColor: "var(--panel-border)" }}>
                <div className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--text-tertiary)" }}>Max payout</div>
                <div className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(campaign.maxPayout)}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--text-tertiary)" }}>Requirements preview</div>
              <div className="mt-3 space-y-2">
                {campaign.requirements.slice(0, 3).map((req) => (
                  <div key={req} className="rounded-2xl border bg-white/70 px-4 py-3 text-sm" style={{ borderColor: "var(--panel-border)", color: "var(--text-secondary)" }}>
                    {req}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <CreatorPrimaryButton>Apply</CreatorPrimaryButton>
            </div>
          </CreatorCard>
        ))}
      </div>
    </div>
  );
}
