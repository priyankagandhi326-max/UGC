"use client";

import { CreatorCard, CreatorH2, CreatorPill, CreatorStat, CreatorSub } from "@/components/creator/ui";
import { formatCompactNumber, formatCurrency } from "@/lib/dashboard/mock";

const profile = {
  handle: "@delhi_vibes",
  niche: "Lifestyle + Beauty",
  followers: 184000,
  region: "India",
  contentType: "Reels",
  totalViews: 105514,
  totalRevenue: 84200,
  rank: 128,
};

export default function CreatorProfilePage() {
  return (
    <div className="space-y-6">
      <CreatorCard className="bg-[linear-gradient(180deg,rgba(172,225,175,0.26),rgba(255,255,255,0.7))]">
        <CreatorPill>Creator profile</CreatorPill>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl text-xl font-semibold text-[#133019]" style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2))" }}>
              {profile.handle.slice(1, 3).toUpperCase()}
            </div>
            <div>
              <CreatorH2>{profile.handle}</CreatorH2>
              <CreatorSub>{profile.niche} · {profile.region} · {profile.contentType}</CreatorSub>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CreatorPill>{formatCompactNumber(profile.followers)} followers</CreatorPill>
            <CreatorPill tone="neutral">Rank #{profile.rank}</CreatorPill>
          </div>
        </div>
      </CreatorCard>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <CreatorStat label="Instagram handle" value={profile.handle} detail="Primary identity for briefs" />
        <CreatorStat label="Total views" value={formatCompactNumber(profile.totalViews)} detail="Across approved posts" />
        <CreatorStat label="Total revenue" value={formatCurrency(profile.totalRevenue)} detail="Estimated revenue generated" />
        <CreatorStat label="Follower count" value={formatCompactNumber(profile.followers)} detail="Current follower band" />
      </div>

      <CreatorCard>
        <div className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>Profile details</div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {[
            { label: "Niche", value: profile.niche },
            { label: "Region", value: profile.region },
            { label: "Preferred content type", value: profile.contentType },
            { label: "Rank", value: `#${profile.rank}` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border bg-white/70 px-4 py-3" style={{ borderColor: "var(--panel-border)" }}>
              <div className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--text-tertiary)" }}>{item.label}</div>
              <div className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </CreatorCard>
    </div>
  );
}
