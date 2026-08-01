CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
);

CREATE INDEX IF NOT EXISTS bookings_created_at_idx
  ON bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS bookings_status_created_at_idx
  ON bookings (status, created_at DESC);

CREATE INDEX IF NOT EXISTS bookings_appointment_idx
  ON bookings (appointment_date, appointment_time);

CREATE TABLE IF NOT EXISTS booking_rate_limits (
  scope text NOT NULL,
  key_hash text NOT NULL,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1
    CHECK (request_count > 0),
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (scope, key_hash, window_started_at)
);

CREATE INDEX IF NOT EXISTS booking_rate_limits_expiry_idx
  ON booking_rate_limits (expires_at);
