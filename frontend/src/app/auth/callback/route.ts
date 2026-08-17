import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * OAuth callback handler — Supabase redirects here after Google/GitHub login.
 * Exchanges the auth code for a session, then redirects to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorMsg = searchParams.get("error_description") || searchParams.get("error");
  const next = searchParams.get("next") ?? "/dashboard";

  if (errorMsg) {
    console.error("[OAuth Callback Error from Provider]:", errorMsg);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[OAuth Exchange Error]:", error.message);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
