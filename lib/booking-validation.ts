import { z } from "zod";

import { BOOKING_STATUSES } from "./booking-types";

const cleanText = (maximum: number) =>
  z.string().trim().min(1).max(maximum);

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional().default("");

const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(24)
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    },
    "Enter a valid phone number."
  );

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Enter a valid appointment date.");

const timeSchema = z.enum(["09:00", "11:00", "13:00", "15:00", "17:00"]);

function indiaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function latestBookingDate() {
  const date = new Date(`${indiaDate()}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 180);
  return date.toISOString().slice(0, 10);
}

export const bookingRequestSchema = z
  .object({
    requestId: z.string().uuid(),
    firstName: cleanText(80),
    lastName: cleanText(80),
    email: z
      .union([z.literal(""), z.string().trim().email().max(254)])
      .optional()
      .default(""),
    phone: phoneSchema,
    address: cleanText(240),
    city: cleanText(100),
    postcode: cleanText(16),
    vehicle: cleanText(100),
    vehicleModel: cleanText(120),
    registration: optionalText(30),
    date: dateSchema,
    time: timeSchema,
    notes: optionalText(500),
    selectedServices: z
      .array(cleanText(160))
      .max(50)
      .optional()
      .default([]),
    basePackageIncluded: z.boolean().optional().default(false),
    website: optionalText(200),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.date < indiaDate()) {
      context.addIssue({
        code: "custom",
        path: ["date"],
        message: "Appointment date cannot be in the past.",
      });
    }

    if (value.date > latestBookingDate()) {
      context.addIssue({
        code: "custom",
        path: ["date"],
        message: "Appointments can be requested up to 180 days ahead.",
      });
    }

    if (!value.basePackageIncluded && value.selectedServices.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["selectedServices"],
        message: "Select a service or include the base package.",
      });
    }
  });

export const adminLoginSchema = z
  .object({
    password: z.string().min(1).max(256),
  })
  .strict();

export const bookingStatusUpdateSchema = z
  .object({
    status: z.enum(BOOKING_STATUSES),
  })
  .strict();

export const bookingIdSchema = z.string().uuid();

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type AdminLoginRequest = z.infer<typeof adminLoginSchema>;
