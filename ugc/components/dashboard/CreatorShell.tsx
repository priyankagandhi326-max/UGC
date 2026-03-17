"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx } from "@/components/dashboard/ui";

const creatorNav = [
  { href: "/creator-hub", label: "Home" },
  { href: "/creator-hub/campaigns", label: "Campaigns" },
  { href: "/creator-hub/applications", label: "Applications" },
  { href: "/creator-hub/earnings", label: "Earnings" },
  { href: "/creator-hub/profile", label: "Profile" },
];

export default function CreatorShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const inMobilePreview = pathname.startsWith("/creator-hub/mobile");

  return (
    <div
      className="min-h-screen"
      style={
        {
          ["--bg" as string]: "#f5fbf4",
          ["--panel" as string]: "#ffffff",
          ["--panel-2" as string]: "#edf7ee",
          ["--panel-border" as string]: "rgba(25, 61, 30, 0.08)",
          ["--text-primary" as string]: "#132417",
          ["--text-secondary" as string]: "#54715c",
          ["--text-tertiary" as string]: "#7a9481",
          ["--accent" as string]: "#ACE1AF",
          ["--accent-2" as string]: "#BFF6C3",
          ["--accent-soft" as string]: "rgba(172, 225, 175, 0.18)",
          ["--accent-border" as string]: "rgba(46, 125, 50, 0.18)",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(191,246,195,0.55),transparent_24%),linear-gradient(180deg,#f4fbf4_0%,#eef8ef_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[30px] border border-[var(--panel-border)] bg-white/85 px-5 py-4 shadow-[0_20px_60px_rgba(28,63,35,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-lg font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                CREATR<span className="text-[#2E7D32]">.UGC</span>
              </Link>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold tracking-wide text-[#1a3d1e]" style={{ border: "1px solid var(--accent-border)" }}>
                Creator Hub
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full border border-[var(--panel-border)] bg-white/60 p-1">
                <Link
                  href="/creator-hub"
                  className={cx(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    !inMobilePreview ? "bg-[var(--accent)] text-[#133019]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  Desktop
                </Link>
                <Link
                  href="/creator-hub/mobile"
                  className={cx(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    inMobilePreview ? "bg-[var(--accent)] text-[#133019]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  Mobile
                </Link>
              </div>
              <nav className="flex flex-wrap gap-2">
                {creatorNav.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/creator-hub" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cx(
                        "rounded-full px-4 py-2 text-sm transition-colors",
                        active
                          ? "bg-[var(--accent)] text-[#133019]"
                          : "bg-[var(--panel-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
