import { NextResponse } from "next/server";

import { clearAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  await clearAdminSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
