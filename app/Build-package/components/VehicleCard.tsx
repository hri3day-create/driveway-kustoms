import Link from "next/link";

import ServicePhoto from "@/components/ServicePhoto";
import { vehicles } from "../data/vehicles";

export default function VehicleCard() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mb-7 flex flex-col gap-3 sm:mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          Select your vehicle
        </h2>

        <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
          Start with the kind of vehicle you own so the
          experience feels more tailored from the very first
          step.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            href={`/Build-package/${vehicle.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="group rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-red-600 hover:bg-white/[0.06] sm:rounded-[1.75rem] sm:p-6"
          >
            <ServicePhoto
              name={vehicle.name}
              className="mb-4 h-24 w-full rounded-[1.15rem] sm:h-28"
              sizes="(max-width: 640px) 50vw, 180px"
              priority={vehicle.id <= 2}
            />

            <h3 className="text-base font-semibold text-white sm:text-xl">
              {vehicle.name}
            </h3>

            <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
              Select vehicle
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
