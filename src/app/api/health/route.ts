import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "webguard-ai", timestamp: new Date().toISOString() },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
