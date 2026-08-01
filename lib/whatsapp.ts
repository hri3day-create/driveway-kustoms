import "server-only";

import type { BookingRecord } from "./booking-types";
import {
  claimWhatsAppNotification,
  updateWhatsAppNotification,
} from "./db";

export interface WhatsAppNotificationResult {
  configured: boolean;
  sent: boolean;
  messageId: string | null;
}

function configuredValue(name: string) {
  return process.env[name]?.trim() ?? "";
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function sendBookingWhatsAppNotification(
  booking: BookingRecord
): Promise<WhatsAppNotificationResult> {
  const token = configuredValue("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = configuredValue("WHATSAPP_PHONE_NUMBER_ID");
  const ownerNumber = configuredValue("WHATSAPP_OWNER_NUMBER").replace(
    /\D/g,
    ""
  );
  const templateName = configuredValue("WHATSAPP_TEMPLATE_NAME");
  const language =
    configuredValue("WHATSAPP_TEMPLATE_LANGUAGE") || "en_US";
  const apiVersion = configuredValue("WHATSAPP_GRAPH_VERSION");

  if (
    !token ||
    !phoneNumberId ||
    !ownerNumber ||
    !templateName ||
    !apiVersion
  ) {
    return { configured: false, sent: false, messageId: null };
  }

  const servicesSummary = [
    booking.includeBasePackage ? "Essential Detail" : "",
    ...booking.selectedServices.map((service) => service.name),
  ]
    .filter(Boolean)
    .join(", ")
    .slice(0, 900);
  const vehicleSummary = [
    booking.vehicleModel,
    `category: ${booking.vehicle}`,
    booking.registration ? `registration: ${booking.registration}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const parameters = [
    booking.bookingCode,
    `${booking.firstName} ${booking.lastName}`.trim(),
    booking.phone,
    vehicleSummary,
    servicesSummary || "Consultation",
    formatCurrency(booking.totalAmount),
    `${booking.appointmentDate} at ${booking.appointmentTime}`,
    `${booking.address}, ${booking.city} ${booking.postcode}`,
  ].map((text) => ({ type: "text" as const, text }));

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: ownerNumber,
          type: "template",
          template: {
            name: templateName,
            language: { code: language },
            components: [
              {
                type: "body",
                parameters,
              },
            ],
          },
        }),
        signal: AbortSignal.timeout(8_000),
      }
    );

    if (!response.ok) {
      return { configured: true, sent: false, messageId: null };
    }

    const result = (await response.json()) as {
      messages?: Array<{ id?: string }>;
    };

    const messageId = result.messages?.[0]?.id ?? null;

    return {
      configured: true,
      sent: Boolean(messageId),
      messageId,
    };
  } catch {
    return { configured: true, sent: false, messageId: null };
  }
}

export async function notifyBookingOwner(
  booking: BookingRecord,
  immediate = false
) {
  const claimed = await claimWhatsAppNotification(booking.id, immediate);

  if (!claimed) {
    return {
      attempted: false,
      configured: true,
      sent: booking.whatsappNotificationStatus === "sent",
      messageId: booking.whatsappMessageId,
    };
  }

  const result = await sendBookingWhatsAppNotification(booking);
  const status = !result.configured
    ? "not_configured"
    : result.sent
      ? "sent"
      : "failed";

  await updateWhatsAppNotification(
    booking.id,
    status,
    result.messageId
  );

  return { attempted: true, ...result };
}
