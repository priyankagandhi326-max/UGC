"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { resetDemo } from "@/lib/demo/store";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/creators", label: "Creators" },
  { href: "/analytics", label: "Analytics" },
  { href: "/payouts", label: "Payouts" },
] as const;

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/65 px-6 py-4 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
            CREATR.UGC
          </Link>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200">
            Demo Mode
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 transition ${
                    active ? "bg-white text-black" : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => resetDemo()}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/12 hover:text-white"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </header>
  );
}
