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
      "Wraps, spoilers, lighting, alloys, and tasteful styling upgrades that transform presence.",
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

        <div className="mt-8 grid gap-3.5 md:grid-cols-2 xl:grid-cols-4 sm:mt-10 sm:gap-4">
          {services.map((service) => (
            <Link
              key={service.title}
              href={`/services#${service.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/[0.06] sm:rounded-[1.75rem] sm:p-6"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent opacity-70" />

              <ServicePhoto
                name={service.title}
                className="mb-5 h-16 w-16 rounded-[1.15rem]"
                sizes="64px"
              />

              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                {service.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:mt-4">
                {service.description}
              </p>

              <span className="mt-5 inline-flex text-sm font-semibold text-red-400 transition group-hover:text-red-300">
                Explore services
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
