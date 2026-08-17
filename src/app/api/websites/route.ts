import { NextRequest, NextResponse } from "next/server";

// In-memory / storage store for websites per user session
// Can easily sync with Supabase tables
export interface WebsiteItem {
  id: string;
  domain: string;
  display_name: string | null;
  is_active: boolean;
  monitoring_enabled: boolean;
  last_score: number | null;
  last_scanned_at: string | null;
  created_at: string;
}

// Global cache for server runtime
let globalWebsites: WebsiteItem[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    websites: globalWebsites,
    total: globalWebsites.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let domain = body.domain || "";

    // Clean & normalize domain: strip protocols, trailing slashes, www
    domain = domain
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .replace(/^www\./i, "")
      .toLowerCase();

    if (!domain) {
      return NextResponse.json(
        { detail: "Please provide a valid domain name" },
        { status: 400 }
      );
    }

    // Check if domain already exists
    const existing = globalWebsites.find((w) => w.domain === domain);
    if (existing) {
      return NextResponse.json(existing);
    }

    const newWebsite: WebsiteItem = {
      id: "ws_" + Math.random().toString(36).substring(2, 11),
      domain,
      display_name: body.display_name || domain,
      is_active: true,
      monitoring_enabled: body.monitoring_enabled ?? true,
      last_score: null,
      last_scanned_at: null,
      created_at: new Date().toISOString(),
    };

    globalWebsites = [newWebsite, ...globalWebsites];

    return NextResponse.json(newWebsite, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to add domain" },
      { status: 500 }
    );
  }
}
