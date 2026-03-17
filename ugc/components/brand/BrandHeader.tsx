"use client";

import type { ReactNode } from "react";

import { StatusBadge } from "@/components/dashboard/ui";

export default function BrandHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 mb-6 rounded-[24px] border border-white/6 bg-[rgba(11,15,13,0.78)] px-5 py-4 backdrop-blur sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            Brand dashboard
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge tone="muted">Q1 performance window</StatusBadge>
          {actions}
        </div>
      </div>
    </header>
  );
}
