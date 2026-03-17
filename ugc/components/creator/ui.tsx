"use client";

import type { ReactNode } from "react";

export function CreatorCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[26px] border bg-white/80 p-5 shadow-[0_18px_50px_rgba(28,63,35,0.06)] backdrop-blur ${className}`}
      style={{ borderColor: "var(--panel-border)" }}
    >
      {children}
    </section>
  );
}

export function CreatorH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold tracking-[-0.05em]" style={{ color: "var(--text-primary)" }}>
      {children}
    </h2>
  );
}

export function CreatorSub({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
      {children}
    </p>
  );
}

export function CreatorPill({
  children,
  tone = "mint",
}: {
  children: ReactNode;
  tone?: "mint" | "neutral" | "warning";
}) {
  const style =
    tone === "mint"
      ? { background: "var(--accent-soft)", border: "1px solid var(--accent-border)", color: "#1a3d1e" }
      : tone === "warning"
        ? { background: "rgba(245,158,11,0.16)", border: "1px solid rgba(245,158,11,0.25)", color: "#8a5a00" }
        : { background: "rgba(15,23,42,0.04)", border: "1px solid rgba(15,23,42,0.08)", color: "var(--text-secondary)" };

  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide" style={style}>
      {children}
    </span>
  );
}

export function CreatorPrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#133019] transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2))" }}
    >
      {children}
    </button>
  );
}

export function CreatorSecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
      style={{ background: "var(--panel-2)", border: "1px solid var(--panel-border)", color: "var(--text-secondary)" }}
    >
      {children}
    </button>
  );
}

export function CreatorStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4" style={{ borderColor: "var(--panel-border)" }}>
      <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.04em]" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        {detail}
      </div>
    </div>
  );
}
