"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { resetDemo } from "@/lib/demo/store";

// ─── Inline SVG icons ────────────────────────────────────────────────────────

function IcoGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function IcoFlag() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
function IcoUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IcoFilm() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );
}
function IcoZap() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IcoBarChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
function IcoCreditCard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV = [
  { href: "/dashboard",    label: "Overview",        Icon: IcoGrid,       beta: false },
  { href: "/campaigns",    label: "Campaigns",       Icon: IcoFlag,       beta: false },
  { href: "/creators",     label: "Creators",        Icon: IcoUsers,      beta: false },
  { href: "/library",      label: "Content Library", Icon: IcoFilm,       beta: false },
  { href: "/clip-engine",  label: "Hook Engine",     Icon: IcoZap,        beta: true  },
  { href: "/analytics",    label: "Analytics",       Icon: IcoBarChart,   beta: false },
  { href: "/payouts",      label: "Payouts",         Icon: IcoCreditCard, beta: false },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function DemoShell({ title, subtitle, actions, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0A" }}>

      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col"
        style={{ background: "#0F0F0F", borderRight: "1px solid #1F1F1F" }}
      >
        {/* Logo */}
        <div className="px-5 py-6">
          <Link
            href="/dashboard"
            className="font-display text-[0.85rem] uppercase tracking-[0.08em] text-white"
          >
            CREATR<span style={{ color: "#39FF14" }}>·UGC</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5 px-2 pb-4">
          {NAV.map(({ href, label, Icon, beta }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname?.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[0.8rem] transition-colors ${
                  active
                    ? "text-white"
                    : "text-[#666] hover:bg-[#1a1a1a] hover:text-white"
                }`}
                style={{
                  borderLeft: active ? "3px solid #39FF14" : "3px solid transparent",
                  background: active ? "rgba(57,255,20,0.06)" : undefined,
                  paddingLeft: active ? "9px" : undefined,
                }}
              >
                <Icon />
                <span>{label}</span>
                {beta && (
                  <span
                    className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-widest"
                    style={{
                      background: "rgba(57,255,20,0.08)",
                      color: "#39FF14",
                      border: "1px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    Beta
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + reset */}
        <div className="space-y-3 p-4" style={{ borderTop: "1px solid #1F1F1F" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold"
              style={{ background: "#39FF14", color: "#000" }}
            >
              B
            </div>
            <div>
              <div className="text-[0.75rem] font-medium text-white">Brand Demo</div>
              <div className="text-[0.68rem]" style={{ color: "#666" }}>Brand Manager</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => resetDemo()}
            className="w-full rounded-full py-1.5 text-[0.72rem] transition-opacity hover:opacity-70"
            style={{ background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" }}
          >
            Reset Demo
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ml-[220px] flex flex-1 flex-col">

        {/* Topbar */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
          style={{ background: "#0D0D0D", borderBottom: "1px solid #1F1F1F" }}
        >
          <div>
            <h1
              className="font-display text-xl text-white"
              style={{ letterSpacing: "0.03em" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-[0.72rem]" style={{ color: "#666" }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
