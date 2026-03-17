import Link from "next/link";

const paths = [
  {
    href: "/dashboard",
    label: "Brand Dashboard",
    eyebrow: "Brand OS",
    title: "Run campaigns, creators, hooks, payouts, and analytics from one command layer.",
    detail: "Best for brands managing creator acquisition, live campaign performance, and payout operations.",
    tone: "dark",
  },
  {
    href: "/creator-hub",
    label: "Creator Dashboard",
    eyebrow: "Creator Hub",
    title: "Discover campaigns, track approvals, monitor earnings, and manage payout visibility.",
    detail: "Best for creators applying to campaigns, posting content, and tracking performance-linked earnings.",
    tone: "light",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0f0d] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(191,246,195,0.12),transparent_24%),radial-gradient(circle_at_85%_10%,rgba(216,251,224,0.1),transparent_20%),linear-gradient(180deg,#0b0f0d_0%,#101713_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-[-0.04em]">
            CREATR<span className="text-[#BFF6C3]">.UGC</span>
          </Link>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
            Marketplace + campaign operating system
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-[0.72rem] uppercase tracking-[0.22em] text-[#9db1a1]">Landing Page</div>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.08em] sm:text-6xl">
              One front door for CREATR.UGC. Then diverge cleanly into brand and creator workflows.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a7b4aa]">
              Brands need a campaign operating system. Creators need a lightweight opportunity and earnings hub.
              The product should split immediately after landing, not force both into the same dashboard experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-[linear-gradient(180deg,#BFF6C3,#ACE1AF)] px-6 py-3 text-sm font-semibold text-[#0d140f] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Open Brand Dashboard
              </Link>
              <Link
                href="/creator-hub"
                className="rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
              >
                Open Creator Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className={`group rounded-[32px] border p-6 transition-transform duration-200 hover:-translate-y-1 ${
                  path.tone === "dark"
                    ? "border-white/8 bg-[linear-gradient(180deg,rgba(17,23,20,0.96),rgba(255,255,255,0.03))] text-white"
                    : "border-[#d4ead7] bg-[linear-gradient(180deg,#f7fcf7,#eef8ef)] text-[#132417]"
                }`}
              >
                <div className={`text-[0.72rem] uppercase tracking-[0.18em] ${path.tone === "dark" ? "text-[#9db1a1]" : "text-[#6d8673]"}`}>
                  {path.eyebrow}
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-[-0.05em]">{path.label}</div>
                <div className={`mt-3 text-base leading-7 ${path.tone === "dark" ? "text-[#c9d4cc]" : "text-[#4f6957]"}`}>
                  {path.title}
                </div>
                <div className={`mt-5 text-sm leading-6 ${path.tone === "dark" ? "text-[#93a39a]" : "text-[#6d8673]"}`}>
                  {path.detail}
                </div>
                <div className={`mt-6 text-sm font-medium ${path.tone === "dark" ? "text-[#BFF6C3]" : "text-[#2E7D32]"}`}>
                  Enter {path.label} →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
