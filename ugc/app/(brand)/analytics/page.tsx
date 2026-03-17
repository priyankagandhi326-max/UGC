"use client";

import DemoShell from "@/components/DemoShell";
import { getCampaignSpend, getCampaignViews } from "@/lib/demo/store";
import { useDemoState } from "@/lib/demo/useDemoState";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function makeSeries(total: number) {
  const weights = [0.08, 0.13, 0.17, 0.2, 0.18, 0.14, 0.1];
  return weights.map((w, i) => ({ label: `W${i + 1}`, value: Math.round(total * w) }));
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-6 ${className}`} style={{ background: "#111111", border: "1px solid #1F1F1F" }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "#666" }}>
      {children}
    </span>
  );
}

export default function AnalyticsPage() {
  const state = useDemoState();

  const totalViews = state.campaigns.reduce((sum, c) => sum + getCampaignViews(c), 0);
  const totalSpend = state.campaigns.reduce((sum, c) => sum + getCampaignSpend(c), 0);
  const activeCampaigns = state.campaigns.filter((c) => c.status === "active").length;
  const approvedCreators = state.campaigns.reduce(
    (sum, c) => sum + c.creatorStatuses.filter((m) => m.status === "approved").length,
    0,
  );

  const viewsSeries = makeSeries(totalViews);
  const maxViews = Math.max(...viewsSeries.map((p) => p.value), 1);

  const hookPerformance = state.campaigns
    .flatMap((c) =>
      c.latestHooks.map((hook, i) => ({
        id: `${c.id}-${i}`,
        hook,
        campaign: c.title,
        score: Math.max(50, 92 - i * 7 + Math.round(getCampaignViews(c) / 25000)),
      })),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const leaderboard = state.creators
    .map((creator) => ({
      creator,
      views: state.campaigns.reduce(
        (sum, c) => sum + (c.creatorStatuses.find((m) => m.creatorId === creator.id)?.views ?? 0),
        0,
      ),
    }))
    .filter((e) => e.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const maxHookScore = Math.max(...hookPerformance.map((h) => h.score), 1);
  const maxCreatorViews = Math.max(...leaderboard.map((e) => e.views), 1);

  return (
    <DemoShell title="Analytics" subtitle="Trendlines, hook performance, and creator contribution at a glance.">

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total Views", value: totalViews.toLocaleString("en-IN") },
          { label: "Active Campaigns", value: String(activeCampaigns) },
          { label: "Total Spend", value: fmt(totalSpend) },
          { label: "Creators Live", value: String(approvedCreators) },
        ].map((stat) => (
          <Card key={stat.label}>
            <SectionLabel>{stat.label}</SectionLabel>
            <div
              className="font-display mt-3 text-[2rem] leading-none text-white"
              style={{ letterSpacing: "0.01em" }}
            >
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Views Over Time */}
      <Card className="mt-5">
        <SectionLabel>Views Over Time</SectionLabel>
        <div className="mt-6 flex h-52 items-end gap-2">
          {viewsSeries.map((pt) => (
            <div key={pt.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: `${(pt.value / maxViews) * 100}%`,
                  minHeight: "4px",
                  background: "linear-gradient(180deg, #39FF14, rgba(57,255,20,0.2))",
                }}
              />
              <span className="text-[0.65rem]" style={{ color: "#444" }}>{pt.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 2-col: Hook Performance + Leaderboard */}
      <div className="mt-5 grid gap-5 xl:grid-cols-2">

        {/* Hook Performance */}
        <Card>
          <SectionLabel>Hook Performance</SectionLabel>
          {hookPerformance.length === 0 ? (
            <p className="mt-4 text-[0.8rem]" style={{ color: "#444" }}>
              No hooks yet. Generate hooks from a campaign detail page.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {hookPerformance.map((item) => (
                <div key={item.id}>
                  <div className="mb-1.5 flex items-start justify-between gap-3 text-[0.8rem]">
                    <span className="leading-snug" style={{ color: "#ccc" }}>{item.hook}</span>
                    <span
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: "rgba(57,255,20,0.1)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.2)" }}
                    >
                      {item.score}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "#1F1F1F" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(item.score / maxHookScore) * 100}%`, background: "#39FF14" }}
                    />
                  </div>
                  <div className="mt-1 text-[0.68rem]" style={{ color: "#444" }}>{item.campaign}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Creator Leaderboard */}
        <Card>
          <SectionLabel>Creator Leaderboard</SectionLabel>
          {leaderboard.length === 0 ? (
            <p className="mt-4 text-[0.8rem]" style={{ color: "#444" }}>
              No creator performance data yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {leaderboard.map(({ creator, views }, i) => (
                <div key={creator.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                        style={i === 0 ? { background: "#39FF14", color: "#000" } : { background: "#1A1A1A", color: "#666" }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-[0.82rem] font-medium text-white">{creator.name}</div>
                        <div className="text-[0.68rem]" style={{ color: "#666" }}>{creator.handle}</div>
                      </div>
                    </div>
                    <span className="text-[0.78rem]" style={{ color: "#666" }}>
                      {views.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "#1F1F1F" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(views / maxCreatorViews) * 100}%`, background: "#39FF14" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Campaign breakdown table */}
      <Card className="mt-5">
        <SectionLabel>Campaign Breakdown</SectionLabel>
        <div className="mt-4 overflow-hidden rounded-lg" style={{ border: "1px solid #1F1F1F" }}>
          <table className="min-w-full text-left">
            <thead style={{ background: "#0F0F0F" }}>
              <tr>
                {["Campaign", "Status", "Views", "Spend", "Creators"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[0.65rem] font-medium uppercase tracking-[0.1em]"
                    style={{ color: "#444" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.campaigns.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ borderTop: i > 0 ? "1px solid #1A1A1A" : undefined }}
                >
                  <td className="px-4 py-3">
                    <div className="text-[0.82rem] font-medium text-white">{c.title}</div>
                    <div className="text-[0.68rem]" style={{ color: "#666" }}>{c.niche}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                      style={
                        c.status === "active"
                          ? { background: "#39FF14", color: "#000" }
                          : c.status === "planning"
                          ? { background: "rgba(255,184,0,0.1)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.2)" }
                          : { background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" }
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[0.82rem]" style={{ color: "#ccc" }}>
                    {getCampaignViews(c).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-[0.82rem]" style={{ color: "#ccc" }}>
                    {fmt(getCampaignSpend(c))}
                  </td>
                  <td className="px-4 py-3 text-[0.82rem]" style={{ color: "#ccc" }}>
                    {c.creatorStatuses.filter((m) => m.status === "approved").length} approved
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DemoShell>
  );
}
