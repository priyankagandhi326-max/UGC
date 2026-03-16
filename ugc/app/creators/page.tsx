"use client";

import { useMemo, useState } from "react";

import DemoShell from "@/components/DemoShell";
import { inviteCreator } from "@/lib/demo/store";
import { useDemoState } from "@/lib/demo/useDemoState";

export default function CreatorsPage() {
  const state = useDemoState();
  const [nicheFilter, setNicheFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<Record<string, string>>({});

  const niches = [...new Set(state.creators.map((c) => c.niche))];
  const platforms = [...new Set(state.creators.flatMap((c) => c.platforms))];
  const regions = [...new Set(state.creators.map((c) => c.region))];

  const filtered = useMemo(
    () =>
      state.creators.filter((c) => {
        if (nicheFilter && c.niche !== nicheFilter) return false;
        if (platformFilter && !c.platforms.includes(platformFilter)) return false;
        if (regionFilter && c.region !== regionFilter) return false;
        return true;
      }),
    [nicheFilter, platformFilter, regionFilter, state.creators],
  );

  const selectCls = "w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none";
  const selectStyle = { background: "#0F0F0F", border: "1px solid #2A2A2A" };

  return (
    <DemoShell
      title="Creators"
      subtitle="Filter the roster, inspect fit signals, and push invites directly into a campaign."
    >
      {/* Filters */}
      <div
        className="mb-6 grid gap-4 rounded-xl p-5 sm:grid-cols-3"
        style={{ background: "#111111", border: "1px solid #1F1F1F" }}
      >
        {[
          { label: "Niche", value: nicheFilter, set: setNicheFilter, opts: niches, placeholder: "All niches" },
          { label: "Platform", value: platformFilter, set: setPlatformFilter, opts: platforms, placeholder: "All platforms" },
          { label: "Region", value: regionFilter, set: setRegionFilter, opts: regions, placeholder: "All regions" },
        ].map(({ label, value, set, opts, placeholder }) => (
          <label key={label} className="block">
            <span className="mb-2 block text-[0.72rem]" style={{ color: "#666" }}>{label}</span>
            <select value={value} onChange={(e) => set(e.target.value)} className={selectCls} style={selectStyle}>
              <option value="">{placeholder}</option>
              {opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        ))}
      </div>

      {/* Creator grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((creator) => (
          <article
            key={creator.id}
            className="flex flex-col rounded-xl p-6"
            style={{ background: "#111111", border: "1px solid #1F1F1F" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div
                  className="font-display text-[1.1rem] text-white"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {creator.handle}
                </div>
                <div className="mt-0.5 text-[0.78rem]" style={{ color: "#666" }}>
                  {creator.name}
                </div>
              </div>
              <span
                className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={{
                  background: "rgba(57,255,20,0.08)",
                  color: "#39FF14",
                  border: "1px solid rgba(57,255,20,0.2)",
                }}
              >
                {creator.credits}★
              </span>
            </div>

            {/* Meta */}
            <div className="mt-4 space-y-1.5 text-[0.78rem]" style={{ color: "#666" }}>
              <div>{creator.niche} · {creator.region}</div>
              <div>{creator.followers.toLocaleString("en-IN")} followers</div>
              <div>{creator.platforms.join(" / ")}</div>
            </div>

            {/* Invite */}
            <div className="mt-5 space-y-2.5">
              <select
                value={selectedCampaigns[creator.id] ?? ""}
                onChange={(event) =>
                  setSelectedCampaigns((current) => ({ ...current, [creator.id]: event.target.value }))
                }
                className={selectCls}
                style={selectStyle}
              >
                <option value="">Select campaign to invite</option>
                {state.campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                ))}
              </select>

              <button
                type="button"
                disabled={!selectedCampaigns[creator.id]}
                onClick={() => inviteCreator(selectedCampaigns[creator.id], creator.id)}
                className="w-full rounded-full py-2.5 text-[0.8rem] font-semibold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
                style={{ background: "#39FF14" }}
              >
                Invite to Campaign
              </button>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div
            className="col-span-3 rounded-xl p-12 text-center text-sm"
            style={{ border: "1px dashed #2A2A2A", color: "#444" }}
          >
            No creators match the current filters.
          </div>
        )}
      </div>
    </DemoShell>
  );
}
