import { NextResponse, type NextRequest } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  bookingIdSchema,
  bookingStatusUpdateSchema,
} from "@/lib/booking-validation";
import { getBookingById, updateBookingStatus } from "@/lib/db";
import { notifyBookingOwner } from "@/lib/whatsapp";

export const runtime = "nodejs";

interface Context {
  params: Promise<{ id: string }>;
}

function response(body: unknown, init?: ResponseInit) {
  const result = NextResponse.json(body, init);
  result.headers.set("Cache-Control", "no-store");
  return result;
}

async function bookingId(context: Context) {
  const { id } = await context.params;
  const parsed = bookingIdSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

export async function GET(_request: NextRequest, context: Context) {
  if (!(await isAdminAuthenticated())) {
    return response({ error: "Unauthorized." }, { status: 401 });
  }

  const id = await bookingId(context);

  if (!id) {
    return response({ error: "Invalid booking ID." }, { status: 400 });
  }

  try {
    const booking = await getBookingById(id);
    return booking
      ? response({ booking })
      : response({ error: "Booking not found." }, { status: 404 });
  } catch {
    return response({ error: "Unable to load booking." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  if (!(await isAdminAuthenticated())) {
    return response({ error: "Unauthorized." }, { status: 401 });
  }

  const id = await bookingId(context);

  if (!id) {
    return response({ error: "Invalid booking ID." }, { status: 400 });
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

  const parsed = bookingStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return response({ error: "Invalid booking status." }, { status: 422 });
  }

  try {
    const booking = await updateBookingStatus(id, parsed.data.status);
    return booking
      ? response({ booking })
      : response({ error: "Booking not found." }, { status: 404 });
  } catch {
    return response({ error: "Unable to update booking." }, { status: 500 });
  }
}

export async function POST(_request: NextRequest, context: Context) {
  if (!(await isAdminAuthenticated())) {
    return response({ error: "Unauthorized." }, { status: 401 });
  }

  const id = await bookingId(context);

  if (!id) {
    return response({ error: "Invalid booking ID." }, { status: 400 });
  }

  try {
    const booking = await getBookingById(id);

    if (!booking) {
      return response({ error: "Booking not found." }, { status: 404 });
    }

    const notification = await notifyBookingOwner(booking, true);
    const updatedBooking = await getBookingById(id);

    return response({
      booking: updatedBooking ?? booking,
      notification,
    });
  } catch {
    return response(
      { error: "Unable to send the WhatsApp alert." },
      { status: 500 }
    );
  }
}
