"use client";

import { useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendLink() {
    setLoading(true);
    setMsg(null);

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (error) setMsg(error.message);
    else setMsg("Magic link sent. Check your email and click it.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-xs tracking-widest opacity-70">BRAND PORTAL</div>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm opacity-80">
          Enter your email to get a magic link.
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
            placeholder="you@brand.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendLink}
            disabled={!email || loading}
            className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send magic link"}
          </button>

          {msg && (
            <div className="text-sm rounded-xl border border-white/10 bg-white/5 p-3">
              {msg}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
