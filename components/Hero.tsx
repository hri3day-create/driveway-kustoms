import Image from "next/image";
import Link from "next/link";

const highlights = [
  "Doorstep detailing",
  "Custom mods concierge",
  "Same-day booking support",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-26 text-white sm:px-6 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
      <div className="absolute inset-x-0 top-12 h-56 bg-[radial-gradient(circle_at_center,rgba(255,48,48,0.24),transparent_65%)] blur-3xl sm:top-16 sm:h-72" />

      <div className="relative mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl sm:px-4 sm:text-[11px] sm:tracking-[0.28em]">
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(255,40,40,0.8)]" />
          Premium doorstep detailing and mods
        </div>

        <div className="mt-5 flex justify-center lg:justify-start">
          <Image
            src="/driveway-kustoms-logo-cutout.png"
            alt="Driveway Kustoms logo"
            width={1800}
            height={900}
            priority
            className="h-auto w-full max-w-[18rem] object-contain drop-shadow-[0_0_30px_rgba(255,0,0,0.28)] sm:max-w-[24rem] lg:max-w-[34rem]"
          />
        </div>

        <div className="mt-7 max-w-3xl">
          <p className="max-w-[22rem] text-[15px] leading-7 text-zinc-300 sm:max-w-2xl sm:text-lg sm:leading-8">
            Luxury car care and tasteful vehicle upgrades,
            delivered where your car already lives. Built
            for owners who want premium execution without
            wasting a day at the garage.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] text-zinc-200 backdrop-blur-md sm:px-4 sm:text-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <Link
              href="/Build-package"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(220,38,38,0.32)] transition hover:-translate-y-0.5 hover:bg-red-500 sm:min-h-13 sm:px-7 sm:py-4"
            >
              Build Your Package
            </Link>

            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.07] sm:min-h-13 sm:px-7 sm:py-4"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
