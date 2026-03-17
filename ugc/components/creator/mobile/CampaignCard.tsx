"use client";

import { CreatorPill } from "@/components/creator/ui";
import { formatCurrency } from "@/lib/dashboard/mock";

type Props = {
  brandName: string;
  brandColor: string;
  campaignName: string;
  basePay: number;
  claimed: string;
  maxPayout: number;
  exclusive?: boolean;
};

export default function MobileCampaignCard(props: Props) {
  return (
    <button
      type="button"
      className="w-full rounded-3xl border bg-white px-4 py-4 text-left shadow-[0_10px_30px_rgba(16,56,28,0.06)] transition-transform active:scale-[0.99]"
      style={{ borderColor: "rgba(25, 61, 30, 0.10)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-[#0d140f]"
            style={{ background: props.brandColor }}
          >
            {props.brandName[0]}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[#0a0a0a]">{props.campaignName}</div>
            <div className="mt-1 text-xs text-[#7a9481]">
              {formatCurrency(props.basePay)} base · {props.claimed} claimed
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {props.exclusive ? <CreatorPill>Exclusive</CreatorPill> : null}
          <div className="text-sm font-semibold text-[#0a0a0a]">
            Up to {formatCurrency(props.maxPayout)}
          </div>
        </div>
      </div>
    </button>
  );
}
