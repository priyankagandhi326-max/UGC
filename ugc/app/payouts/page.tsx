"use client";

import ClientTime from "@/components/ClientTime";
import DemoShell from "@/components/DemoShell";
import { exportPayoutsCsv, markPayoutPaid } from "@/lib/demo/store";
import { useDemoState } from "@/lib/demo/useDemoState";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export default function PayoutsPage() {
  const state = useDemoState();

  const pendingTotal = state.payouts.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const paidTotal = state.payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pendingCount = state.payouts.filter((p) => p.status === "pending").length;

  function onExport() {
    const csv = exportPayoutsCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "creatr-demo-payouts.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DemoShell
      title="Payouts"
      subtitle="Manage pending creator payouts and export for finance review."
      actions={
        <button
          type="button"
          onClick={onExport}
          className="rounded-full px-5 py-2.5 text-[0.8rem] font-semibold transition-opacity hover:opacity-70"
          style={{ background: "#1A1A1A", color: "#ccc", border: "1px solid #2A2A2A" }}
        >
          Export CSV
        </button>
      }
    >
      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "Pending Payout", value: fmt(pendingTotal), accent: true },
          { label: "Total Paid", value: fmt(paidTotal) },
          { label: "Awaiting Payment", value: String(pendingCount) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5"
            style={{ background: "#111111", border: `1px solid ${s.accent ? "rgba(255,184,0,0.25)" : "#1F1F1F"}` }}
          >
            <span className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "#666" }}>
              {s.label}
            </span>
            <div
              className="font-display mt-2 text-[1.8rem] leading-none"
              style={{ color: s.accent ? "#FFB800" : "#FFFFFF", letterSpacing: "0.01em" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl" style={{ border: "1px solid #1F1F1F" }}>
        <table className="min-w-full text-left">
          <thead style={{ background: "#0F0F0F" }}>
            <tr>
              {["Creator", "Campaign", "Period", "Amount", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.1em]"
                  style={{ color: "#444" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.payouts.map((payout, i) => {
              const creator = state.creators.find((c) => c.id === payout.creatorId);
              const campaign = state.campaigns.find((c) => c.id === payout.campaignId);
              return (
                <tr
                  key={payout.id}
                  style={{ borderTop: i > 0 ? "1px solid #1A1A1A" : undefined }}
                >
                  <td className="px-5 py-4">
                    <div className="text-[0.85rem] font-medium text-white">{creator?.name}</div>
                    <div className="text-[0.72rem]" style={{ color: "#444" }}>{creator?.handle}</div>
                  </td>
                  <td className="px-5 py-4 text-[0.82rem]" style={{ color: "#888" }}>
                    {campaign?.title}
                  </td>
                  <td className="px-5 py-4 text-[0.82rem]" style={{ color: "#888" }}>
                    {payout.period}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-display text-[1.05rem] text-white" style={{ letterSpacing: "0.01em" }}>
                      {fmt(payout.amount)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={
                        payout.status === "paid"
                          ? { background: "#39FF14", color: "#000" }
                          : { background: "rgba(255,184,0,0.1)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.2)" }
                      }
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {payout.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => markPayoutPaid(payout.id)}
                        className="rounded-full px-4 py-1.5 text-[0.75rem] font-semibold text-black transition-opacity hover:opacity-85"
                        style={{ background: "#39FF14" }}
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-[0.72rem]" style={{ color: "#444" }}>
                        Paid {payout.paidAt ? <ClientTime iso={payout.paidAt} dateOnly /> : ""}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}
