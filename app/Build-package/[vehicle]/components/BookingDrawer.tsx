"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";

import ServicePhoto from "@/components/ServicePhoto";

interface Props {
  open: boolean;
  onClose: () => void;
  total: number;
  vehicle: string;
  selectedServices: string[];
  basePackageIncluded: boolean;
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleModel: string;
  registration: string;
  address: string;
  city: string;
  postcode: string;
  date: string;
  time: string;
  notes: string;
  website: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  vehicleModel: "",
  registration: "",
  address: "",
  city: "",
  postcode: "",
  date: "",
  time: "",
  notes: "",
  website: "",
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-red-500 focus:bg-white/[0.09] focus:ring-4 focus:ring-red-500/10 sm:text-sm";
const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55";
const PENDING_BOOKING_KEY = "dk_pending_booking_v1";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const localDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 10);
};

const latestBookingDate = () => {
  const date = new Date(`${localDate()}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 180);
  return date.toISOString().slice(0, 10);
};

const fingerprintPayload = async (payload: string) => {
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(payload)
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

export default function BookingDrawer({
  open,
  onClose,
  total,
  vehicle,
  selectedServices,
  basePackageIncluded,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const requestIdRef = useRef<{
    id: string;
    fingerprint: string;
  } | null>(null);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setSubmitted(false);
    setIsSubmitting(false);
    setAttempted(false);
    setSubmitError("");
    setBookingCode("");
    setServicesOpen(false);
    onClose();
  };

  const errors = useMemo(
    () => ({
      firstName: !form.firstName.trim(),
      email:
        Boolean(form.email.trim()) &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      phone: form.phone.replace(/\D/g, "").length < 10,
      vehicleModel: !form.vehicleModel.trim(),
      city: !form.city.trim(),
      date: !form.date || form.date < localDate(),
      time: !form.time,
    }),
    [form]
  );

  const isValid = !Object.values(errors).some(Boolean);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (servicesOpen) {
          setServicesOpen(false);
          return;
        }

        if (isSubmitting) {
          return;
        }

        setSubmitted(false);
        setIsSubmitting(false);
        setAttempted(false);
        setSubmitError("");
        setBookingCode("");
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isSubmitting, open, onClose, servicesOpen]);

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    setSubmitError("");

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingPayload = {
        firstName: form.firstName,
        lastName: form.lastName.trim() || "-",
        email: form.email,
        phone: form.phone,
        vehicle,
        vehicleModel: form.vehicleModel,
        registration: form.registration,
        address: form.address.trim() || `${form.city} - confirm exact address by phone`,
        city: form.city,
        postcode: form.postcode.trim() || "-",
        date: form.date,
        time: form.time,
        notes: form.notes,
        selectedServices,
        basePackageIncluded,
        website: form.website,
      };
      const payloadFingerprint = await fingerprintPayload(
        JSON.stringify(bookingPayload)
      );
      let pendingRequest = requestIdRef.current;

      if (!pendingRequest || pendingRequest.fingerprint !== payloadFingerprint) {
        try {
          const stored = JSON.parse(
            window.sessionStorage.getItem(PENDING_BOOKING_KEY) || "null"
          ) as { id?: string; fingerprint?: string } | null;

          pendingRequest =
            stored?.id && stored.fingerprint === payloadFingerprint
              ? { id: stored.id, fingerprint: stored.fingerprint }
              : {
                  id: window.crypto.randomUUID(),
                  fingerprint: payloadFingerprint,
                };
        } catch {
          pendingRequest = {
            id: window.crypto.randomUUID(),
            fingerprint: payloadFingerprint,
          };
        }

        requestIdRef.current = pendingRequest;

        try {
          window.sessionStorage.setItem(
            PENDING_BOOKING_KEY,
            JSON.stringify(pendingRequest)
          );
        } catch {
          // Submission still works if browser storage is unavailable.
        }
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: pendingRequest.id,
          ...bookingPayload,
        }),
      });

      const result = (await response.json()) as {
        bookingCode?: string;
        error?: string;
      };

      if (!response.ok || !result.bookingCode) {
        throw new Error(
          result.error || "We could not save your booking. Please try again."
        );
      }

      setBookingCode(result.bookingCode);
      setForm(initialForm);
      setIsSubmitting(false);
      setSubmitted(true);
      requestIdRef.current = null;
      try {
        window.sessionStorage.removeItem(PENDING_BOOKING_KEY);
      } catch {
        // Nothing else is required after a confirmed receipt.
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not save your booking. Please try again."
      );
    }
  };

  const fieldError = (field: keyof typeof errors) =>
    attempted && errors[field];

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] isolate"
      role="dialog"
      aria-modal="true"
      aria-label="Reserve your vehicle"
    >
      <button
        aria-label="Close booking drawer"
        className="absolute inset-0 bg-[#06070a]/78 backdrop-blur-sm"
        onClick={handleClose}
        disabled={isSubmitting}
      />

      <aside className="absolute inset-0 flex h-[100dvh] w-full max-w-none animate-[slide-in_0.45s_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden bg-[#0f0f10] shadow-[-24px_0_80px_rgba(0,0,0,0.5)] sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-2xl sm:border-l sm:border-white/10 sm:bg-[#0f0f10]/96 sm:backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-red-500/6 blur-3xl" />
        </div>

        <header className="relative flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8 sm:py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">
              Reservation
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              Confirm your experience
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-35"
            aria-label="Close"
          >
            X
          </button>
        </header>

        {submitted ? (
          <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center animate-[fade-up_0.55s_ease-out] sm:px-8">
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-3xl text-emerald-200 shadow-[0_0_60px_rgba(110,231,183,0.18)]">
              OK
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200">
              Booking request saved
            </p>

            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              We will call you shortly.
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Your request is safely stored. Our team will
              call you to confirm availability and finalise
              the service details for your {vehicle}.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Booking ID
              </p>
              <p className="mt-1 font-mono text-base font-semibold text-white">
                {bookingCode}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Return to configurator
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-8 sm:pt-6"
          >
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              name="website"
              value={form.website}
              onChange={(event) =>
                updateField("website", event.target.value)
              }
            />

            <section className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/[0.11] to-white/[0.035] p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Vehicle and configuration
                  </p>

                  <h3 className="mt-1 text-lg font-medium text-white">
                    {vehicle || "Selected vehicle"}
                  </h3>
                </div>

                <span className="whitespace-nowrap text-lg font-medium text-white">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                {selectedServices.length ? (
                  <>
                    <div className="space-y-2">
                      {selectedServices.slice(0, 3).map((service) => (
                        <div
                          key={service}
                          className="flex min-w-0 items-center gap-3 rounded-2xl bg-black/20 px-3 py-2"
                        >
                          <ServicePhoto
                            name={service}
                            variant="compact-thumbnail"
                            className="rounded-xl"
                            sizes="40px"
                          />

                          <p className="min-w-0 truncate text-sm text-white/70">
                            {service}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setServicesOpen(true)}
                      className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-left text-sm font-medium text-white transition hover:border-red-400/40 hover:bg-white/[0.075]"
                    >
                      <span>View all selected services</span>
                      <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs text-red-200">
                        {selectedServices.length}
                      </span>
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-white/45">
                    Vehicle reservation consultation
                  </p>
                )}
              </div>
            </section>

            <section className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-medium text-white">
                  Tell us where to call
                </h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  About 1 minute
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="firstName">
                    Your name
                  </label>
                  <input
                    id="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) =>
                      updateField("firstName", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Your name"
                  />
                  {fieldError("firstName") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Tell us your name.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="phone">
                    WhatsApp / phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    className={inputClass}
                    placeholder="+91 98765 43210"
                  />
                  {fieldError("phone") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Enter a valid phone number.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-base font-medium text-white">
                Your car and location
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="vehicleModel">
                    Make and model
                  </label>
                  <input
                    id="vehicleModel"
                    autoComplete="off"
                    value={form.vehicleModel}
                    onChange={(event) =>
                      updateField("vehicleModel", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Hyundai Creta"
                  />
                  {fieldError("vehicleModel") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Enter your vehicle make and model.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="city">
                    Area / city
                  </label>
                  <input
                    id="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) =>
                      updateField("city", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Your area or city"
                  />
                  {fieldError("city") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Tell us your service area.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-base font-medium text-white">
                Preferred appointment
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="date">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    min={localDate()}
                    max={latestBookingDate()}
                    value={form.date}
                    onChange={(e) =>
                      updateField("date", e.target.value)
                    }
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                  {fieldError("date") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Choose a date.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="time">
                    Time
                  </label>
                  <select
                    id="time"
                    value={form.time}
                    onChange={(e) =>
                      updateField("time", e.target.value)
                    }
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" className="bg-[#111318]">
                      Select a time
                    </option>
                    {["09:00", "11:00", "13:00", "15:00", "17:00"].map(
                      (time) => (
                        <option
                          key={time}
                          value={time}
                          className="bg-[#111318]"
                        >
                          {time}
                        </option>
                      )
                    )}
                  </select>
                  {fieldError("time") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Choose a time.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <details className="group mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white/75">
                Add more details <span className="text-xs font-normal text-white/35">Optional +</span>
              </summary>

              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} placeholder="you@example.com" />
                  {fieldError("email") && <p className="mt-1.5 text-xs text-rose-300">Enter a valid email.</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="registration">Registration</label>
                  <input id="registration" value={form.registration} onChange={(e) => updateField("registration", e.target.value.toUpperCase())} className={`${inputClass} uppercase`} placeholder="MH 01 AB 1234" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="address">Exact address</label>
                  <input id="address" autoComplete="street-address" value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} placeholder="Can also be confirmed on call" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="postcode">Postal code</label>
                  <input id="postcode" inputMode="numeric" autoComplete="postal-code" value={form.postcode} onChange={(e) => updateField("postcode", e.target.value)} className={inputClass} placeholder="400001" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="notes">Anything we should know?</label>
                  <textarea id="notes" rows={3} maxLength={500} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className={`${inputClass} resize-none`} placeholder="Special requests or questions" />
                </div>
              </div>
            </details>

            <div className="sticky bottom-0 -mx-4 mt-8 border-t border-white/10 bg-[#0f0f10]/92 px-4 pb-2 pt-5 backdrop-blur-xl sm:-mx-8 sm:px-8">
              {submitError && (
                <p
                  className="mb-3 rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2.5 text-center text-xs leading-5 text-rose-200"
                  role="alert"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/35"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Saving booking
                  </>
                ) : (
                  <>Reserve my slot</>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] leading-4 text-white/35">
                Reserve with confidence — no online payment is required.
                We confirm every detail with you personally.
              </p>
            </div>
          </form>
        )}
      </aside>

      {servicesOpen && (
        <div
          className="absolute inset-0 z-20 flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="All selected services"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setServicesOpen(false);
            }
          }}
        >
          <section className="flex max-h-[82dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#141416] shadow-2xl sm:max-w-lg sm:rounded-[2rem]">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">
                  Your configuration
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Selected services
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setServicesOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close selected services"
              >
                X
              </button>
            </header>

            <div className="space-y-2 overflow-y-auto px-4 py-4 sm:px-6">
              {selectedServices.map((service, index) => (
                <div
                  key={`${service}-${index}`}
                  className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.045] p-3"
                >
                  <ServicePhoto
                    name={service}
                    variant="compact-thumbnail"
                    className="rounded-xl"
                    sizes="40px"
                  />
                  <p className="min-w-0 text-sm leading-5 text-white/75">
                    {service}
                  </p>
                </div>
              ))}
            </div>

            <footer className="border-t border-white/10 bg-[#141416]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
              <button
                type="button"
                onClick={() => setServicesOpen(false)}
                className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.99]"
              >
                Done
              </button>
            </footer>
          </section>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
