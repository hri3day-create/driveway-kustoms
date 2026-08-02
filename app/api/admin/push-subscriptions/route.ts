import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  removePushSubscription,
  savePushSubscription,
} from "@/lib/db";
import {
  getPushPublicKey,
  isPushConfigured,
} from "@/lib/push-notifications";

export const runtime = "nodejs";

const subscriptionSchema = z
  .object({
    endpoint: z.string().url().max(2_000),
    keys: z.object({
      p256dh: z.string().min(20).max(500),
      auth: z.string().min(8).max(500),
    }),
  })
  .strict();

const deleteSchema = z.object({ endpoint: z.string().url().max(2_000) }).strict();

function json(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function requireAdmin() {
  return isAdminAuthenticated();
}

export async function GET() {
  if (!(await requireAdmin())) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  return json({
    configured: isPushConfigured(),
    publicKey: getPushPublicKey(),
  });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const parsed = subscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return json({ error: "Invalid push subscription." }, { status: 422 });
  }

  if (!isPushConfigured()) {
    return json({ error: "Push notifications are not configured." }, { status: 503 });
  }

  await savePushSubscription(
    parsed.data,
    request.headers.get("user-agent") ?? ""
  );
  return json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);

  if (!parsed.success) {
    return json({ error: "Invalid push subscription." }, { status: 422 });
  }

  await removePushSubscription(parsed.data.endpoint);
  return json({ ok: true });
}
