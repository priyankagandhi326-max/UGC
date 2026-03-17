"use client";

import { CreatorCard, CreatorH2, CreatorPill, CreatorSub } from "@/components/creator/ui";
import { creatorHubData } from "@/lib/creator-hub/mock";

type AppStatus = "applied" | "under review" | "approved" | "rejected" | "withdrawn";

function toneFor(status: AppStatus) {
  if (status === "approved") return "mint" as const;
  if (status === "under review") return "warning" as const;
  return "neutral" as const;
}

export default function CreatorApplicationsPage() {
  return (
    <div className="space-y-6">
      <CreatorCard>
        <CreatorH2>Applications</CreatorH2>
        <CreatorSub>Track your application pipeline and keep your campaign roster consistently filled.</CreatorSub>
      </CreatorCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {creatorHubData.applications.map((app) => (
          <CreatorCard key={app.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-semibold tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
                  {app.campaignName}
                </div>
                <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {app.brandName} · applied {app.appliedOn}
                </div>
              </div>
              <CreatorPill tone={toneFor(app.status)}>{app.status}</CreatorPill>
            </div>
            <div className="mt-4 rounded-2xl border bg-white/70 p-4 text-sm leading-6" style={{ borderColor: "var(--panel-border)", color: "var(--text-secondary)" }}>
              {app.note}
            </div>
          </CreatorCard>
        ))}
      </div>
    </div>
  );
}
