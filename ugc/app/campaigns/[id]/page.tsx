"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import ClientTime from "@/components/ClientTime";
import DemoShell from "@/components/DemoShell";
import type { CampaignCreator } from "@/lib/demo/data";
import {
  approveCreator,
  getCampaignSpend,
  getCampaignViews,
  pushHooksToCampaign,
  rejectCreator,
} from "@/lib/demo/store";
import { useDemoState } from "@/lib/demo/useDemoState";

// ─── Hook templates ───────────────────────────────────────────────────────────
const HOOK_TEMPLATES: Record<string, string[]> = {
  Beauty: [
    "I stopped overcomplicating my routine when I found this {niche} shortcut.",
    "This is the {niche} fix I wish someone told me about sooner.",
    "I tested a simpler {niche} reset and noticed the difference by day three.",
    "If your camera-ready routine feels flat, start with this {niche} move.",
    "The easiest way to make {niche} feel effortless again starts here.",
  ],
  Food: [
    "Dinner decision fatigue ended when I tried this {niche} shortcut.",
    "This is what I make when I need {niche} content and a real meal in ten minutes.",
    "I wanted a faster {niche} routine without sacrificing taste, so I tried this.",
    "The easiest way to make weeknights feel less chaotic is this {niche} swap.",
    "I did one {niche} trial and immediately added it to my weekly rotation.",
  ],
  Fitness: [
    "If your routine keeps stalling, try this {niche} reset first.",
    "I changed one {niche} habit and my consistency got easier.",
    "This is the pre-workout {niche} trick I keep repeating.",
    "I tested a low-friction {niche} plan and actually stuck with it.",
    "Before you buy another fitness gadget, try this {niche} angle.",
  ],
  Tech: [
    "I thought this was overhyped until one real-world {niche} test changed my mind.",
    "This is the {niche} feature I noticed before I even checked the specs.",
    "If your daily setup feels clunky, start with this {niche} fix.",
    "I used this through my busiest day and finally understood the {niche} pitch.",
    "The fastest way to know if this tech is worth it is this {niche} scenario.",
  ],
  Lifestyle: [
    "I did not expect this {niche} habit to make my routine feel lighter.",
    "This is the low-effort {niche} upgrade that made my mornings smoother.",
    "I tried one simple {niche} switch and kept it in my routine all week.",
    "If your day feels crowded, this {niche} shortcut helps instantly.",
    "The easiest way to make everyday content feel more real is this {niche} angle.",
  ],
};

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

type Tab = "overview" | "creators" | "hooks" | "activity";

// ─── Sub-components ───────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-6 ${className}`}
      style={{ background: "#111111", border: "1px solid #1F1F1F" }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.65rem] uppercase tracking-[0.12em]" style={{ color: "#666" }}>
      {children}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const state = useDemoState();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [creatorTab, setCreatorTab] = useState<CampaignCreator["status"]>("approved");
  const [sourceUrl, setSourceUrl] = useState("");
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);

  const campaign = state.campaigns.find((c) => c.id === params.id);
  if (!campaign) notFound();
  const c = campaign;

  const creatorsById = useMemo(
    () => new Map(state.creators.map((cr) => [cr.id, cr])),
    [state.creators],
  );

  const spend = getCampaignSpend(c);
  const views = getCampaignViews(c);
  const progress = c.budget > 0 ? Math.min(100, (spend / c.budget) * 100) : 0;
  const tabMembers = c.creatorStatuses
    .filter((m) => m.status === creatorTab)
    .sort((a, b) => (a.invitedAt < b.invitedAt ? 1 : -1));
  const campaignActivity = state.activity.filter((a) => a.campaignId === c.id).slice(0, 8);

  const hookList = generatedHooks.length > 0 ? generatedHooks : c.latestHooks;

  function generateHooks() {
    const templates = HOOK_TEMPLATES[c.niche] ?? HOOK_TEMPLATES.Lifestyle;
    setGeneratedHooks(templates.map((t) => t.replaceAll("{niche}", c.niche.toLowerCase())));
  }

  function pushHooks() {
    if (generatedHooks.length === 0) return;
    pushHooksToCampaign(
      c.id,
      generatedHooks.map((h) => (sourceUrl ? `${h} [src: ${sourceUrl}]` : h)),
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "creators", label: `Creators (${c.creatorStatuses.length})` },
    { key: "hooks", label: "Hook Engine" },
    { key: "activity", label: "Activity" },
  ];

  const statusStyle = (s: string) => {
    if (s === "active") return { background: "#39FF14", color: "#000" };
    if (s === "planning") return { background: "rgba(255,184,0,0.1)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.2)" };
    return { background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" };
  };

  return (
    <DemoShell
      title={c.title}
      actions={
        <Link
          href="/campaigns"
          className="rounded-full px-4 py-2 text-[0.78rem] transition-opacity hover:opacity-70"
          style={{ background: "#0F0F0F", border: "1px solid #2A2A2A", color: "#ccc" }}
        >
          ← Campaigns
        </Link>
      }
    >
      {/* Meta row */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {[c.status, c.contentType, c.niche, c.region].map((v) => (
          <span
            key={v}
            className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={v === c.status ? statusStyle(v) : { background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" }}
          >
            {v}
          </span>
        ))}
      </div>

      {/* Tab strip */}
      <div className="mb-6 flex gap-1 border-b" style={{ borderColor: "#1F1F1F" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className="rounded-t-lg px-5 py-2.5 text-[0.8rem] transition-colors"
            style={
              activeTab === t.key
                ? { color: "#39FF14", borderBottom: "2px solid #39FF14", marginBottom: "-1px" }
                : { color: "#666" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Budget", value: fmt(c.budget) },
              { label: "Views", value: views.toLocaleString("en-IN") },
              { label: "Spend", value: fmt(spend) },
            ].map((s) => (
              <Card key={s.label}>
                <Label>{s.label}</Label>
                <div
                  className="font-display mt-2 text-[1.8rem] leading-none text-white"
                  style={{ letterSpacing: "0.01em" }}
                >
                  {s.value}
                </div>
              </Card>
            ))}
          </div>

          {/* Spend tracker */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <Label>Spend Tracker</Label>
              <span className="text-[0.72rem]" style={{ color: "#666" }}>
                {fmt(spend)} / {fmt(c.budget)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "#1F1F1F" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${progress}%`, background: "#39FF14" }}
              />
            </div>
          </Card>

          {/* Brief */}
          <Card>
            <Label>Campaign Brief</Label>
            <p className="mt-3 text-[0.85rem] leading-relaxed" style={{ color: "#ccc" }}>
              {c.brief}
            </p>
          </Card>
        </div>
      )}

      {/* ── Creators ── */}
      {activeTab === "creators" && (
        <div>
          {/* Sub-tabs */}
          <div className="mb-5 flex gap-1.5">
            {(["approved", "pending", "rejected"] as CampaignCreator["status"][]).map((s) => {
              const count = c.creatorStatuses.filter((m) => m.status === s).length;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCreatorTab(s)}
                  className="rounded-full px-4 py-1.5 text-[0.78rem] transition-opacity hover:opacity-85"
                  style={
                    creatorTab === s
                      ? { background: "#39FF14", color: "#000", fontWeight: 600 }
                      : { background: "#111111", color: "#666", border: "1px solid #1F1F1F" }
                  }
                >
                  {s[0].toUpperCase() + s.slice(1)} ({count})
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {tabMembers.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center text-sm"
                style={{ border: "1px dashed #2A2A2A", color: "#444" }}
              >
                No {creatorTab} creators yet.
              </div>
            ) : (
              tabMembers.map((member) => {
                const creator = creatorsById.get(member.creatorId);
                if (!creator) return null;
                return (
                  <div
                    key={creator.id}
                    className="flex flex-col gap-4 rounded-xl p-5 md:flex-row md:items-center md:justify-between"
                    style={{ background: "#111111", border: "1px solid #1F1F1F" }}
                  >
                    <div>
                      <div className="font-display text-[1.05rem] text-white">
                        {creator.name}
                      </div>
                      <div className="mt-0.5 text-[0.78rem]" style={{ color: "#666" }}>
                        {creator.handle} · {creator.niche} · {creator.region}
                      </div>
                      <div className="mt-0.5 text-[0.72rem]" style={{ color: "#444" }}>
                        {creator.platforms.join(" / ")} · {creator.followers.toLocaleString("en-IN")} followers
                      </div>
                    </div>

                    {member.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => approveCreator(c.id, creator.id)}
                          className="rounded-full px-4 py-2 text-[0.78rem] font-semibold text-black transition-opacity hover:opacity-85"
                          style={{ background: "#39FF14" }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectCreator(c.id, creator.id)}
                          className="rounded-full px-4 py-2 text-[0.78rem] transition-opacity hover:opacity-70"
                          style={{ background: "#0F0F0F", border: "1px solid #2A2A2A", color: "#ccc" }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {member.status === "approved" && (
                      <div className="text-right">
                        <div className="text-[0.72rem]" style={{ color: "#666" }}>Projected Views</div>
                        <div className="font-display text-xl text-white">
                          {member.views.toLocaleString("en-IN")}
                        </div>
                        <div className="mt-0.5 text-[0.72rem]" style={{ color: "#39FF14" }}>
                          Earnings {fmt(member.earningsEstimate)}
                        </div>
                      </div>
                    )}

                    {member.status === "rejected" && (
                      <div className="text-[0.78rem]" style={{ color: "#444" }}>
                        Rejected{" "}
                        {member.respondedAt ? <ClientTime iso={member.respondedAt} dateOnly /> : ""}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Hook Engine ── */}
      {activeTab === "hooks" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          {/* Generator */}
          <div
            className="rounded-xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(57,255,20,0.25)", boxShadow: "0 0 24px rgba(57,255,20,0.05)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <Label><span style={{ color: "#39FF14" }}>Hook Generator</span></Label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Source URL (optional)</span>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/ad-reference"
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors"
                style={{ background: "#0F0F0F", border: "1px solid #2A2A2A" }}
              />
            </label>

            <button
              type="button"
              onClick={generateHooks}
              className="mt-4 rounded-full px-5 py-2.5 text-[0.8rem] font-semibold text-black transition-opacity hover:opacity-85"
              style={{ background: "#39FF14" }}
            >
              Generate Hooks
            </button>

            <div className="mt-5 space-y-2.5">
              {hookList.length === 0 ? (
                <div
                  className="rounded-lg p-4 text-[0.78rem]"
                  style={{ background: "#0F0F0F", border: "1px solid #1F1F1F", color: "#444" }}
                >
                  No hooks yet. Generate 5 niche-based hooks for this campaign.
                </div>
              ) : (
                hookList.map((hook, i) => (
                  <div
                    key={`${hook}-${i}`}
                    className="rounded-lg p-3.5 text-[0.8rem] leading-snug"
                    style={{ background: "#0F0F0F", border: "1px solid #1F1F1F", color: "#ccc" }}
                  >
                    <span className="mr-2 font-semibold" style={{ color: "#39FF14" }}>{i + 1}.</span>
                    {hook}
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={pushHooks}
              disabled={generatedHooks.length === 0}
              className="mt-5 w-full rounded-full py-2.5 text-[0.8rem] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
              style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#ccc" }}
            >
              Push to Approved Creators
            </button>
          </div>

          {/* Tips */}
          <div className="rounded-xl p-6" style={{ background: "#111111", border: "1px solid #1F1F1F" }}>
            <Label>Hook Tips — {c.niche}</Label>
            <ul className="mt-4 space-y-3 text-[0.8rem] leading-relaxed" style={{ color: "#666" }}>
              <li>• Open with a tension or friction your audience already feels.</li>
              <li>• Avoid product names in the first 3 seconds — lead with the outcome.</li>
              <li>• Use &ldquo;I tested&rdquo; or &ldquo;I tried&rdquo; framing for authenticity.</li>
              <li>• Aim for hooks under 12 words — shorter converts better on short-form.</li>
              <li>• End the hook with an implicit or explicit promise of the payoff.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Activity ── */}
      {activeTab === "activity" && (
        <div className="space-y-2.5">
          {campaignActivity.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center text-sm"
              style={{ border: "1px dashed #2A2A2A", color: "#444" }}
            >
              No activity yet for this campaign.
            </div>
          ) : (
            campaignActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 rounded-xl px-5 py-4"
                style={{ background: "#111111", border: "1px solid #1F1F1F" }}
              >
                <p className="text-[0.83rem]" style={{ color: "#ccc" }}>{item.message}</p>
                <p className="flex-shrink-0 text-[0.7rem]" style={{ color: "#444" }}>
                  <ClientTime iso={item.createdAt} />
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </DemoShell>
  );
}
