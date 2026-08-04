import Navbar from "@/components/Navbar";

import VehicleCard from "./components/VehicleCard";

export default function BuildPackagePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
              Build Package
            </p>

            <h1 className="mt-3 text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Book your car care in minutes.
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Start with your vehicle, choose only what you need, and send a
              reservation request. No payment is taken online.
            </p>
          </div>

          <VehicleCard />
        </div>
      </main>
    </>
  );
}
