import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getRequestIp, hashRateLimitIdentity } from "@/lib/admin-auth";
import type { CreateBookingInput } from "@/lib/booking-types";
import {
  consumeRateLimit,
  createBooking,
  DatabaseConfigurationError,
  findBookingByRequestId,
} from "@/lib/db";
import { notifyBookingPushSubscribers } from "@/lib/push-notifications";
import { notifyBookingOwner } from "@/lib/whatsapp";

export const runtime = "nodejs";

const quickBookingSchema = z
  .object({
    requestId: z.string().uuid(),
    name: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(24)
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      }, "Enter a valid phone number."),
    car: z.string().trim().min(2).max(120),
    location: z.string().trim().min(2).max(240),
    specificRequest: z.string().trim().max(500).optional().default(""),
    website: z.string().trim().max(200).optional().default(""),
  })
  .strict();

function bookingCode() {
  const day = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `DK-${day}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function noStoreJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text().catch(() => "");

  if (!rawBody || rawBody.length > 12_000) {
    return noStoreJson({ error: "Invalid request." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return noStoreJson({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const parsed = quickBookingSchema.safeParse(body);
  if (!parsed.success) {
    return noStoreJson(
      { error: "Please check your booking details.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  if (parsed.data.website) {
    return noStoreJson({ bookingCode: bookingCode() }, { status: 201 });
  }

  const fingerprint = createHash("sha256")
    .update(JSON.stringify(parsed.data))
    .digest("hex");

  try {
    const existing = await findBookingByRequestId(parsed.data.requestId);
    if (existing) {
      if (existing.requestFingerprint !== fingerprint) {
        return noStoreJson({ error: "This booking request was already used." }, { status: 409 });
      }
      return noStoreJson({ bookingCode: existing.booking.bookingCode, idempotent: true });
    }

    const rateLimit = await consumeRateLimit(
      "quick-booking",
      hashRateLimitIdentity(getRequestIp(request)),
      5,
      15 * 60
    );
    if (!rateLimit.allowed) {
      return noStoreJson(
        { error: "Too many attempts. Please try again shortly." },
        { status: 429 }
      );
    }

    const data = parsed.data;
    const input: CreateBookingInput = {
      requestId: data.requestId,
      requestFingerprint: fingerprint,
      bookingCode: bookingCode(),
      firstName: data.name,
      lastName: "",
      email: "",
      phone: data.phone,
      address: data.location,
      city: "",
      postcode: "",
      vehicle: "quick-booking",
      vehicleModel: data.car,
      registration: "",
      appointmentDate: indiaDate(),
      appointmentTime: "09:00",
      notes: `[QUICK BOOKING]\n${data.specificRequest || "No specific request provided."}`,
      selectedServices: [],
      includeBasePackage: false,
      basePackageAmount: 0,
      servicesAmount: 0,
      totalAmount: 0,
    };
    const result = await createBooking(input);

    if (!result.fingerprintMatches) {
      return noStoreJson({ error: "This booking request was already used." }, { status: 409 });
    }

    if (result.created) {
      await Promise.allSettled([
        notifyBookingOwner(result.booking, true),
        notifyBookingPushSubscribers(result.booking),
      ]);
    }

    return noStoreJson(
      { bookingCode: result.booking.bookingCode, idempotent: !result.created },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return noStoreJson({ error: "Booking service is not configured." }, { status: 503 });
    }
    return noStoreJson({ error: "Unable to save your booking. Please try again." }, { status: 500 });
  }
}
