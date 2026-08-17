import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Uses the Next.js cookies() API for session management.
 *
 * IMPORTANT: cookies().set() / .remove() can only be called in a Server Action
 * or Route Handler — NOT in a Server Component. The cookieOptions callbacks
 * below are safe because Supabase only writes cookies when refreshing tokens
 * (which happens in middleware or server actions, not during SSR reads).
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "https://placeholder-project.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component where
            // cookies cannot be mutated. This is safe to ignore because
            // the middleware will refresh the session ahead of time.
          }
        },
      },
    }
  );
}
