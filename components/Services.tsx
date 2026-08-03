import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "Detailing",
    eyebrow: "Restore & refine",
    description: "Deep interior care, exterior finishing, paint correction, and more.",
    image: "/images/service-thumbnails/deep-interior-detailing-brush-v2.webp",
    anchor: "detailing",
  },
  {
    title: "Interior Mods",
    eyebrow: "Luxury inside",
    description: "Ambient lighting, upholstery, audio, screens, and smart cabin tech.",
    image: "/images/service-thumbnails/interior-mods-mercedes-ambient.webp",
    anchor: "interior-mods",
  },
  {
    title: "Exterior Mods",
    eyebrow: "Sharper presence",
    description: "Body kits, spoilers, lighting, grilles, and street-ready styling.",
    image: "/images/service-thumbnails/exterior-mods-bmw-jdm.webp",
    anchor: "exterior-mods",
  },
  {
    title: "Protection",
    eyebrow: "Preserve the finish",
    description: "PPF, ceramic coatings, and focused protection for every surface.",
    image: "/images/service-thumbnails/ceramic-coating-bottle-v3.webp",
    anchor: "protection",
  },
];

export default function Services() {
  return (
    <section className="relative px-4 py-16 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
              Explore the studio
            </p>
            <h2 className="mt-3 max-w-[15ch] text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl">
              Everything your car deserves.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
            Choose one service or combine them into a package designed around
            your vehicle, budget, and vision.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-4 lg:grid-cols-4">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={`/services#${service.anchor}`}
              className={`group relative isolate min-h-[15rem] overflow-hidden rounded-[1.35rem] border border-white/10 bg-zinc-900 shadow-[0_22px_60px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1.5 hover:border-red-500/50 sm:min-h-[28rem] sm:rounded-[2rem] ${index === 0 || index === 3 ? "lg:translate-y-6" : ""}`}
            >
              <Image
                src={service.image}
                alt={`${service.title} at Driveway Kustoms`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black via-black/20 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-6">
                <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-red-300 sm:text-[10px] sm:tracking-[0.24em]">
                  {service.eyebrow}
                </p>
                <div className="mt-1.5 flex items-start justify-between gap-2 sm:mt-2">
                  <h3 className="text-[15px] font-semibold leading-5 text-white sm:text-2xl">
                    {service.title}
                  </h3>
                  <span className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-black/30 transition group-hover:bg-red-600 sm:grid">
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-zinc-300 sm:mt-3 sm:text-sm sm:leading-6">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
