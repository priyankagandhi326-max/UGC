"use client";

import DemoShell from "@/components/DemoShell";
import { EmptyState, SectionCard, SectionHeader, StatusBadge } from "@/components/dashboard/ui";
import { formatCompactNumber, getHookEngineData } from "@/lib/dashboard/mock";
import { useDemoState } from "@/lib/demo/useDemoState";

export default function ClipEnginePage() {
  const state = useDemoState();
  const data = getHookEngineData(state);

  return (
    <DemoShell
      title="Hook Engine"
      subtitle="Performance intelligence for what creators should replicate next, not just a list of script ideas."
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard className="bg-[linear-gradient(180deg,rgba(191,246,195,0.08),rgba(255,255,255,0.02))]">
          <StatusBadge tone="accent">Strategic module</StatusBadge>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{data.heroInsight.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">{data.heroInsight.description}</p>
          <div className="mt-6 rounded-3xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
            <div className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">Top-performing hook</div>
            <div className="mt-3 text-lg leading-8">{data.heroInsight.hook}</div>
          </div>
        </SectionCard>

        <div className="grid gap-4">
          {data.summary.map((item) => (
            <SectionCard key={item.label}>
              <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">{item.label}</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{item.value}</div>
              <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.detail}</div>
            </SectionCard>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard>
          <SectionHeader eyebrow="Ranked hooks" title="Winning openings by performance score" detail="This view ties hooks back to views, CTR, and engagement proxy so creative decisions stay grounded in output." />
          <div className="mt-5 space-y-3">
            {data.rankedHooks.length > 0 ? data.rankedHooks.map((hook, index) => (
              <div key={hook.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--panel-2)] text-sm font-semibold">{index + 1}</div>
                      <StatusBadge tone="accent">{hook.score} score</StatusBadge>
                    </div>
                    <div className="mt-4 text-base leading-7">{hook.hook}</div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)]">{hook.campaign}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Views</div>
                      <div className="mt-2 text-sm font-medium">{formatCompactNumber(hook.views)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">CTR</div>
                      <div className="mt-2 text-sm font-medium">{hook.ctr}%</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Engagement</div>
                      <div className="mt-2 text-sm font-medium">{hook.engagement}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )) : <EmptyState title="No live hook intelligence yet" detail="Push creators live on a campaign to see ranked hook performance." />}
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard>
            <SectionHeader eyebrow="Winning scripts" title="What the strongest videos are doing" />
            <div className="mt-5 space-y-3">
              {data.winningScripts.map((script) => (
                <div key={script} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                  {script}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader eyebrow="Comparison block" title="Decision lens" detail="Use this as the performance frame when deciding what to scale into the next creator cohort." />
            <div className="mt-5 overflow-hidden rounded-3xl border border-white/8">
              <table className="min-w-full">
                <thead className="bg-white/[0.03] text-left text-[0.72rem] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                  <tr>
                    {["Hook", "Views", "CTR", "Conversion proxy"].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rankedHooks.slice(0, 4).map((hook) => (
                    <tr key={hook.id} className="border-t border-white/6 text-sm">
                      <td className="px-4 py-4">{hook.hook}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{formatCompactNumber(hook.views)}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{hook.ctr}%</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{hook.engagement}% engagement</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </div>
    </DemoShell>
  );
}
