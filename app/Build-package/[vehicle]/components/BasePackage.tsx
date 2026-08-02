import { CheckCircle2 } from "lucide-react";

import ServicePhoto from "@/components/ServicePhoto";

export default function BasePackage() {
  return (
    <section className="mb-6 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5 sm:rounded-[1.9rem] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <ServicePhoto
            name="Premium Detailing"
            category="Detailing"
            variant="compact-thumbnail"
            className="rounded-xl sm:rounded-[1.15rem]"
            sizes="(max-width: 640px) 40px, 56px"
          />

          <div>
            <span className="rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-400">
              Base Package
            </span>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Essential Detail
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Included before every detailing service.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
            Starts From
          </p>

          <h3 className="mt-1 text-2xl font-bold text-red-400">
            Rs 699
          </h3>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          "Snow Foam",
          "Vacuum",
          "Dashboard",
          "Tyre Shine",
          "Fragrance",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5"
          >
            <CheckCircle2
              size={14}
              className="text-red-400"
            />
            <span className="text-xs text-zinc-300">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
