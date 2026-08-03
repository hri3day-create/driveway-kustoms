import Image from "next/image";
import Link from "next/link";

import { vehicles } from "../data/vehicles";

export default function VehicleCard() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mb-7 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-red-400/30 bg-red-500/10 text-[10px] font-bold text-red-300">
              01
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Vehicle profile
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            What do you drive?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Choose the closest body style. Your services and
            pricing will be tailored around it.
          </p>
        </div>

        <p className="hidden text-xs uppercase tracking-[0.18em] text-white/30 sm:block">
          Select one to continue
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
        {vehicles.map((vehicle, index) => (
          <Link
            key={vehicle.id}
            href={`/Build-package/${vehicle.slug}`}
            aria-label={`Select ${vehicle.name}`}
            className={`group relative isolate min-h-[13rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111113] shadow-[0_20px_55px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-red-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:min-h-[20rem] sm:rounded-[2rem] ${
              index < 3
                ? "lg:col-span-2"
                : "lg:col-span-3"
            } ${index === vehicles.length - 1 ? "col-span-2 lg:col-span-3" : ""}`}
          >
            <Image
              src={vehicle.image}
              alt={`${vehicle.name} in the Driveway Kustoms studio`}
              fill
              className="object-cover object-center transition duration-700 group-hover:scale-[1.045]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 50vw"
              priority={vehicle.id <= 2}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/75 to-transparent" />
            <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.06]" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-left sm:p-6">
              <div className="min-w-0">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-300 sm:text-[10px]">
                  Body style {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base font-semibold tracking-tight text-white sm:text-2xl">
                  {vehicle.name}
                </h3>
                <p className="mt-1 hidden truncate text-xs text-white/50 sm:block sm:text-sm">
                  {vehicle.description}
                </p>
              </div>

              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-base text-white backdrop-blur-md transition duration-300 group-hover:border-red-400/50 group-hover:bg-red-600 sm:h-11 sm:w-11 sm:text-lg">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs leading-5 text-white/45 sm:hidden">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
        Tap the body style closest to your car to continue.
      </div>
    </section>
  );
}
