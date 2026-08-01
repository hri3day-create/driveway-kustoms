import Link from "next/link";

import ServicePhoto from "./ServicePhoto";

const mods = [
  {
    title: "Interior Upgrades",
    detail:
      "Ambient lighting, audio, upholstery, cabin tech, and comfort-focused upgrades.",
  },
  {
    title: "Exterior Styling",
    detail:
      "Body kits, spoilers, custom lighting, grilles, and sharper visual character for the whole car.",
  },
  {
    title: "Protection Packages",
    detail:
      "PPF, ceramic, gloss retention, and practical paint protection for long-term ownership.",
  },
];

export default function CarModsPreview() {
  return (
    <section className="px-4 pb-14 text-white sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:rounded-[2rem]">
        <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:p-12">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
                Car modifications
              </p>

              <h2 className="mt-4 max-w-[14ch] text-[2rem] font-semibold tracking-[-0.03em] text-white sm:max-w-none sm:text-5xl">
                Upgrades that feel factory-clean, not overdone.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                We kept this section more refined and more
                mobile-friendly, with a layout that feels
                premium before someone even taps into your
                full car mods page.
              </p>
            </div>

            <Link
              href="/Car-Mods"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 px-6 text-sm font-semibold text-white transition hover:bg-red-500 sm:mt-10 sm:w-fit"
            >
              Explore Car Mods
            </Link>
          </div>

          <div className="grid gap-3.5 sm:gap-4">
            {mods.map((mod) => (
              <div
                key={mod.title}
                className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4 transition hover:border-red-500/40 hover:bg-black/35 sm:rounded-[1.5rem] sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <ServicePhoto
                    name={mod.title}
                    category={mod.title}
                    className="h-16 w-16 rounded-[1.15rem]"
                    sizes="64px"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {mod.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                      {mod.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
