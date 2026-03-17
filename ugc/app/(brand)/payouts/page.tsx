"use client";

import DemoShell from "@/components/DemoShell";
import { SectionCard, SectionHeader, StatusBadge } from "@/components/dashboard/ui";
import { formatCompactNumber, formatCurrency, getPayoutsPageData } from "@/lib/dashboard/mock";
import { useDemoState } from "@/lib/demo/useDemoState";

export default function PayoutsPage() {
  const state = useDemoState();
  const payouts = getPayoutsPageData(state);

  return (
    <DemoShell
      title="Payouts"
      subtitle="Creator-level payout visibility, approval status, and campaign-linked finance review."
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {payouts.summary.map((item, index) => (
          <SectionCard key={item.label} className={index === 0 ? "bg-[linear-gradient(180deg,rgba(191,246,195,0.08),rgba(255,255,255,0.02))]" : ""}>
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">{item.label}</div>
            <div className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{item.value}</div>
            <div className="mt-3 text-sm text-[var(--text-secondary)]">{item.detail}</div>
          </SectionCard>
        ))}
      </div>

      <SectionCard className="mt-6 overflow-hidden p-0">
        <div className="border-b border-white/6 px-5 py-5">
          <SectionHeader eyebrow="CPM payout view" title="Payout operations" detail="Scan creator payout state by campaign, performance, and release readiness." />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white/[0.03] text-left text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              <tr>
                {["Creator", "Campaign", "Model", "Views", "Amount", "Status", "Action"].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.rows.map((row) => (
                <tr key={row.id} className="border-t border-white/6 text-sm">
                  <td className="px-5 py-4">
                    <div className="font-medium">{row.creator}</div>
                    <div className="text-[var(--text-secondary)]">{row.handle}</div>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{row.campaign}</td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{row.model}</td>
                  <td className="px-5 py-4">{formatCompactNumber(row.views)}</td>
                  <td className="px-5 py-4 font-medium">{formatCurrency(row.amount)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={row.status === "paid" ? "muted" : row.status === "approved" ? "accent" : "warning"}>
                      {row.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        row.status === "paid"
                          ? "border border-white/8 bg-white/[0.03] text-[var(--text-secondary)]"
                          : "bg-[linear-gradient(180deg,var(--accent),var(--accent-2))] text-[#0d140f]"
                      }`}
                    >
                      {row.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </DemoShell>
  );
}
