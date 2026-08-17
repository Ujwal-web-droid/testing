import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser (Client Components).
 * This client automatically handles session management via cookies.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "https://placeholder-project.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(url, anonKey);
}

