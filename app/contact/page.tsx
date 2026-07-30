"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import Navbar from "@/components/Navbar";

const phone = "+91 87965 62667";
const whatsappNumber = "918796562667";
const instagram = "https://instagram.com/driveway.kustoms";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: "",
    service: "Detailing",
    message: "",
  });

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = [
      "Hello Driveway Kustoms, I would like to enquire about your services.",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Vehicle: ${form.vehicle}`,
      `Interested in: ${form.service}`,
      form.message ? `Details: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-500 focus:bg-white/[0.09] focus:ring-4 focus:ring-red-500/10";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <section className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
              Contact Driveway Kustoms
            </p>

            <h1 className="mt-3 max-w-4xl text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:mt-4 sm:text-6xl">
              Your driveway. Your car. Our concierge.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Tell us about your vehicle and we will help
              plan the right at-home detailing or
              customisation experience.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
              Direct contact
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              We are ready when you are.
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Call, WhatsApp, or message us on Instagram for
              a quick conversation about your car.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:${whatsappNumber}`}
                className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-red-500 hover:bg-white/[0.04]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500/15 text-sm font-semibold text-red-300">
                  Call
                </span>

                <span>
                  <span className="block text-xs text-zinc-500">
                    Phone
                  </span>
                  <span className="font-semibold">{phone}</span>
                </span>
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-green-400 hover:bg-white/[0.04]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-green-500/15 text-[11px] font-semibold uppercase tracking-wide text-green-300">
                  WA
                </span>

                <span>
                  <span className="block text-xs text-zinc-500">
                    WhatsApp
                  </span>
                  <span className="font-semibold">Start a chat</span>
                </span>
              </a>

              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-pink-400 hover:bg-white/[0.04]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-pink-500/15 text-[11px] font-semibold uppercase tracking-wide text-pink-300">
                  IG
                </span>

                <span>
                  <span className="block text-xs text-zinc-500">
                    Instagram
                  </span>
                  <span className="font-semibold">@Driveway.Kustoms</span>
                </span>
              </a>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-6 text-zinc-400">
              <p className="font-medium text-white">
                At-home car-care concierge
              </p>

              <p className="mt-1">
                Detailing, paint protection, interior
                upgrades, exterior styling, and more,
                coordinated around your schedule.
              </p>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
              Send an enquiry
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Tell us what your car needs.
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Submitting opens WhatsApp with your request
              already written so you can review and send it
              directly to us.
            </p>

            <form
              onSubmit={submitRequest}
              className="mt-7 grid gap-4 sm:grid-cols-2"
            >
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-zinc-300">
                  Your name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-zinc-300">
                  Phone number
                </span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="Your phone number"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-zinc-300">
                  Your vehicle
                </span>
                <input
                  required
                  value={form.vehicle}
                  onChange={(e) => update("vehicle", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. BMW 3 Series"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-zinc-300">
                  I am interested in
                </span>
                <select
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  className={`${inputClass} [color-scheme:dark]`}
                >
                  <option>Detailing</option>
                  <option>Paint Protection</option>
                  <option>Interior Mods</option>
                  <option>Exterior Mods</option>
                  <option>Custom Package</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-zinc-300">
                  Tell us more{" "}
                  <span className="text-zinc-500">
                    (optional)
                  </span>
                </span>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="What would you like us to help with?"
                />
              </label>

              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.99] sm:col-span-2"
              >
                Send enquiry on WhatsApp
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
