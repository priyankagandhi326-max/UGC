"use client";

import { CreatorPill } from "@/components/creator/ui";

type Props = {
  brandName: string;
  brandColor: string;
  campaignName: string;
  uploadedOn: string;
  views: string;
  earnings: number;
  status: "approved" | "under_review" | "rejected";
};

function tone(status: Props["status"]) {
  if (status === "approved") return "mint" as const;
  if (status === "under_review") return "warning" as const;
  return "neutral" as const;
}

export default function MobilePostRow(props: Props) {
  return (
    <button
      type="button"
      className="w-full rounded-3xl border bg-white px-4 py-4 text-left shadow-[0_10px_30px_rgba(16,56,28,0.06)] transition-transform active:scale-[0.99]"
      style={{ borderColor: "rgba(25, 61, 30, 0.10)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-[#0d140f]" style={{ background: props.brandColor }}>
            {props.brandName[0]}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[#0a0a0a]">{props.campaignName}</div>
            <div className="mt-1 text-xs text-[#7a9481]">{props.uploadedOn}</div>
            <div className="mt-2">
              <CreatorPill tone={tone(props.status)}>{props.status.replace("_", " ")}</CreatorPill>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-[#0a0a0a]">{props.views}</div>
          <div className="text-xs text-[#7a9481]">views</div>
          {props.earnings > 0 ? (
            <div className="mt-2 text-xs font-semibold text-[#2E7D32]">
              +₹{props.earnings.toLocaleString("en-IN")}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
