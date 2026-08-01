import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "dk_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

function sign(payload: string) {
  return createHmac("sha256", adminPassword())
    .update(payload)
    .digest("base64url");
}

export function isAdminAuthConfigured() {
  return adminPassword().length >= 12;
}

export function verifyAdminPassword(candidate: string) {
  return isAdminAuthConfigured() && safeEqual(candidate, adminPassword());
}

export function createAdminSessionToken() {
  if (!isAdminAuthConfigured()) {
    throw new Error("Admin authentication is not configured.");
  }

  const payload = Buffer.from(
    JSON.stringify({
      version: 1,
      expiresAt:
        Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
      nonce: randomBytes(18).toString("base64url"),
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token || !isAdminAuthConfigured()) {
    return false;
  }

  const [payload, signature, extra] = token.split(".");

  if (!payload || !signature || extra || !safeEqual(signature, sign(payload))) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { version?: number; expiresAt?: number };
    const now = Math.floor(Date.now() / 1000);

    return (
      decoded.version === 1 &&
      typeof decoded.expiresAt === "number" &&
      decoded.expiresAt > now &&
      decoded.expiresAt <= now + ADMIN_SESSION_MAX_AGE_SECONDS + 300
    );
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie() {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    priority: "high",
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminSessionToken(
    store.get(ADMIN_SESSION_COOKIE)?.value
  );
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function hashRateLimitIdentity(identity: string) {
  const secret =
    process.env.RATE_LIMIT_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.DATABASE_URL;

  if (!secret) {
    throw new Error("Rate-limit hashing is not configured.");
  }

  return createHmac("sha256", secret).update(identity).digest("hex");
}
