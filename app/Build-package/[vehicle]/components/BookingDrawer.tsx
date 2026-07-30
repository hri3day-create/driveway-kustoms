"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import ServicePhoto from "@/components/ServicePhoto";

interface Props {
  open: boolean;
  onClose: () => void;
  total: number;
  vehicle: string;
  selectedServices: string[];
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  date: string;
  time: string;
  notes: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  date: "",
  time: "",
  notes: "",
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-500 focus:bg-white/[0.09] focus:ring-4 focus:ring-red-500/10";
const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55";

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

export default function BookingDrawer({
  open,
  onClose,
  total,
  vehicle,
  selectedServices,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(
    () => ({
      firstName: !form.firstName.trim(),
      lastName: !form.lastName.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      phone: form.phone.replace(/\D/g, "").length < 7,
      address: !form.address.trim(),
      city: !form.city.trim(),
      postcode: !form.postcode.trim(),
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
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setIsSubmitting(false);
      setAttempted(false);
    }
  }, [open]);

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 850);
  };

  const fieldError = (field: keyof typeof errors) =>
    attempted && errors[field];

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 isolate"
      role="dialog"
      aria-modal="true"
      aria-label="Reserve your vehicle"
    >
      <button
        aria-label="Close booking drawer"
        className="absolute inset-0 bg-[#06070a]/78 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl animate-[slide-in_0.45s_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden border-l border-white/10 bg-[#0f0f10]/96 shadow-[-24px_0_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
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
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white/70 transition hover:bg-white/10 hover:text-white"
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
              Reservation received
            </p>

            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              We will be in touch shortly.
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Your concierge will confirm availability for
              your {vehicle} and tailor the final details
              around your schedule.
            </p>

            <button
              type="button"
              onClick={onClose}
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

              <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                {selectedServices.length ? (
                  selectedServices.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-2xl bg-black/20 px-3 py-2"
                    >
                      <ServicePhoto
                        name={service}
                        className="h-8 w-8 rounded-xl"
                        sizes="32px"
                      />

                      <p className="min-w-0 text-sm text-white/60">
                        {service}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/45">
                    Vehicle reservation consultation
                  </p>
                )}
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-base font-medium text-white">
                Contact details
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) =>
                      updateField("firstName", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Alex"
                  />
                  {fieldError("firstName") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      First name is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) =>
                      updateField("lastName", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Morgan"
                  />
                  {fieldError("lastName") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Last name is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    className={inputClass}
                    placeholder="alex@example.com"
                  />
                  {fieldError("email") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Enter a valid email.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    className={inputClass}
                    placeholder="(555) 000-0000"
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
                Delivery address
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="address">
                    Street address
                  </label>
                  <input
                    id="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    className={inputClass}
                    placeholder="123 Park Avenue"
                  />
                  {fieldError("address") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Address is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) =>
                      updateField("city", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Mumbai"
                  />
                  {fieldError("city") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      City is required.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="postcode">
                    Postal code
                  </label>
                  <input
                    id="postcode"
                    autoComplete="postal-code"
                    value={form.postcode}
                    onChange={(e) =>
                      updateField("postcode", e.target.value)
                    }
                    className={inputClass}
                    placeholder="400001"
                  />
                  {fieldError("postcode") && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      Postal code is required.
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

            <section className="mt-7">
              <label className={labelClass} htmlFor="notes">
                A note for your concierge{" "}
                <span className="normal-case tracking-normal text-white/30">
                  (optional)
                </span>
              </label>

              <textarea
                id="notes"
                rows={3}
                maxLength={500}
                value={form.notes}
                onChange={(e) =>
                  updateField("notes", e.target.value)
                }
                className={`${inputClass} resize-none`}
                placeholder="Tell us anything that will make your experience exceptional."
              />
            </section>

            <div className="sticky bottom-0 -mx-4 mt-8 border-t border-white/10 bg-[#0f0f10]/92 px-4 pb-2 pt-5 backdrop-blur-xl sm:-mx-8 sm:px-8">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/35"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Securing reservation
                  </>
                ) : (
                  <>Request reservation</>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] leading-4 text-white/35">
                No payment is collected today. Your
                concierge will confirm every detail.
              </p>
            </div>
          </form>
        )}
      </aside>

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
    </div>
  );
}
