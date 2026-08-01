import Link from "next/link";

import ServicePhoto from "./ServicePhoto";

const services = [
  {
    title: "Detailing",
    description:
      "Interior, exterior, paint and finish care built around premium doorstep detailing.",
  },
  {
    title: "Interior Mods",
    description:
      "Ambient lighting, screens, upholstery, audio, and OEM-style cabin upgrades.",
  },
  {
    title: "Exterior Mods",
    description:
      "Body kits, spoilers, lighting, grilles, and tasteful styling upgrades that transform presence.",
  },
  {
    title: "Protection",
    description:
      "Ceramic coating, PPF, and long-term gloss and paint protection for daily-driven cars.",
  },
];

export default function Services() {
  return (
    <section className="px-4 py-14 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
            Services
          </p>

          <h2 className="mt-3 max-w-[15ch] text-[2rem] font-semibold tracking-[-0.03em] text-white sm:max-w-none sm:text-5xl">
            Every service line, shaped for premium mobile care.
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 xl:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.title}
              href={`/services#${service.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="group relative min-w-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/[0.06] sm:rounded-[1.75rem] sm:p-6"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent opacity-70" />

              <ServicePhoto
                name={service.title}
                className="mb-3 h-10 w-10 rounded-xl sm:mb-5 sm:h-16 sm:w-16 sm:rounded-[1.15rem]"
                sizes="(max-width: 640px) 40px, 64px"
              />

              <h3 className="text-sm font-semibold leading-5 text-white sm:text-2xl sm:leading-normal">
                {service.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-[11px] leading-[1.05rem] text-zinc-400 sm:mt-4 sm:text-sm sm:leading-7">
                {service.description}
              </p>

              <span className="mt-3 inline-flex text-[11px] font-semibold text-red-400 transition group-hover:text-red-300 sm:mt-5 sm:text-sm">
                Explore services
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
