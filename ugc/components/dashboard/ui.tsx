"use client";

import type { ReactNode } from "react";

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function StatusBadge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "warning" | "muted";
}) {
  const tones = {
    default: "border border-white/10 bg-white/5 text-[var(--text-secondary)]",
    accent: "border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]",
    warning: "border border-amber-300/15 bg-amber-300/8 text-amber-200",
    muted: "border border-white/6 bg-white/[0.03] text-[var(--text-tertiary)]",
  };

  return (
    <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-[0.68rem] font-medium tracking-[0.14em] uppercase", tones[tone])}>
      {children}
    </span>
  );
}

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow && <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">{eyebrow}</div>}
        <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{title}</h3>
        {detail && <p className="mt-1 text-sm text-[var(--text-secondary)]">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "accent";
}) {
  return (
    <SectionCard className={cx("relative overflow-hidden", tone === "accent" && "border-[var(--accent-border)] bg-[linear-gradient(180deg,rgba(191,246,195,0.08),rgba(255,255,255,0.02))]")}>
      {tone === "accent" && <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(216,251,224,0.2),transparent_68%)]" />}
      <div className="relative">
        <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">{label}</div>
        <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2.1rem]">{value}</div>
        <div className="mt-3 text-sm text-[var(--text-secondary)]">{detail}</div>
      </div>
    </SectionCard>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cx(
            "rounded-full px-4 py-2 text-sm transition-colors",
            value === option.value
              ? "bg-[var(--accent)] text-[#0d140f]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function FilterBar({
  searchValue,
  onSearchChange,
  filters,
  children,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <SectionCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search campaigns, creators, or campaign notes"
          className="h-11 w-full rounded-2xl border border-white/8 bg-[#131816] px-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-border)] md:max-w-sm"
        />
        {filters}
      </div>
      {children}
    </SectionCard>
  );
}

export function EmptyState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <SectionCard className="border-dashed text-center">
      <div className="text-base font-medium text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 text-sm text-[var(--text-secondary)]">{detail}</div>
    </SectionCard>
  );
}

export function QuickActionCard({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-[var(--accent-border)]">
      <div className="text-sm font-medium text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{detail}</div>
    </div>
  );
}
