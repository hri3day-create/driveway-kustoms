import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const mods = [
  "Ambient & starlight lighting",
  "Audio & infotainment upgrades",
  "Body kits & exterior styling",
  "PPF & ceramic protection",
];

export default function CarModsPreview() {
  return (
    <section className="px-4 py-16 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0b] shadow-[0_35px_100px_rgba(0,0,0,0.42)] sm:rounded-[2.75rem]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.16),transparent_40%)]" />

          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative min-h-[22rem] overflow-hidden sm:min-h-[34rem] lg:order-2">
              <Image
                src="/images/service-thumbnails/interior-mods-mercedes-ambient.webp"
                alt="Premium Mercedes-style ambient interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0b0b0b] lg:via-transparent lg:to-transparent" />
              <div className="absolute bottom-5 right-5 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 backdrop-blur-xl sm:bottom-8 sm:right-8">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Your cabin</p>
                <p className="mt-1 text-sm font-semibold text-white sm:text-base">Reimagined.</p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-10 lg:order-1 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
                Customisation concierge
              </p>
              <h2 className="mt-3 max-w-[12ch] text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
                Make your car feel like yours.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                From a refined cabin to a sharper road presence, we help plan
                compatible upgrades and coordinate a clean installation.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {mods.map((mod) => (
                  <div key={mod} className="flex items-center gap-3 text-xs text-zinc-300 sm:text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-400">
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {mod}
                  </div>
                ))}
              </div>

              <Link
                href="/Car-Mods"
                className="group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-fit"
              >
                Explore Car Mods
                <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
