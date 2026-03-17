"use client";

export default function MobileBarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-20 items-end gap-2">
      {values.map((v, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-t-xl"
          style={{
            height: `${(v / max) * 100}%`,
            minHeight: "10%",
            background: "linear-gradient(180deg, var(--accent), rgba(46,125,50,0.12))",
          }}
        />
      ))}
    </div>
  );
}
