import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import {
  calculateBookingPricing,
  UnknownBookingServicesError,
} from "@/lib/booking-catalog";
import {
  getRequestIp,
  hashRateLimitIdentity,
} from "@/lib/admin-auth";
import type { BookingReceipt, CreateBookingInput } from "@/lib/booking-types";
import { bookingRequestSchema } from "@/lib/booking-validation";
import {
  consumeRateLimit,
  createBooking,
  DatabaseConfigurationError,
  findBookingByRequestId,
} from "@/lib/db";
import { notifyBookingOwner } from "@/lib/whatsapp";
import { notifyBookingPushSubscribers } from "@/lib/push-notifications";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 32_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;

function receipt(booking: {
  id: string;
  bookingCode: string;
  status: BookingReceipt["status"];
  totalAmount: number;
  currency: "INR";
  createdAt: string;
}): BookingReceipt {
  return {
    id: booking.id,
    bookingCode: booking.bookingCode,
    status: booking.status,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    createdAt: booking.createdAt,
  };
}

function bookingCode() {
  const day = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `DK-${day}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function fingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function noStoreJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function notifyOwnerSafely(
  booking: Parameters<typeof notifyBookingOwner>[0],
  immediate: boolean
) {
  try {
    await notifyBookingOwner(booking, immediate);
  } catch {
    // The booking is already durable. Alert retry remains available to admin.
  }
}

async function notifyPushSafely(
  booking: Parameters<typeof notifyBookingPushSubscribers>[0]
) {
  try {
    await notifyBookingPushSubscribers(booking);
  } catch {
    // The booking is durable even if a device notification cannot be delivered.
  }
}

export async function POST(request: NextRequest) {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return noStoreJson({ error: "Unable to read request." }, { status: 400 });
  }

  if (rawBody.length > MAX_BODY_SIZE) {
    return noStoreJson({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return noStoreJson({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return noStoreJson(
      {
        error: "Invalid booking details.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  if (parsed.data.website) {
    const code = bookingCode();
    return noStoreJson(
      {
        bookingCode: code,
        booking: {
          id: randomUUID(),
          bookingCode: code,
          status: "new",
          totalAmount: 0,
          currency: "INR",
          createdAt: new Date().toISOString(),
        },
        idempotent: false,
      },
      { status: 201 }
    );
  }

  let pricing;

  try {
    pricing = calculateBookingPricing(
      parsed.data.selectedServices,
      parsed.data.basePackageIncluded
    );
  } catch (error) {
    if (error instanceof UnknownBookingServicesError) {
      return noStoreJson(
        {
          error: "One or more selected services are unavailable.",
          invalidServices: error.services,
        },
        { status: 422 }
      );
    }

    return noStoreJson({ error: "Unable to price booking." }, { status: 500 });
  }

  const requestFingerprint = fingerprint({
    ...parsed.data,
    selectedServices: pricing.selectedServices.map((service) => service.name),
    basePackageAmount: pricing.basePackageAmount,
    servicesAmount: pricing.servicesAmount,
    totalAmount: pricing.totalAmount,
  });

  try {
    const existing = await findBookingByRequestId(parsed.data.requestId);

    if (existing) {
      if (existing.requestFingerprint !== requestFingerprint) {
        return noStoreJson(
          { error: "This request ID was already used for another booking." },
          { status: 409 }
        );
      }

      await notifyOwnerSafely(existing.booking, false);

      return noStoreJson({
        bookingCode: existing.booking.bookingCode,
        booking: receipt(existing.booking),
        idempotent: true,
      });
    }

    const rateLimit = await consumeRateLimit(
      "public-booking",
      hashRateLimitIdentity(getRequestIp(request)),
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_SECONDS
    );

    if (!rateLimit.allowed) {
      const response = noStoreJson(
        { error: "Too many booking attempts. Please try again shortly." },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
      return response;
    }

    const data = parsed.data;
    const input: CreateBookingInput = {
      requestId: data.requestId,
      requestFingerprint,
      bookingCode: bookingCode(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postcode: data.postcode,
      vehicle: data.vehicle,
      vehicleModel: data.vehicleModel,
      registration: data.registration,
      appointmentDate: data.date,
      appointmentTime: data.time,
      notes: data.notes,
      selectedServices: pricing.selectedServices,
      includeBasePackage: pricing.includeBasePackage,
      basePackageAmount: pricing.basePackageAmount,
      servicesAmount: pricing.servicesAmount,
      totalAmount: pricing.totalAmount,
    };
    const result = await createBooking(input);

    if (!result.fingerprintMatches) {
      return noStoreJson(
        { error: "This request ID was already used for another booking." },
        { status: 409 }
      );
    }

    await notifyOwnerSafely(result.booking, result.created);
    if (result.created) {
      await notifyPushSafely(result.booking);
    }

    return noStoreJson(
      {
        bookingCode: result.booking.bookingCode,
        booking: receipt(result.booking),
        idempotent: !result.created,
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return noStoreJson(
        { error: "Booking service is not configured." },
        { status: 503 }
      );
    }

    return noStoreJson(
      { error: "Unable to save booking. Please try again." },
      { status: 500 }
    );
  }
}
