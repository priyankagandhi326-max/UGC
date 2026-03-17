"use client";

import { CreatorCard, CreatorH2, CreatorPill, CreatorStat, CreatorSub } from "@/components/creator/ui";
import { creatorHubData } from "@/lib/creator-hub/mock";
import { formatCurrency } from "@/lib/dashboard/mock";

export default function CreatorEarningsPage() {
  const pendingPayouts = creatorHubData.payoutHistory
    .filter((payout) => payout.status === "pending")
    .reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <div className="space-y-6">
      <CreatorCard>
        <CreatorH2>Earnings</CreatorH2>
        <CreatorSub>Payout history, withdrawal requests, and payment methods live here. Keep this clean so brands trust your ops.</CreatorSub>
      </CreatorCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <CreatorStat label="Total earnings" value={formatCurrency(creatorHubData.earnings)} detail="All-time creator earnings" />
        <CreatorStat label="Wallet balance" value={formatCurrency(creatorHubData.walletBalance)} detail="Available to withdraw" />
        <CreatorStat label="Pending payouts" value={formatCurrency(pendingPayouts)} detail="Awaiting approval or processing" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CreatorCard>
          <div className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>Payout history</div>
          <div className="mt-2 text-xl font-semibold tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>Recent payouts</div>
          <div className="mt-5 space-y-3">
            {creatorHubData.payoutHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "var(--panel-border)" }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.campaign}</div>
                  <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(item.amount)}</div>
                  <CreatorPill tone={item.status === "paid" ? "mint" : "warning"}>{item.status}</CreatorPill>
                </div>
              </div>
            ))}
          </div>
        </CreatorCard>

        <div className="space-y-4">
          <CreatorCard>
            <div className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>Withdrawals</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>Withdrawal requests</div>
            <div className="mt-5 space-y-3">
              {creatorHubData.withdrawals.map((wd) => (
                <div key={wd.id} className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "var(--panel-border)" }}>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(wd.amount)}</div>
                    <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{wd.requestedOn}</div>
                  </div>
                  <CreatorPill tone={wd.status === "paid" ? "mint" : "warning"}>{wd.status}</CreatorPill>
                </div>
              ))}
            </div>
          </CreatorCard>

          <CreatorCard>
            <div className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>Payment methods</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>Where we pay you</div>
            <div className="mt-5 space-y-3">
              {creatorHubData.paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "var(--panel-border)" }}>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{pm.type}</div>
                    <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{pm.label}</div>
                  </div>
                  <CreatorPill tone={pm.status === "primary" ? "mint" : "neutral"}>{pm.status}</CreatorPill>
                </div>
              ))}
            </div>
          </CreatorCard>
        </div>
      </div>
    </div>
  );
}
