"use client";

import { cx } from "@/components/dashboard/ui";
import { formatCompactNumber } from "@/lib/dashboard/mock";

type SeriesPoint = {
  label: string;
  value: number;
};

type ChartSeries = {
  label: string;
  color: string;
  values: SeriesPoint[];
};

export default function AnalyticsChart({ series }: { series: ChartSeries[] }) {
  const maxValue = Math.max(...series.flatMap((item) => item.values.map((point) => point.value)), 1);
  const labels = series[0]?.values.map((point) => point.label) ?? [];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-4">
        {series.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[48px_1fr] gap-4">
        <div className="flex h-[250px] flex-col justify-between text-[0.72rem] text-[var(--text-tertiary)]">
          {[1, 0.75, 0.5, 0.25, 0].map((step) => (
            <span key={step}>{formatCompactNumber(Math.round(maxValue * step))}</span>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-0 grid grid-rows-4 gap-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border-t border-dashed border-white/8" />
            ))}
          </div>
          <div className="relative flex h-[250px] items-end gap-3">
            {labels.map((label, labelIndex) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-full w-full items-end justify-center gap-2">
                  {series.map((item) => {
                    const height = `${(item.values[labelIndex].value / maxValue) * 100}%`;
                    return (
                      <div
                        key={item.label}
                        className={cx("w-full rounded-t-[16px] transition-all duration-300 hover:opacity-90")}
                        style={{
                          height,
                          minHeight: "8px",
                          background: `linear-gradient(180deg, ${item.color}, rgba(255,255,255,0.04))`,
                          boxShadow: `0 10px 32px ${item.color}22`,
                        }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
