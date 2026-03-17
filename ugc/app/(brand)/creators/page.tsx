"use client";

import { useMemo, useState } from "react";

import DemoShell from "@/components/DemoShell";
import { EmptyState, FilterBar, QuickActionCard, SectionCard, SectionHeader, SegmentedControl, StatusBadge } from "@/components/dashboard/ui";
import { formatCompactNumber, formatCurrency, getCreatorsPageData } from "@/lib/dashboard/mock";
import { useDemoState } from "@/lib/demo/useDemoState";

type CreatorTab = "applied" | "approved" | "pending" | "invited";

export default function CreatorsPage() {
  const state = useDemoState();
  const data = getCreatorsPageData(state);
  const [tab, setTab] = useState<CreatorTab>("approved");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () =>
      data.creatorList.filter((creator) => {
        if (tab === "invited") {
          if (creator.status !== "pending") return false;
        } else if (creator.status !== tab) {
          return false;
        }

        const target = `${creator.handle} ${creator.niche} ${creator.region} ${creator.campaign}`.toLowerCase();
        return target.includes(search.toLowerCase());
      }),
    [data.creatorList, search, tab],
  );

  return (
    <DemoShell
      title="Creators"
      subtitle="Operational visibility into who has applied, who is approved, what they are delivering, and what needs follow-up."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard>
          <SectionHeader eyebrow="Top performers" title="Creators driving view lift" />
          <div className="mt-4 space-y-3">
            {data.topPerformers.map((creator) => (
              <div key={creator.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{creator.handle}</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">{creator.campaign}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCompactNumber(creator.views)}</div>
                    <div className="text-sm text-[var(--text-tertiary)]">views delivered</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader eyebrow="Creators in your niche" title="High-fit roster" />
          <div className="mt-4 space-y-3">
            {data.nicheMatches.map((creator) => (
              <div key={creator.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-medium">{creator.handle}</div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">{creator.niche}</div>
                <div className="mt-2 text-sm text-[var(--text-tertiary)]">{creator.fit}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader eyebrow="Quick match suggestions" title="Recommended next moves" />
          <div className="mt-4 space-y-3">
            {data.quickMatches.map((suggestion) => (
              <QuickActionCard key={suggestion} title={suggestion} detail="Use creator ops to invite, approve, or rebalance campaign staffing." />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          children={
            <SegmentedControl
              options={[
                { label: "Applied", value: "applied" },
                { label: "Approved", value: "approved" },
                { label: "Pending", value: "pending" },
                { label: "Invited", value: "invited" },
              ]}
              value={tab}
              onChange={setTab}
            />
          }
        />
      </div>

      <SectionCard className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          {rows.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-white/[0.03]">
                <tr className="text-left text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                  {["Creator", "Niche", "Region", "Followers", "Status", "Views", "Campaign", "Payout"].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((creator) => (
                  <tr key={creator.id} className="border-t border-white/6 text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--panel-2)] text-sm font-semibold">
                          {creator.handle.slice(1, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{creator.handle}</div>
                          <div className="text-[var(--text-secondary)]">{creator.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">{creator.niche}</td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">{creator.region}</td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">{creator.followerBand}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={creator.status === "approved" ? "accent" : creator.status === "pending" ? "warning" : "muted"}>
                        {creator.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4">{formatCompactNumber(creator.views)}</td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">{creator.campaign}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium">{formatCurrency(creator.payoutAmount)}</div>
                      <div className="text-[var(--text-tertiary)]">
                        {creator.payoutStatus === "paid" ? "paid" : creator.payoutStatus === "pending" ? "pending approval" : "not started"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6">
              <EmptyState title="No creators in this stage" detail="Shift tabs or broaden the search to review another part of the creator pipeline." />
            </div>
          )}
        </div>
      </SectionCard>
    </DemoShell>
  );
}
