"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DemoShell from "@/components/DemoShell";
import type { ContentType } from "@/lib/demo/data";
import { createCampaign } from "@/lib/demo/store";

const NICHE_OPTIONS = ["Beauty", "Food", "Fitness", "Tech", "Lifestyle"];
const REGION_OPTIONS = ["North America", "United States", "US + Canada", "Europe", "India", "Global"];
const CONTENT_TYPES: ContentType[] = ["Reel", "Short", "Story"];

const inputCls =
  "w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors";
const inputStyle = { background: "#0F0F0F", border: "1px solid #2A2A2A" };

export default function NewCampaignPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("CREATR.UGC");
  const [niche, setNiche] = useState("Beauty");
  const [region, setRegion] = useState("North America");
  const [contentType, setContentType] = useState<ContentType>("Reel");
  const [budget, setBudget] = useState("15000");
  const [ratePerView, setRatePerView] = useState("0.04");
  const [viewCap, setViewCap] = useState("200000");
  const [brief, setBrief] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const campaign = createCampaign({
      title,
      brand,
      niche,
      region,
      contentType,
      budget: Number(budget),
      ratePerView: Number(ratePerView),
      viewCap: Number(viewCap),
      brief,
    });
    router.push(`/campaigns/${campaign.id}`);
  }

  return (
    <DemoShell
      title="New Campaign"
      subtitle="Create a campaign with realistic economics and creator workflow baked in."
    >
      <form onSubmit={onSubmit} className="grid gap-5 xl:grid-cols-[1fr_320px]">

        {/* Main fields */}
        <div className="rounded-xl p-6" style={{ background: "#111111", border: "1px solid #1F1F1F" }}>
          <div className="grid gap-4 sm:grid-cols-2">

            {[
              { label: "Campaign Title", value: title, set: setTitle, placeholder: "Summer Product Push", type: "text" },
              { label: "Brand", value: brand, set: setBrand, placeholder: "", type: "text" },
            ].map(({ label, value, set, placeholder, type }) => (
              <label key={label} className="block">
                <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>{label}</span>
                <input
                  required
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  className={inputCls}
                  style={inputStyle}
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Niche</span>
              <select value={niche} onChange={(e) => setNiche(e.target.value)} className={inputCls} style={inputStyle}>
                {NICHE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Region</span>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputCls} style={inputStyle}>
                {REGION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Content Type</span>
              <select value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)} className={inputCls} style={inputStyle}>
                {CONTENT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Budget (₹)</span>
              <input required type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} className={inputCls} style={inputStyle} />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Rate Per View (₹)</span>
              <input required type="number" min="0" step="0.001" value={ratePerView} onChange={(e) => setRatePerView(e.target.value)} className={inputCls} style={inputStyle} />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>View Cap</span>
              <input required type="number" min="0" value={viewCap} onChange={(e) => setViewCap(e.target.value)} className={inputCls} style={inputStyle} />
            </label>
          </div>

          <div className="mt-4">
            <label className="block">
              <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Campaign Brief</span>
              <textarea
                required
                rows={6}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe the product angle, creator talking points, and what success looks like."
                className={`${inputCls} resize-none`}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* Sidebar preview */}
        <div className="rounded-xl p-6" style={{ background: "#111111", border: "1px solid #1F1F1F" }}>
          <span className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "#666" }}>
            Launch Preview
          </span>

          <div className="mt-4 space-y-3">
            {[
              { label: "Title", value: title || "—" },
              { label: "Niche", value: niche },
              { label: "Type", value: contentType },
              { label: "Region", value: region },
              { label: "Budget", value: budget ? `₹${Number(budget).toLocaleString("en-IN")}` : "—" },
              { label: "Rate/View", value: ratePerView ? `₹${ratePerView}` : "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[0.8rem]">
                <span style={{ color: "#444" }}>{row.label}</span>
                <span className="ml-3 max-w-[160px] truncate text-right font-medium text-white">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="my-5" style={{ borderTop: "1px solid #1F1F1F" }} />

          <p className="text-[0.75rem] leading-relaxed" style={{ color: "#444" }}>
            Campaign starts in planning mode and can receive creator invites immediately.
          </p>

          <button
            type="submit"
            className="font-display mt-6 w-full rounded-full py-3 text-sm uppercase tracking-wider text-black transition-opacity hover:opacity-85"
            style={{ background: "#39FF14" }}
          >
            Create Campaign
          </button>
        </div>
      </form>
    </DemoShell>
  );
}
