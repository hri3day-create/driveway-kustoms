import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

import QuickBookingForm from "./QuickBookingForm";

export const metadata: Metadata = {
  title: "Quick Booking | Driveway Kustoms",
  description: "Request a Driveway Kustoms booking in under a minute. No online payment required.",
};

export default function QuickBookingPage() {
  return (
    <main className="min-h-[100dvh] bg-[#080808] px-4 pb-10 pt-5 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white">
          <ArrowLeft size={17} /> Back
        </Link>

        <div className="mb-7 mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">Book a callback</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Tell us about your car.</h1>
          <p className="mt-3 flex items-center gap-2 text-sm leading-6 text-zinc-400">
            <Clock3 size={16} className="text-red-400" /> Five details. Less than one minute.
          </p>
        </div>

        <QuickBookingForm />

        <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
          Know exactly what you want? <Link href="/Build-package" className="font-semibold text-zinc-300 underline underline-offset-4">Build a detailed package</Link>
        </p>
      </div>
    </main>
  );
}
