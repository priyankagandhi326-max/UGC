"use client";

type Props = {
  message: string;
  time: string;
  type: "approval" | "milestone" | "campaign" | "application";
};

function dotColor(type: Props["type"]) {
  if (type === "approval" || type === "milestone") return "#2E7D32";
  if (type === "campaign") return "#F59E0B";
  return "#6B7280";
}

export default function MobileActivityRow(props: Props) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border bg-white px-4 py-4 shadow-[0_10px_30px_rgba(16,56,28,0.06)]" style={{ borderColor: "rgba(25, 61, 30, 0.10)" }}>
      <div className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: dotColor(props.type) }} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[#0a0a0a]">{props.message}</div>
        <div className="mt-1 text-xs text-[#7a9481]">{props.time}</div>
      </div>
    </div>
  );
}
