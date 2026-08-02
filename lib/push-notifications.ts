import "server-only";

import webPush from "web-push";

import type { BookingRecord } from "./booking-types";
import {
  listPushSubscriptions,
  removePushSubscriptions,
} from "./db";

function pushConfiguration() {
  return {
    publicKey: process.env.WEB_PUSH_PUBLIC_KEY?.trim() ?? "",
    privateKey: process.env.WEB_PUSH_PRIVATE_KEY?.trim() ?? "",
    subject:
      process.env.WEB_PUSH_SUBJECT?.trim() ??
      "mailto:notifications@drivewaykustoms.com",
  };
}

export function getPushPublicKey() {
  return pushConfiguration().publicKey;
}

export function isPushConfigured() {
  const config = pushConfiguration();
  return Boolean(config.publicKey && config.privateKey && config.subject);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function notifyBookingPushSubscribers(booking: BookingRecord) {
  const config = pushConfiguration();

  if (!config.publicKey || !config.privateKey || !config.subject) {
    return { configured: false, delivered: 0, failed: 0 };
  }

  webPush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  const subscriptions = await listPushSubscriptions();

  if (subscriptions.length === 0) {
    return { configured: true, delivered: 0, failed: 0 };
  }

  const customerName = `${booking.firstName} ${booking.lastName}`.trim();
  const payload = JSON.stringify({
    title: `New booking · ${booking.bookingCode}`,
    body: `${customerName} · ${booking.vehicleModel || booking.vehicle} · ${formatCurrency(booking.totalAmount)}`,
    url: "/admin/orders",
    tag: `booking-${booking.id}`,
  });
  const expired: string[] = [];
  let delivered = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(subscription, payload, {
          TTL: 60 * 60,
          urgency: "high",
        });
        delivered += 1;
      } catch (error) {
        failed += 1;
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : 0;

        if (statusCode === 404 || statusCode === 410) {
          expired.push(subscription.endpoint);
        }
      }
    })
  );

  await removePushSubscriptions(expired);
  return { configured: true, delivered, failed };
}
