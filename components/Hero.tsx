import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";

const highlights = [
  "Doorstep service",
  "Transparent pricing",
  "Detailing + modifications",
];

export default function Hero() {
  return (
    <section className="relative isolate min-h-[48rem] overflow-hidden px-4 pb-14 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-36 lg:flex lg:min-h-[52rem] lg:items-center lg:pb-24 lg:pt-40">
      <div className="absolute inset-0 -z-20 bg-[#050505]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-red-600/15 blur-[120px]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-30" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8 xl:gap-16">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-200 backdrop-blur-xl sm:px-4 sm:text-[11px] sm:tracking-[0.25em]">
            <MapPin size={13} aria-hidden="true" />
            Premium car care at your doorstep
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500 sm:mt-9">
            Driveway Kustoms
          </p>

          <h1 className="mt-3 max-w-[11ch] text-[3.35rem] font-semibold leading-[0.91] tracking-[-0.065em] text-white sm:text-7xl lg:text-[5.25rem] xl:text-[6.2rem]">
            Your car.
            <span className="block bg-gradient-to-r from-red-500 via-red-300 to-white bg-clip-text text-transparent">
              Your vision.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Build a personalised package for detailing, cabin upgrades,
            exterior styling, and paint protection—then let our team bring
            the experience to you.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            {highlights.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 sm:text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-red-500/15 text-red-400">
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/Build-package"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-4 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(220,38,38,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-500"
            >
              Book in 2 minutes
              <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <Link
              href="/services"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/15 bg-white/[0.045] px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:border-white/30 hover:bg-white/[0.08]"
            >
              Explore All Services
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] font-medium tracking-wide text-zinc-500 sm:text-left">
            A reservation, not a transaction. No online payment required.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="absolute -inset-8 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative ml-auto aspect-[0.96] w-[92%] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_35px_100px_rgba(0,0,0,0.65)] sm:aspect-[1.12] sm:rounded-[2.7rem] lg:w-[93%]">
            <Image
              src="/images/service-thumbnails/exterior-mods-bmw-jdm.webp"
              alt="Premium modified BMW by Driveway Kustoms"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 52vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/15" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300 sm:text-xs">
                Exterior transformations
              </p>
              <p className="mt-2 max-w-sm text-xl font-semibold tracking-tight sm:text-3xl">
                Tasteful upgrades. Unmistakable presence.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-6 left-0 w-[52%] overflow-hidden rounded-[1.35rem] border border-white/15 bg-black/80 p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:-bottom-8 sm:w-[46%] sm:rounded-[1.8rem] sm:p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] sm:rounded-[1.35rem]">
              <Image
                src="/images/service-thumbnails/interior-mods-mercedes-ambient.webp"
                alt="Luxury ambient-lit interior upgrade"
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white sm:bottom-4 sm:left-4 sm:text-xs">
                Cabin crafted around you
              </span>
            </div>
          </div>

          <div className="absolute right-3 top-4 rounded-2xl border border-white/15 bg-black/55 px-3.5 py-3 backdrop-blur-xl sm:right-5 sm:top-6 sm:px-5 sm:py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-[10px]">
              Starting from
            </p>
            <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">₹699</p>
          </div>
        </div>
      </div>
    </section>
  );
}
