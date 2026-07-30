import Link from "next/link";

import Navbar from "@/components/Navbar";

const values = [
  [
    "01",
    "We come to you",
    "Professional detailing at your home, workplace, or wherever your car is parked.",
  ],
  [
    "02",
    "One concierge, every detail",
    "From the first conversation to final handover, we coordinate the right solution for your car.",
  ],
  [
    "03",
    "Personalised, never generic",
    "We tailor detailing and modification recommendations to your vehicle, lifestyle, and budget.",
  ],
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <section className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
              About Driveway Kustoms
            </p>

            <h1 className="mt-3 max-w-4xl text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:mt-4 sm:text-6xl">
              At-home detailing and car mods, managed for you.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Driveway Kustoms is your personal car-care
              concierge, bringing premium detailing to your
              driveway and coordinating thoughtful upgrades
              for the vehicle you love.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
          <section className="grid gap-5 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                Our story
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
                Your time is valuable. Your car still
                deserves the best.
              </h2>

              <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                We created Driveway Kustoms to make
                exceptional car care easier. Our team brings
                premium detailing to you, while our concierge
                service helps plan and manage the interior,
                exterior, and protection upgrades that make
                your vehicle truly yours.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-red-500/30 bg-gradient-to-br from-red-500/15 to-transparent p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                Our promise
              </p>

              <p className="mt-4 text-xl font-medium leading-8 tracking-tight sm:text-2xl">
                A premium car-care experience without
                leaving your driveway.
              </p>

              <p className="mt-5 text-sm leading-7 text-zinc-300">
                We handle the details: clear recommendations,
                trusted workmanship, and a plan built around
                your vehicle and schedule.
              </p>
            </div>
          </section>

          <section className="mt-14 sm:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
              How we work
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
              The details define the experience.
            </h2>

            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {values.map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex gap-4 py-5 sm:gap-8 sm:py-8"
                >
                  <span className="text-sm font-semibold text-red-400">
                    {number}
                  </span>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-center sm:mt-20 sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Your driveway. Your car. Our concierge.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Tell us what your vehicle needs and we will
              build a tailored at-home detailing or
              modification plan.
            </p>

            <Link
              href="/Build-package"
              className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500 sm:inline-flex sm:w-auto"
            >
              Build Your Package
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
