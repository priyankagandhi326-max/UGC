"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DemoShell from "@/components/DemoShell";
import { supabase } from "@/lib/supabaseClient";

export default function ClipEngine() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [niche, setNiche] = useState("your niche");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      const { data: brand } = await supabase
        .from("brands")
        .select("niche")
        .eq("id", user.id)
        .single();

      if (brand?.niche) setNiche(brand.niche);
    })();
  }, []);

  function hooksFor(n: string) {
    return [
      `Stop scrolling if you're into ${n}.`,
      `I tried this for 7 days and the result shocked me.`,
      `Nobody tells you this about ${n}.`,
      `3 mistakes people make in ${n} (and how to fix them).`,
      `Do this before you waste time in ${n}.`,
    ];
  }

  async function onGenerate() {
    setMsg(null);
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      setLoading(false);
      return setMsg("Sign in to save clips.");
    }

    if (!videoUrl.trim()) {
      setLoading(false);
      return setMsg("Paste a video link first.");
    }

    const hooks = hooksFor(niche);

    const { error } = await supabase.from("clips").insert({
      brand_id: user.id,
      video_url: videoUrl.trim(),
      suggestions: { hooks },
    });

    setLoading(false);

    if (error) return setMsg(error.message);
    router.push("/library");
  }

  return (
    <DemoShell
      title="Hook Engine"
      subtitle={`Generating hooks for niche: ${niche}`}
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl p-6" style={{ background: "#111111", border: "1px solid rgba(57,255,20,0.25)", boxShadow: "0 0 24px rgba(57,255,20,0.04)" }}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "#39FF14" }}>
              Generate + Save
            </span>
          </div>

          <div className="mb-4">
            <span className="text-[0.78rem]" style={{ color: "#666" }}>Niche: </span>
            <span className="text-[0.78rem] font-semibold text-white">{niche}</span>
          </div>

          {/* Input */}
          <label className="block">
            <span className="mb-2 block text-[0.78rem]" style={{ color: "#666" }}>Video URL</span>
            <input
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none"
              style={{ background: "#0F0F0F", border: "1px solid #2A2A2A" }}
              placeholder="Paste a video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </label>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ background: "#39FF14" }}
          >
            {loading ? "Saving…" : "Generate & Save Hooks"}
          </button>

          {msg && (
            <div
              className="mt-4 rounded-lg px-4 py-3 text-sm"
              style={{ background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.25)", color: "#FF3B3B" }}
            >
              {msg}
            </div>
          )}
        </div>

        {/* Preview hooks */}
        <div className="mt-5 rounded-xl p-6" style={{ background: "#111111", border: "1px solid #1F1F1F" }}>
          <span className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "#666" }}>
            Preview — Hooks for &quot;{niche}&quot;
          </span>
          <div className="mt-4 space-y-2.5">
            {hooksFor(niche).map((hook, i) => (
              <div
                key={i}
                className="rounded-lg px-4 py-3 text-[0.82rem] leading-snug"
                style={{ background: "#0F0F0F", border: "1px solid #1A1A1A", color: "#ccc" }}
              >
                <span className="mr-2 font-bold" style={{ color: "#39FF14" }}>{i + 1}.</span>
                {hook}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
