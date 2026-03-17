"use client";

import Link from "next/link";
import { useState } from "react";

import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import DemoShell from "@/components/DemoShell";
import {
  EmptyState,
  MetricCard,
  QuickActionCard,
  SectionCard,
  SectionHeader,
  SegmentedControl,
  StatusBadge,
} from "@/components/dashboard/ui";
import { formatCompactNumber, formatCurrency, getOverviewData, type RangeOption } from "@/lib/dashboard/mock";
import { useDemoState } from "@/lib/demo/useDemoState";

export default function DashboardPage() {
  const state = useDemoState();
  const overview = getOverviewData(state);
  const [range, setRange] = useState<RangeOption>("30d");
  const chart = overview.chart[range];

  return (
    <DemoShell
      title="Overview"
      subtitle="Campaign health, creator momentum, and payout readiness in one operating view."
      actions={
        <Link
          href="/campaigns/new"
          className="rounded-full bg-[linear-gradient(180deg,var(--accent),var(--accent-2))] px-5 py-3 text-sm font-semibold text-[#0d140f] transition-transform duration-200 hover:-translate-y-0.5"
        >
          New Campaign
        </Link>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.95fr]">
        <SectionCard className="overflow-hidden">
          <StatusBadge tone="accent">Brand command center</StatusBadge>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.05em] sm:text-[3rem]">
            Performance is compounding across live creators, but the next lift will come from staffing faster and replicating winning hooks.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            LumaSkin is pacing ahead on creator quality, PulsePod is driving efficient spend, and Kindred Meals needs assets before creator approvals can move.
          </p>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,rgba(191,246,195,0.1),rgba(255,255,255,0.02))]">
          <SectionHeader
            eyebrow="Campaign health snapshot"
            title="Top-performing campaign"
            detail={overview.topCampaign ? `${overview.topCampaign.title} is leading on creator quality and spend efficiency.` : "No live campaigns yet."}
          />
          {overview.topCampaign ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
                <div className="text-sm font-medium">{overview.topCampaign.title}</div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                  {overview.topCampaign.liveCreators} creators live · {formatCompactNumber(overview.topCampaign.views)} views · {formatCurrency(overview.topCampaign.spend)} spent
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionCard title={`${overview.topCampaign.healthScore}/100 health`} detail="Balanced budget pacing, creator throughput, and view delivery." />
                <QuickActionCard title={`${overview.topCampaign.creatorsNeeded - overview.topCampaign.liveCreators} creators to add`} detail="Replicate the winning cohort without overextending spend." />
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState title="No campaign health yet" detail="Launch a campaign to unlock health tracking." />
            </div>
          )}
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {overview.topMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {overview.secondaryMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} />
        ))}
      </div>

      <SectionCard className="mt-6">
        <SectionHeader
          eyebrow="Performance chart"
          title="Views, reach, and spend over time"
          detail="Use this layer to see whether creator output, audience reach, and budget are moving together."
          action={
            <SegmentedControl
              options={[
                { label: "7d", value: "7d" },
                { label: "30d", value: "30d" },
                { label: "90d", value: "90d" },
              ]}
              value={range}
              onChange={setRange}
            />
          }
        />
        <div className="mt-8">
          <AnalyticsChart
            series={[
              { label: "Views", color: "#BFF6C3", values: chart.views },
              { label: "Reach", color: "#8CBF91", values: chart.reach },
              { label: "Spend", color: "#CFE4D1", values: chart.spend },
            ]}
          />
        </div>
      </SectionCard>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_1fr_1fr_0.95fr]">
        <SectionCard>
          <SectionHeader eyebrow="Hook Engine" title="Top-performing hooks" detail="The openings below are driving the strongest momentum across live content." />
          <div className="mt-5 space-y-3">
            {overview.hookPreview.length > 0 ? overview.hookPreview.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm leading-6 text-[var(--text-primary)]">{item.hook}</div>
                  <StatusBadge tone="accent">{item.score} score</StatusBadge>
                </div>
                <div className="mt-3 text-sm text-[var(--text-secondary)]">{item.campaignTitle}</div>
              </div>
            )) : <EmptyState title="No hooks ranked yet" detail="Hook intelligence appears as soon as live content starts collecting performance." />}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader eyebrow="Active campaigns" title="Campaign summary" detail="The center of the system: which campaigns are staffed, spending, and performing." />
          <div className="mt-5 space-y-4">
            {overview.campaignHealth.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{campaign.title}</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">{campaign.liveCreators}/{campaign.creatorsNeeded} creators live · {formatCompactNumber(campaign.views)} views</div>
                  </div>
                  <StatusBadge tone={campaign.healthScore >= 82 ? "accent" : "warning"}>{campaign.healthLabel}</StatusBadge>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/6">
                  <div className="h-2 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" style={{ width: `${Math.min(100, (campaign.spend / campaign.budget) * 100)}%` }} />
                </div>
                <div className="mt-2 text-sm text-[var(--text-tertiary)]">{formatCurrency(campaign.spend)} of {formatCurrency(campaign.budget)} deployed</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader eyebrow="Top creators" title="Creator leaderboard" detail="The creators contributing the strongest view lift across active work." />
          <div className="mt-5 space-y-4">
            {overview.topCreators.map((creator, index) => (
              <div key={creator.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--panel-2)] text-sm font-semibold text-[var(--text-primary)]">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{creator.handle}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{creator.niche} · {formatCompactNumber(creator.followers)} followers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatCompactNumber(creator.views)}</div>
                  <div className="text-sm text-[var(--text-tertiary)]">{formatCurrency(creator.payout)} payout due</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader eyebrow="Pending actions" title="What needs attention next" detail="Tighten operational lag before it affects campaign pacing." />
          <div className="mt-5 space-y-3">
            {overview.pendingActions.map((action) => (
              <Link key={action.id} href={action.href} className="block rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-[var(--accent-border)]">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{action.note}</div>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </DemoShell>
  );
}
