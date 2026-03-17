"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import MobileActivityRow from "@/components/creator/mobile/ActivityRow";
import MobileBarChart from "@/components/creator/mobile/BarChart";
import MobileCampaignCard from "@/components/creator/mobile/CampaignCard";
import MobilePostRow from "@/components/creator/mobile/PostRow";
import { CreatorPill } from "@/components/creator/ui";
import { creatorHubData } from "@/lib/creator-hub/mock";

type Tab = "campaigns" | "active" | "activity";

export default function CreatorMobilePreviewPage() {
  const [tab, setTab] = useState<Tab>("campaigns");
  const [showReferral, setShowReferral] = useState(true);
  const chart = useMemo(() => [22, 34, 28, 46, 41, 52, 48], []);

  return (
    <div className="mx-auto max-w-[430px]">
      <div className="overflow-hidden rounded-[42px] border bg-white shadow-[0_40px_90px_rgba(16,56,28,0.16)]" style={{ borderColor: "rgba(25, 61, 30, 0.14)" }}>
        <div className="bg-[linear-gradient(180deg,#BFF6C3_0%,#E0FBE2_65%,#ffffff_100%)] px-5 pb-5 pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-[-0.03em] text-[#0a0a0a]">CREATR.UGC</div>
            <button type="button" className="rounded-full border bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1a3d1e]" style={{ borderColor: "rgba(46,125,50,0.18)" }}>
              Wallet ₹{creatorHubData.walletBalance.toLocaleString("en-IN")}
            </button>
          </div>

          <div className="mt-5">
            <div className="text-3xl font-semibold tracking-[-0.06em] text-[#0a0a0a]">
              ₹{creatorHubData.earnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4B6E4F]">
              Total earnings
            </div>
          </div>

          <div className="mt-4 rounded-3xl border bg-white/70 px-4 py-4" style={{ borderColor: "rgba(25, 61, 30, 0.10)" }}>
            <MobileBarChart values={chart} />
          </div>

          <div className="mt-4 flex gap-2 rounded-full border bg-white/60 p-1" style={{ borderColor: "rgba(25, 61, 30, 0.10)" }}>
            {([
              { id: "campaigns", label: "Campaigns" },
              { id: "active", label: "Active" },
              { id: "activity", label: "Activity" },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === item.id ? "bg-[#ACE1AF] text-[#0a0a0a]" : "text-[#54715c]"
                }`}
              >
                {item.label}
                {item.id === "active" ? <span className="ml-1 text-[#2E7D32]">●</span> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-6 pt-4">
          {showReferral ? (
            <div className="mb-4 flex items-center justify-between rounded-3xl border bg-white px-4 py-4 shadow-[0_10px_30px_rgba(16,56,28,0.06)]" style={{ borderColor: "rgba(25, 61, 30, 0.10)" }}>
              <div>
                <div className="text-sm font-semibold text-[#0a0a0a]">Earn ₹3,000 & lifetime bonuses</div>
                <div className="mt-1 text-xs text-[#7a9481]">Refer a friend to CREATR</div>
              </div>
              <button type="button" onClick={() => setShowReferral(false)} className="text-xs font-semibold text-[#7a9481]">
                Dismiss
              </button>
            </div>
          ) : null}

          {tab === "campaigns" ? (
            <div className="space-y-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-base font-semibold text-[#0a0a0a]">For you</div>
                <CreatorPill tone="neutral">Trending</CreatorPill>
              </div>
              {creatorHubData.campaignOpportunities.map((campaign) => (
                <MobileCampaignCard
                  key={campaign.id}
                  brandName={campaign.brandName}
                  brandColor={campaign.brandColor}
                  campaignName={campaign.campaignName}
                  basePay={campaign.basePay}
                  claimed={campaign.claimed}
                  maxPayout={campaign.maxPayout}
                  exclusive={campaign.exclusive}
                />
              ))}
            </div>
          ) : null}

          {tab === "active" ? (
            <div className="space-y-3">
              {creatorHubData.posts.map((post) => (
                <MobilePostRow
                  key={post.id}
                  brandName={post.brandName}
                  brandColor={post.brandColor}
                  campaignName={post.campaignName}
                  uploadedOn={post.uploadedOn}
                  views={post.views}
                  earnings={post.earnings}
                  status={post.status}
                />
              ))}
              <div className="pt-2 text-center">
                <Link href="/creator-hub" className="text-xs font-semibold text-[#2E7D32] underline decoration-[#2E7D32]/30">
                  Back to desktop creator hub
                </Link>
              </div>
            </div>
          ) : null}

          {tab === "activity" ? (
            <div className="space-y-3">
              {creatorHubData.activities.map((act) => (
                <MobileActivityRow key={act.id} message={act.message} time={act.time} type={act.type} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
