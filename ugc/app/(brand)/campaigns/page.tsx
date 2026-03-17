"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import DemoShell from "@/components/DemoShell";
import { EmptyState, FilterBar, SectionCard, SectionHeader, SegmentedControl, StatusBadge } from "@/components/dashboard/ui";
import { formatCompactNumber, formatCurrency, getCampaignsPageData } from "@/lib/dashboard/mock";
import type { CampaignStatus } from "@/lib/demo/data";
import { useDemoState } from "@/lib/demo/useDemoState";

type CampaignTab = CampaignStatus | "all";

export default function CampaignsPage() {
  const state = useDemoState();
  const campaigns = getCampaignsPageData(state);
  const [tab, setTab] = useState<CampaignTab>("active");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(campaigns[0]?.id ?? "");

  const filtered = useMemo(
    () =>
      campaigns.filter((campaign) => {
        if (tab !== "all" && campaign.status !== tab) return false;
        const target = `${campaign.title} ${campaign.niche} ${campaign.region}`.toLowerCase();
        return target.includes(search.toLowerCase());
      }),
    [campaigns, search, tab],
  );

  const selected = filtered.find((campaign) => campaign.id === selectedId) ?? filtered[0];

  return (
    <DemoShell
      title="Campaigns"
      subtitle="Campaigns are the center of the operating system: monitor staffing, spend, output, and brief health from one place."
      actions={
        <Link
          href="/campaigns/new"
          className="rounded-full bg-[linear-gradient(180deg,var(--accent),var(--accent-2))] px-5 py-3 text-sm font-semibold text-[#0d140f] transition-transform duration-200 hover:-translate-y-0.5"
        >
          New Campaign
        </Link>
      }
    >
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        children={
          <SegmentedControl
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Planning", value: "planning" },
              { label: "Completed", value: "completed" },
            ]}
            value={tab}
            onChange={setTab}
          />
        }
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-4">
          {filtered.length > 0 ? filtered.map((campaign) => (
            <button
              key={campaign.id}
              type="button"
              onClick={() => setSelectedId(campaign.id)}
              className={`w-full text-left transition-transform duration-200 hover:-translate-y-0.5 ${selected?.id === campaign.id ? "" : ""}`}
            >
              <SectionCard className={selected?.id === campaign.id ? "border-[var(--accent-border)] bg-[linear-gradient(180deg,rgba(191,246,195,0.07),rgba(255,255,255,0.02))]" : ""}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-[-0.03em]">{campaign.title}</h3>
                      <StatusBadge tone={campaign.status === "active" ? "accent" : campaign.status === "planning" ? "warning" : "muted"}>
                        {campaign.status}
                      </StatusBadge>
                    </div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)]">
                      {campaign.niche} · {campaign.region} · {campaign.contentType}
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div>
                        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Budget</div>
                        <div className="mt-2 text-base font-medium">{formatCurrency(campaign.budget)}</div>
                      </div>
                      <div>
                        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Creators</div>
                        <div className="mt-2 text-base font-medium">{campaign.creatorsLive}/{campaign.creatorsNeeded} live</div>
                      </div>
                      <div>
                        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Performance</div>
                        <div className="mt-2 text-base font-medium">{formatCompactNumber(campaign.views)} views</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-[220px]">
                    <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Budget used</div>
                    <div className="mt-2 text-lg font-medium">{formatCurrency(campaign.spend)}</div>
                    <div className="mt-3 h-2 rounded-full bg-white/8">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]"
                        style={{ width: `${Math.min(100, (campaign.spend / campaign.budget) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)]">{campaign.healthScore}/100 campaign health</div>
                  </div>
                </div>
              </SectionCard>
            </button>
          )) : <EmptyState title="No campaigns match this filter" detail="Try another status or clear the search to see all campaign workflows." />}
        </div>

        <SectionCard className="h-fit xl:sticky xl:top-28">
          {selected ? (
            <>
              <SectionHeader eyebrow="Campaign detail panel" title={selected.title} detail={`${selected.niche} · ${selected.region} · ${selected.contentType}`} />
              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                {selected.brief}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Payout model</div>
                  <div className="mt-2 text-sm font-medium">{selected.payoutModel}</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Assets</div>
                  <div className="mt-2 text-sm font-medium">{selected.assetsCount} assets uploaded</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Requirements</div>
                <div className="mt-3 space-y-2">
                  {selected.requirements.map((requirement) => (
                    <div key={requirement} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-[var(--text-secondary)]">
                      {requirement}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Creators assigned</div>
                <div className="mt-3 space-y-3">
                  {selected.assignedCreators.map((creator) => (
                    <div key={creator.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div>
                        <div className="text-sm font-medium">{creator.handle}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{creator.niche} · {formatCompactNumber(creator.followers)} followers</div>
                      </div>
                      <StatusBadge tone="muted">{creator.region}</StatusBadge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <EmptyState title="Select a campaign" detail="Choose a campaign from the list to inspect the brief, requirements, and staffing." />
          )}
        </SectionCard>
      </div>
    </DemoShell>
  );
}
