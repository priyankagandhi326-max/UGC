"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx, StatusBadge } from "@/components/dashboard/ui";
import { resetDemo } from "@/lib/demo/store";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/creators", label: "Creators" },
  { href: "/library", label: "Content Library" },
  { href: "/clip-engine", label: "Hook Engine" },
  { href: "/analytics", label: "Analytics" },
  { href: "/payouts", label: "Payouts" },
];

export default function BrandFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(216,251,224,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(191,246,195,0.06),transparent_22%),linear-gradient(180deg,#0b0f0d_0%,#0d1210_100%)]" />
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-white/6 bg-[rgba(12,16,14,0.88)] px-5 py-6 backdrop-blur xl:flex">
          <Link href="/dashboard" className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
            <div className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-tertiary)]">Brand OS</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              CREATR<span className="text-[var(--accent)]">.UGC</span>
            </div>
            <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Creator discovery, campaign execution, hook intelligence, and payouts in one control layer.
            </div>
          </Link>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                    active
                      ? "border border-[var(--accent-border)] bg-[linear-gradient(90deg,rgba(191,246,195,0.12),rgba(255,255,255,0.02))] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-white/[0.03] hover:text-[var(--text-primary)]",
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_rgba(191,246,195,0.55)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,var(--accent),var(--accent-2))] text-sm font-semibold text-[#0d140f]">
                CU
              </div>
              <div>
                <div className="text-sm font-medium">CREATR Labs</div>
                <div className="text-sm text-[var(--text-secondary)]">Brand team workspace</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge tone="accent">Brand Dashboard</StatusBadge>
              <button
                type="button"
                onClick={() => resetDemo()}
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Reset
              </button>
            </div>
            <Link
              href="/creator-hub"
              className="mt-4 block rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--text-primary)]"
            >
              Open Creator Hub
            </Link>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
