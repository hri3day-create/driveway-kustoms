import "server-only";

import { neon } from "@neondatabase/serverless";

import type {
  BookingListOptions,
  BookingRecord,
  BookingServiceLine,
  BookingStatus,
  CreateBookingInput,
  CreateBookingResult,
  WhatsAppNotificationStatus,
} from "./booking-types";

type SqlClient = ReturnType<typeof neon>;

interface BookingRow extends Record<string, unknown> {
  id: string;
  booking_code: string;
  request_id: string;
  request_fingerprint: string;
  status: BookingStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  vehicle: string;
  vehicle_model: string;
  registration: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  selected_services: BookingServiceLine[] | string;
  include_base_package: boolean;
  base_package_amount: number;
  services_amount: number;
  total_amount: number;
  currency: "INR";
  whatsapp_notification_status: WhatsAppNotificationStatus;
  whatsapp_message_id: string | null;
  whatsapp_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoredPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let client: SqlClient | null = null;
let schemaInitialization: Promise<void> | null = null;

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "DatabaseConfigurationError";
  }
}

export function getDatabase(): SqlClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new DatabaseConfigurationError();
  }

  if (!client) {
    client = neon(databaseUrl);
  }

  return client;
}

async function initializeDatabase(sql: SqlClient) {
  const existing = (await sql`
    SELECT
      to_regclass('public.bookings') AS bookings,
      to_regclass('public.booking_rate_limits') AS rate_limits,
      to_regclass('public.admin_push_subscriptions') AS push_subscriptions
  `) as Array<{
    bookings: string | null;
    rate_limits: string | null;
    push_subscriptions: string | null;
  }>;

  if (
    existing[0]?.bookings &&
    existing[0]?.rate_limits &&
    existing[0]?.push_subscriptions
  ) {
    return;
  }

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_code text NOT NULL UNIQUE,
      request_id uuid NOT NULL UNIQUE,
      request_fingerprint text NOT NULL,
      status text NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL DEFAULT '',
      phone text NOT NULL,
      address text NOT NULL,
      city text NOT NULL,
      postcode text NOT NULL,
      vehicle text NOT NULL,
      vehicle_model text NOT NULL,
      registration text NOT NULL DEFAULT '',
      appointment_date date NOT NULL,
      appointment_time time NOT NULL,
      notes text NOT NULL DEFAULT '',
      selected_services jsonb NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(selected_services) = 'array'),
      include_base_package boolean NOT NULL DEFAULT false,
      base_package_amount integer NOT NULL DEFAULT 0
        CHECK (base_package_amount >= 0),
      services_amount integer NOT NULL DEFAULT 0
        CHECK (services_amount >= 0),
      total_amount integer NOT NULL DEFAULT 0
        CHECK (
          total_amount >= 0 AND
          total_amount = base_package_amount + services_amount
        ),
      currency text NOT NULL DEFAULT 'INR'
        CHECK (currency = 'INR'),
      whatsapp_notification_status text NOT NULL DEFAULT 'not_configured'
        CHECK (
          whatsapp_notification_status IN (
            'not_configured', 'pending', 'sent', 'failed'
          )
        ),
      whatsapp_message_id text,
      whatsapp_notified_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS bookings_created_at_idx
      ON bookings (created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS bookings_status_created_at_idx
      ON bookings (status, created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS bookings_appointment_idx
      ON bookings (appointment_date, appointment_time)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS booking_rate_limits (
      scope text NOT NULL,
      key_hash text NOT NULL,
      window_started_at timestamptz NOT NULL,
      request_count integer NOT NULL DEFAULT 1
        CHECK (request_count > 0),
      expires_at timestamptz NOT NULL,
      PRIMARY KEY (scope, key_hash, window_started_at)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS booking_rate_limits_expiry_idx
      ON booking_rate_limits (expires_at)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_push_subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      endpoint text NOT NULL UNIQUE,
      p256dh text NOT NULL,
      auth text NOT NULL,
      user_agent text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

async function getReadyDatabase() {
  const sql = getDatabase();

  if (!schemaInitialization) {
    schemaInitialization = initializeDatabase(sql);
  }

  try {
    await schemaInitialization;
  } catch (error) {
    schemaInitialization = null;
    throw error;
  }

  return sql;
}

function parseServices(value: BookingRow["selected_services"]) {
  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? (parsed as BookingServiceLine[])
      : [];
  } catch {
    return [];
  }
}

function toIsoString(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function toDateString(value: unknown) {
  return toIsoString(value).slice(0, 10);
}

function toTimeString(value: unknown) {
  return String(value).slice(0, 5);
}

export function mapBookingRow(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    bookingCode: row.booking_code,
    requestId: row.request_id,
    status: row.status,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postcode: row.postcode,
    vehicle: row.vehicle,
    vehicleModel: row.vehicle_model,
    registration: row.registration,
    appointmentDate: toDateString(row.appointment_date),
    appointmentTime: toTimeString(row.appointment_time),
    notes: row.notes,
    selectedServices: parseServices(row.selected_services),
    includeBasePackage: row.include_base_package,
    basePackageAmount: Number(row.base_package_amount),
    servicesAmount: Number(row.services_amount),
    totalAmount: Number(row.total_amount),
    currency: row.currency,
    whatsappNotificationStatus: row.whatsapp_notification_status,
    whatsappMessageId: row.whatsapp_message_id,
    whatsappNotifiedAt: row.whatsapp_notified_at
      ? toIsoString(row.whatsapp_notified_at)
      : null,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export async function findBookingByRequestId(requestId: string) {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    SELECT *
    FROM bookings
    WHERE request_id = ${requestId}::uuid
    LIMIT 1
  `) as BookingRow[];
  const row = rows[0];

  return row
    ? {
        booking: mapBookingRow(row),
        requestFingerprint: row.request_fingerprint,
      }
    : null;
}

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    INSERT INTO bookings (
      booking_code,
      request_id,
      request_fingerprint,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postcode,
      vehicle,
      vehicle_model,
      registration,
      appointment_date,
      appointment_time,
      notes,
      selected_services,
      include_base_package,
      base_package_amount,
      services_amount,
      total_amount
    ) VALUES (
      ${input.bookingCode},
      ${input.requestId}::uuid,
      ${input.requestFingerprint},
      ${input.firstName},
      ${input.lastName},
      ${input.email},
      ${input.phone},
      ${input.address},
      ${input.city},
      ${input.postcode},
      ${input.vehicle},
      ${input.vehicleModel},
      ${input.registration},
      ${input.appointmentDate}::date,
      ${input.appointmentTime}::time,
      ${input.notes},
      ${JSON.stringify(input.selectedServices)}::jsonb,
      ${input.includeBasePackage},
      ${input.basePackageAmount},
      ${input.servicesAmount},
      ${input.totalAmount}
    )
    ON CONFLICT (request_id) DO NOTHING
    RETURNING *
  `) as BookingRow[];

  if (rows[0]) {
    return {
      booking: mapBookingRow(rows[0]),
      created: true,
      fingerprintMatches: true,
    };
  }

  const existing = await findBookingByRequestId(input.requestId);

  if (!existing) {
    throw new Error("Booking insert conflict could not be resolved.");
  }

  return {
    booking: existing.booking,
    created: false,
    fingerprintMatches:
      existing.requestFingerprint === input.requestFingerprint,
  };
}

export async function getBookingById(id: string) {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    SELECT *
    FROM bookings
    WHERE id = ${id}::uuid
    LIMIT 1
  `) as BookingRow[];

  return rows[0] ? mapBookingRow(rows[0]) : null;
}

export async function listBookings(
  options: BookingListOptions = {}
): Promise<BookingRecord[]> {
  const sql = await getReadyDatabase();
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 250);
  const offset = Math.max(options.offset ?? 0, 0);
  const rows = options.status
    ? ((await sql`
        SELECT *
        FROM bookings
        WHERE status = ${options.status}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `) as BookingRow[])
    : ((await sql`
        SELECT *
        FROM bookings
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `) as BookingRow[]);

  return rows.map(mapBookingRow);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
) {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    UPDATE bookings
    SET status = ${status}, updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING *
  `) as BookingRow[];

  return rows[0] ? mapBookingRow(rows[0]) : null;
}

export async function updateWhatsAppNotification(
  id: string,
  status: WhatsAppNotificationStatus,
  messageId: string | null = null
) {
  const sql = await getReadyDatabase();
  const notifiedAt = status === "sent";

  await sql`
    UPDATE bookings
    SET
      whatsapp_notification_status = ${status},
      whatsapp_message_id = ${messageId},
      whatsapp_notified_at = CASE
        WHEN ${notifiedAt} THEN now()
        ELSE whatsapp_notified_at
      END,
      updated_at = now()
    WHERE id = ${id}::uuid
  `;
}

export async function claimWhatsAppNotification(
  id: string,
  immediate = false
) {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    UPDATE bookings
    SET
      whatsapp_notification_status = 'pending',
      updated_at = now()
    WHERE id = ${id}::uuid
      AND whatsapp_notification_status <> 'sent'
      AND (
        whatsapp_notification_status <> 'pending'
        OR updated_at < now() - interval '5 minutes'
      )
      AND (
        ${immediate}
        OR updated_at < now() - interval '1 minute'
      )
    RETURNING id
  `) as Array<{ id: string }>;

  return Boolean(rows[0]);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export async function consumeRateLimit(
  scope: string,
  keyHash: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    WITH cleanup AS (
      DELETE FROM booking_rate_limits
      WHERE expires_at < now() - interval '1 day'
    ),
    bucket AS (
      SELECT to_timestamp(
        floor(extract(epoch FROM now()) / ${windowSeconds}) *
        ${windowSeconds}
      ) AS window_started_at
    ),
    counted AS (
      INSERT INTO booking_rate_limits (
        scope,
        key_hash,
        window_started_at,
        request_count,
        expires_at
      )
      SELECT
        ${scope},
        ${keyHash},
        bucket.window_started_at,
        1,
        bucket.window_started_at + (${windowSeconds} * interval '1 second')
      FROM bucket
      ON CONFLICT (scope, key_hash, window_started_at)
      DO UPDATE SET request_count = booking_rate_limits.request_count + 1
      RETURNING request_count, expires_at
    )
    SELECT
      request_count,
      greatest(1, ceil(extract(epoch FROM (expires_at - now())))) AS retry_after
    FROM counted
  `) as Array<{ request_count: number; retry_after: number }>;
  const requestCount = Number(rows[0]?.request_count ?? limit + 1);
  const retryAfterSeconds = Number(rows[0]?.retry_after ?? windowSeconds);

  return {
    allowed: requestCount <= limit,
    remaining: Math.max(0, limit - requestCount),
    retryAfterSeconds,
  };
}

export async function savePushSubscription(
  subscription: StoredPushSubscription,
  userAgent: string
) {
  const sql = await getReadyDatabase();

  await sql`
    INSERT INTO admin_push_subscriptions (
      endpoint,
      p256dh,
      auth,
      user_agent
    ) VALUES (
      ${subscription.endpoint},
      ${subscription.keys.p256dh},
      ${subscription.keys.auth},
      ${userAgent.slice(0, 500)}
    )
    ON CONFLICT (endpoint) DO UPDATE SET
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      user_agent = EXCLUDED.user_agent,
      updated_at = now()
  `;
}

export async function removePushSubscription(endpoint: string) {
  const sql = await getReadyDatabase();
  await sql`
    DELETE FROM admin_push_subscriptions
    WHERE endpoint = ${endpoint}
  `;
}

export async function removePushSubscriptions(endpoints: string[]) {
  if (endpoints.length === 0) {
    return;
  }

  const sql = await getReadyDatabase();
  await sql`
    DELETE FROM admin_push_subscriptions
    WHERE endpoint IN (
      SELECT jsonb_array_elements_text(${JSON.stringify(endpoints)}::jsonb)
    )
  `;
}

export async function listPushSubscriptions(): Promise<StoredPushSubscription[]> {
  const sql = await getReadyDatabase();
  const rows = (await sql`
    SELECT endpoint, p256dh, auth
    FROM admin_push_subscriptions
    ORDER BY updated_at DESC
  `) as Array<{ endpoint: string; p256dh: string; auth: string }>;

  return rows.map((row) => ({
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
  }));
}
