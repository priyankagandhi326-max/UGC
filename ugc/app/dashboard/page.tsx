"use client";

import Link from "next/link";

import ClientTime from "@/components/ClientTime";
import DemoShell from "@/components/DemoShell";
import { getCampaignSpend, getCampaignViews } from "@/lib/demo/store";
import { useDemoState } from "@/lib/demo/useDemoState";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function makeSeries(total: number) {
  const w = [0.08, 0.13, 0.17, 0.2, 0.18, 0.14, 0.1];
  return w.map((wt, i) => ({ label: `W${i + 1}`, value: Math.round(total * wt) }));
}

// ─── Shared card shell ───────────────────────────────────────────────────────
function Card({ children, className = "", glowAccent = false }: { children: React.ReactNode; className?: string; glowAccent?: boolean }) {
  return (
    <div
      className={`rounded-xl p-6 ${className}`}
      style={{
        background: "#111111",
        border: glowAccent ? "1px solid rgba(57,255,20,0.3)" : "1px solid #1F1F1F",
        boxShadow: glowAccent ? "0 0 24px rgba(57,255,20,0.05)" : undefined,
      }}
    >
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const state = useDemoState();

  const activeCampaigns = state.campaigns.filter((c) => c.status !== "completed");
  const totalViews = state.campaigns.reduce((sum, c) => sum + getCampaignViews(c), 0);
  const totalSpend = state.campaigns.reduce((sum, c) => sum + getCampaignSpend(c), 0);
  const totalBudget = state.campaigns.reduce((sum, c) => sum + c.budget, 0);
  const approvedCount = state.campaigns.reduce(
    (sum, c) => sum + c.creatorStatuses.filter((m) => m.status === "approved").length,
    0,
  );

  const viewsSeries = makeSeries(totalViews);
  const maxViews = Math.max(...viewsSeries.map((p) => p.value), 1);

  const topCreators = state.creators
    .map((creator) => ({
      creator,
      views: state.campaigns.reduce(
        (sum, c) => sum + (c.creatorStatuses.find((m) => m.creatorId === creator.id)?.views ?? 0),
        0,
      ),
    }))
    .filter((e) => e.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const maxCreatorViews = Math.max(...topCreators.map((e) => e.views), 1);
  const campaignWithHooks = state.campaigns.find((c) => c.latestHooks.length > 0);

  const stats = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString("en-IN"),
      sub: `across ${state.campaigns.length} campaigns`,
    },
    {
      label: "Active Campaigns",
      value: String(activeCampaigns.length),
      sub: `${state.campaigns.filter((c) => c.status === "planning").length} in planning`,
    },
    {
      label: "Total Spend",
      value: fmt(totalSpend),
      sub: `${totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0}% of budget`,
    },
    {
      label: "Creators Live",
      value: String(approvedCount),
      sub: `across ${activeCampaigns.length} active campaigns`,
    },
  ];

  return (
    <DemoShell
      title="Overview"
      actions={
        <Link
          href="/campaigns/new"
          className="font-display rounded-full px-5 py-2.5 text-sm uppercase tracking-wider text-black transition-opacity hover:opacity-85"
          style={{ background: "#39FF14" }}
        >
          + New Campaign
        </Link>
      }
    >
      {/* Greeting */}
      <div className="mb-8">
        <div
          className="font-display text-[2.4rem] leading-tight text-white"
          style={{ letterSpacing: "0.01em" }}
        >
          Good morning 👋
        </div>
        <p className="mt-1.5 text-sm" style={{ color: "#666" }}>
          Here&apos;s how your content is performing
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <SectionLabel>{stat.label}</SectionLabel>
            <div
              className="font-display mt-3 text-[2.2rem] leading-none text-white"
              style={{ letterSpacing: "0.01em" }}
            >
              {stat.value}
            </div>
            <p className="mt-2 text-[0.72rem]" style={{ color: "#444" }}>
              {stat.sub}
            </p>
          </Card>
        ))}
      </div>

      {/* Views Over Time */}
      <Card className="mt-5">
        <div className="flex items-center justify-between">
          <SectionLabel>Views Over Time</SectionLabel>
          <div className="flex gap-1">
            {["Today", "Week", "Month"].map((p, i) => (
              <span
                key={p}
                className="cursor-pointer rounded-full px-3 py-1 text-[0.7rem] transition-opacity hover:opacity-80"
                style={
                  i === 1
                    ? { background: "#39FF14", color: "#000", fontWeight: 600 }
                    : { background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" }
                }
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 flex h-44 items-end gap-2">
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
              <span className="text-[0.65rem]" style={{ color: "#444" }}>
                {pt.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 3-col: Hook Engine | Active Campaigns | Top Creators */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">

        {/* Hook Engine widget */}
        <Card glowAccent>
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <SectionLabel>
              <span style={{ color: "#39FF14" }}>Hook Engine</span>
            </SectionLabel>
          </div>

          {campaignWithHooks ? (
            <>
              <div className="mt-3 text-[0.8rem] font-semibold text-white">
                {campaignWithHooks.title}
              </div>
              <div className="mt-3 space-y-2">
                {campaignWithHooks.latestHooks.slice(0, 3).map((hook, i) => (
                  <div
                    key={i}
                    className="rounded-lg px-3 py-2.5 text-[0.75rem] leading-snug"
                    style={{ background: "#0F0F0F", border: "1px solid #1F1F1F", color: "#ccc" }}
                  >
                    {i + 1}. {hook}
                  </div>
                ))}
              </div>
              <Link
                href={`/campaigns/${campaignWithHooks.id}`}
                className="mt-4 block w-full rounded-full py-2 text-center text-[0.75rem] font-semibold transition-opacity hover:opacity-85"
                style={{ background: "#39FF14", color: "#000" }}
              >
                Open Campaign →
              </Link>
            </>
          ) : (
            <p className="mt-4 text-[0.8rem]" style={{ color: "#444" }}>
              No hooks yet. Open a campaign to generate hooks.
            </p>
          )}
        </Card>

        {/* Active Campaigns */}
        <Card>
          <SectionLabel>Active Campaigns</SectionLabel>
          <div className="mt-4 space-y-2.5">
            {activeCampaigns.slice(0, 4).map((c) => {
              const spend = getCampaignSpend(c);
              const views = getCampaignViews(c);
              return (
                <Link
                  key={c.id}
                  href={`/campaigns/${c.id}`}
                  className="block rounded-lg p-3 transition-colors"
                  style={{ background: "#0F0F0F", border: "1px solid #1A1A1A" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-[0.8rem] font-medium text-white">
                      {c.title}
                    </span>
                    <span
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                      style={
                        c.status === "active"
                          ? { background: "#39FF14", color: "#000" }
                          : { background: "rgba(255,184,0,0.1)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.2)" }
                      }
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex gap-3 text-[0.7rem]" style={{ color: "#666" }}>
                    <span>{views.toLocaleString("en-IN")} views</span>
                    <span>{fmt(spend)}</span>
                  </div>
                </Link>
              );
            })}
            {activeCampaigns.length === 0 && (
              <p className="text-[0.8rem]" style={{ color: "#444" }}>
                No active campaigns.
              </p>
            )}
          </div>
        </Card>

        {/* Top Creators */}
        <Card>
          <SectionLabel>Top Creators</SectionLabel>
          <div className="mt-4 space-y-4">
            {topCreators.map(({ creator, views }) => (
              <div key={creator.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div>
                    <div className="text-[0.8rem] font-medium text-white">{creator.handle}</div>
                    <div className="text-[0.68rem]" style={{ color: "#666" }}>{creator.niche}</div>
                  </div>
                  <span className="text-[0.72rem]" style={{ color: "#666" }}>
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
            {topCreators.length === 0 && (
              <p className="text-[0.8rem]" style={{ color: "#444" }}>No creator activity yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-5">
        <SectionLabel>Recent Activity</SectionLabel>
        <div className="mt-4 space-y-2.5">
          {state.activity.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-lg px-4 py-3"
              style={{ background: "#0F0F0F", border: "1px solid #1A1A1A" }}
            >
              <p className="text-[0.82rem]" style={{ color: "#ccc" }}>{item.message}</p>
              <p className="flex-shrink-0 text-[0.7rem]" style={{ color: "#444" }}>
                <ClientTime iso={item.createdAt} />
              </p>
            </div>
          ))}
        </div>
      </Card>
    </DemoShell>
  );
}
