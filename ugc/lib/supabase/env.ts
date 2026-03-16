export function getSupabaseEnv(): {
  supabaseUrl: string;
  supabaseAnonKey: string;
} {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  if (!supabaseUrl) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (supabaseUrl) {
    const hasPlaceholder = supabaseUrl.includes("<") || supabaseUrl.includes(">");
    if (hasPlaceholder) {
      invalidVars.push(
        "NEXT_PUBLIC_SUPABASE_URL appears to use a placeholder value. Use your real https://<project-ref>.supabase.co URL.",
      );
    } else {
      try {
        const parsedUrl = new URL(supabaseUrl);
        if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith(".supabase.co")) {
          invalidVars.push(
            "NEXT_PUBLIC_SUPABASE_URL must be a valid https URL ending in .supabase.co.",
          );
        }
      } catch {
        invalidVars.push("NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
      }
    }
  }

  if (supabaseAnonKey && (supabaseAnonKey.includes("<") || supabaseAnonKey.includes(">"))) {
    invalidVars.push(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY appears to use a placeholder value. Use your real anon key.",
    );
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing Supabase environment variable(s): ${missingVars.join(
        ", ",
      )}. Add them to ugc/.env.local and restart the dev server.`,
    );
  }

  if (invalidVars.length > 0) {
    throw new Error(
      `Invalid Supabase environment configuration in ugc/.env.local: ${invalidVars.join(" ")}`,
    );
  }

  return {
    supabaseAnonKey: supabaseAnonKey as string,
    supabaseUrl: supabaseUrl as string,
  };
}
