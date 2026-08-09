"use client";

import { Check, LoaderCircle, MapPin, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const inputClass =
  "min-h-13 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

export default function QuickBookingForm() {
  const [form, setForm] = useState({ name: "", phone: "", car: "", location: "", specificRequest: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const valid =
    form.name.trim().length >= 2 &&
    form.phone.replace(/\D/g, "").length >= 10 &&
    form.car.trim().length >= 2 &&
    form.location.trim().length >= 2;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/quick-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: crypto.randomUUID(), ...form }),
      });
      const result = (await response.json().catch(() => null)) as
        | { bookingCode?: string; error?: string }
        | null;

      if (!response.ok || !result?.bookingCode) {
        throw new Error(result?.error || "Unable to send your request.");
      }
      setBookingCode(result.bookingCode);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send your request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (bookingCode) {
    return (
      <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.06] p-7 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400 text-black">
          <Check size={30} strokeWidth={3} />
        </span>
        <h2 className="mt-6 text-3xl font-semibold text-white">Request received</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-300">
          Our team will call you shortly to understand the requirement and confirm your booking.
        </p>
        <p className="mt-5 font-mono text-xs text-emerald-300">{bookingCode}</p>
        <Link href="/" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-[#101010] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:p-7">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-4">
        <Sparkles size={18} className="shrink-0 text-red-400" />
        <p className="text-xs leading-5 text-zinc-300">
          No online payment. This only reserves a callback from our team.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Your name
          <input required autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter your name" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Mobile number
          <input required inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="10-digit mobile number" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Car name
          <input required autoComplete="off" value={form.car} onChange={(e) => update("car", e.target.value)} placeholder="Example: Hyundai Creta" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Location
          <input required autoComplete="street-address" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Area / city" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Specific requirement <span className="text-xs font-normal text-zinc-600">Optional</span>
          <textarea rows={3} value={form.specificRequest} onChange={(e) => update("specificRequest", e.target.value)} placeholder="Tell us what you want for your car" className={`${inputClass} resize-none py-4`} />
        </label>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" aria-hidden="true" />
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <button disabled={!valid || submitting} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 text-base font-semibold text-white shadow-[0_15px_40px_rgba(220,38,38,0.28)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500">
        {submitting ? <><LoaderCircle size={19} className="animate-spin" /> Sending request</> : "Book my callback"}
      </button>

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5"><Phone size={12} /> We call to confirm</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> Doorstep service</span>
      </div>
    </form>
  );
}
