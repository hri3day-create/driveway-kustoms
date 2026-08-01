import { NextResponse, type NextRequest } from "next/server";

import {
  getRequestIp,
  hashRateLimitIdentity,
  isAdminAuthConfigured,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { adminLoginSchema } from "@/lib/booking-validation";
import { consumeRateLimit, DatabaseConfigurationError } from "@/lib/db";

export const runtime = "nodejs";

function response(body: unknown, init?: ResponseInit) {
  const result = NextResponse.json(body, init);
  result.headers.set("Cache-Control", "no-store");
  return result;
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return response(
      { error: "Admin authentication is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    const rawBody = await request.text();
    if (rawBody.length > 2_000) {
      return response({ error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return response({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return response({ error: "Invalid credentials." }, { status: 401 });
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    try {
      const rateLimit = await consumeRateLimit(
        "admin-login",
        hashRateLimitIdentity(getRequestIp(request)),
        5,
        15 * 60
      );

      if (!rateLimit.allowed) {
        const result = response(
          { error: "Too many login attempts. Try again later." },
          { status: 429 }
        );
        result.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
        return result;
      }
    } catch (error) {
      if (error instanceof DatabaseConfigurationError) {
        return response(
          { error: "Admin service is not configured." },
          { status: 503 }
        );
      }

      return response({ error: "Unable to sign in." }, { status: 500 });
    }

    return response({ error: "Invalid credentials." }, { status: 401 });
  }

  await setAdminSessionCookie();
  return response({ ok: true });
}
