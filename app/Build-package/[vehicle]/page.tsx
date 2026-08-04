import Navbar from "@/components/Navbar";

import VehicleConfigurator from "./VehicleConfigurator";
import { vehicles } from "../data/vehicles";

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ vehicle: vehicle.slug }));
}

export const dynamicParams = false;

interface VehiclePageProps {
  params: Promise<{
    vehicle: string;
  }>;
}

export default async function VehiclePage({
  params,
}: VehiclePageProps) {
  const { vehicle } = await params;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
              Vehicle configurator
            </p>

            <h1 className="mt-3 text-[2.35rem] font-semibold capitalize leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              {vehicle.replace(/-/g, " ")}
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Start with our most popular options, add what feels right, then
              reserve your preferred slot. No payment is required to book.
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <VehicleConfigurator vehicle={vehicle} />
          </div>
        </div>
      </main>
    </>
  );
}
