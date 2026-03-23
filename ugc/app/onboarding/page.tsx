"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [ig, setIg] = useState("");
  const [website, setWebsite] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
    })();
  }, [router]);

  async function save() {
    setMsg(null);
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return router.push("/login");

    const { error } = await supabase.from("brands").upsert({
      id: user.id,
      name,
      niche,
      instagram_handle: ig || null,
      website: website || null,
    });

    if (error) setMsg(error.message);
    else router.push("/dashboard");
  }

  return (
    <main className="min-h-screen p-6 bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Brand onboarding</h1>
        <p className="mt-2 text-sm opacity-80">
          Fill this once, then you’re in.
        </p>

        <div className="mt-6 space-y-3">
          <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            placeholder="Brand name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            placeholder="Instagram handle (optional)" value={ig} onChange={(e)=>setIg(e.target.value)} />
          <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            placeholder="Website (optional)" value={website} onChange={(e)=>setWebsite(e.target.value)} />
          <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            placeholder="Niche" required value={niche} onChange={(e)=>setNiche(e.target.value)} />

          <button onClick={save} className="w-full rounded-xl bg-white text-black py-3 font-medium">
            Save & continue
          </button>

          {msg && <div className="text-sm rounded-xl border border-white/10 bg-white/5 p-3">{msg}</div>}
        </div>
      </div>
    </main>
  );
}
