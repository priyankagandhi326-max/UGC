"use client";

import { useEffect, useState } from "react";

import DemoShell from "@/components/DemoShell";
import { supabase } from "@/lib/supabaseClient";

type ClipRow = {
  id: string;
  brand_id: string;
  video_url: string;
  suggestions: { hooks: string[] };
  created_at: string;
};

export default function LibraryPage() {
  const [clips, setClips] = useState<ClipRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("clips")
        .select("*")
        .eq("brand_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setClips([]);
      } else {
        setClips((data ?? []) as ClipRow[]);
      }

      setLoading(false);
    })();
  }, []);

  async function copyHooks(clip: ClipRow) {
    const hooks: string[] = clip?.suggestions?.hooks ?? [];
    const text = hooks.map((h, i) => `${i + 1}. ${h}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(clip.id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setError("Clipboard copy failed. Try manually selecting text.");
    }
  }

  async function deleteClip(clipId: string) {
    setError(null);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;

    const { error } = await supabase
      .from("clips")
      .delete()
      .eq("id", clipId)
      .eq("brand_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    setClips((prev) => prev.filter((c) => c.id !== clipId));
  }

  return (
    <DemoShell
      title="Content Library"
      subtitle="Your saved clips and generated hook sets."
      actions={
        <a
          href="/clip-engine"
          className="font-display rounded-full px-5 py-2.5 text-sm uppercase tracking-wider text-black transition-opacity hover:opacity-85"
          style={{ background: "#39FF14" }}
        >
          + New Clip
        </a>
      }
    >
      {/* Error */}
      {error && (
        <div
          className="mb-5 rounded-xl px-5 py-4 text-sm"
          style={{ background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.25)", color: "#FF3B3B" }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center text-sm" style={{ color: "#444" }}>
          Loading library…
        </div>
      )}

      {/* Empty */}
      {!loading && clips.length === 0 && !error && (
        <div
          className="rounded-xl p-16 text-center"
          style={{ border: "1px dashed #2A2A2A" }}
        >
          <p className="text-sm" style={{ color: "#444" }}>
            No clips yet.{" "}
            <a href="/clip-engine" className="underline" style={{ color: "#39FF14" }}>
              Open Hook Engine
            </a>{" "}
            to generate your first one.
          </p>
        </div>
      )}

      {/* Clip cards */}
      {!loading && clips.length > 0 && (
        <div className="space-y-4">
          {clips.map((clip) => {
            const hooks: string[] = clip?.suggestions?.hooks ?? [];
            return (
              <div
                key={clip.id}
                className="rounded-xl p-6"
                style={{ background: "#111111", border: "1px solid #1F1F1F" }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.68rem] uppercase tracking-[0.1em]" style={{ color: "#444" }}>
                      Video URL
                    </div>
                    <a
                      href={clip.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-[0.85rem] text-white underline decoration-white/20 hover:decoration-white/60"
                    >
                      {clip.video_url}
                    </a>
                    <div className="mt-1 text-[0.7rem]" style={{ color: "#444" }}>
                      {new Date(clip.created_at).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => copyHooks(clip)}
                      className="rounded-full px-4 py-1.5 text-[0.75rem] transition-opacity hover:opacity-70"
                      style={{ background: "#1A1A1A", color: "#ccc", border: "1px solid #2A2A2A" }}
                    >
                      {copiedId === clip.id ? "Copied ✓" : "Copy Hooks"}
                    </button>
                    <button
                      onClick={() => deleteClip(clip.id)}
                      className="rounded-full px-4 py-1.5 text-[0.75rem] transition-opacity hover:opacity-70"
                      style={{ background: "rgba(255,59,59,0.08)", color: "#FF3B3B", border: "1px solid rgba(255,59,59,0.2)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Hooks */}
                {hooks.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2.5 text-[0.68rem] uppercase tracking-[0.1em]" style={{ color: "#444" }}>
                      Hooks ({hooks.length})
                    </div>
                    <div className="space-y-2">
                      {hooks.map((h, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg px-4 py-3 text-[0.82rem] leading-snug"
                          style={{ background: "#0F0F0F", border: "1px solid #1A1A1A", color: "#ccc" }}
                        >
                          <span className="mr-2 font-bold" style={{ color: "#39FF14" }}>{idx + 1}.</span>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DemoShell>
  );
}
