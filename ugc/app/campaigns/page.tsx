"use client";

import { useState } from "react";
import Link from "next/link";

import DemoShell from "@/components/DemoShell";
import type { CampaignStatus } from "@/lib/demo/data";
import { getCampaignCreators, getCampaignSpend, getCampaignViews } from "@/lib/demo/store";
import { useDemoState } from "@/lib/demo/useDemoState";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const TABS: { label: string; value: CampaignStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Planning", value: "planning" },
  { label: "Completed", value: "completed" },
];

function statusStyle(s: CampaignStatus) {
  if (s === "active") return { background: "#39FF14", color: "#000" };
  if (s === "planning") return { background: "rgba(255,184,0,0.1)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.2)" };
  return { background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" };
}

export default function CampaignsPage() {
  const state = useDemoState();
  const [tab, setTab] = useState<CampaignStatus | "all">("all");

  const filtered = state.campaigns.filter((c) => tab === "all" || c.status === tab);

  return (
    <DemoShell
      title="Campaigns"
      subtitle="Track status, creator pipeline, spend pacing, and hook pushes."
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
      {/* Filter tabs */}
      <div className="mb-6 flex gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className="rounded-full px-4 py-1.5 text-[0.8rem] transition-opacity hover:opacity-85"
            style={
              tab === t.value
                ? { background: "#39FF14", color: "#000", fontWeight: 600 }
                : { background: "#111111", color: "#666", border: "1px solid #1F1F1F" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((campaign) => {
          const approved = getCampaignCreators(campaign, "approved").length;
          const pending = getCampaignCreators(campaign, "pending").length;
          const views = getCampaignViews(campaign);
          const spend = getCampaignSpend(campaign);
          const progress = campaign.budget > 0 ? Math.min(100, (spend / campaign.budget) * 100) : 0;

          return (
            <div
              key={campaign.id}
              className="rounded-xl p-6"
              style={{ background: "#111111", border: "1px solid #1F1F1F" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div
                    className="font-display truncate text-xl text-white"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    {campaign.title}
                  </div>
                  <div className="mt-1 text-[0.72rem]" style={{ color: "#666" }}>
                    {campaign.brand} · {campaign.niche} · {campaign.contentType} · {campaign.region}
                  </div>
                </div>
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={statusStyle(campaign.status)}
                >
                  {campaign.status}
                </span>
              </div>

              {/* Stats row */}
              <div className="mt-5 grid grid-cols-3 gap-4">
                {[
                  { label: "Creators", value: `${approved} / ${approved + pending}` },
                  { label: "Views", value: views.toLocaleString("en-IN") },
                  { label: "Spend", value: fmt(spend) },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[0.62rem] uppercase tracking-[0.1em]" style={{ color: "#444" }}>
                      {s.label}
                    </div>
                    <div className="mt-1 text-[0.95rem] font-semibold text-white">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div
                  className="mb-2 flex justify-between text-[0.62rem] uppercase tracking-[0.1em]"
                  style={{ color: "#444" }}
                >
                  <span>Budget Pace</span>
                  <span>{fmt(spend)} / {fmt(campaign.budget)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "#1F1F1F" }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%`, background: "#39FF14" }}
                  />
                </div>
              </div>

              {/* Footer link */}
              <div className="mt-5 flex justify-end">
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="rounded-full px-4 py-1.5 text-[0.78rem] transition-opacity hover:opacity-70"
                  style={{ background: "#0F0F0F", border: "1px solid #2A2A2A", color: "#ccc" }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            className="col-span-2 rounded-xl p-12 text-center text-sm"
            style={{ border: "1px dashed #2A2A2A", color: "#444" }}
          >
            No campaigns match this filter.
          </div>
        )}
      </div>
    </DemoShell>
  );
}
