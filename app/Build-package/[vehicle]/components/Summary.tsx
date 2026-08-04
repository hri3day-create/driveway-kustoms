"use client";

import { useEffect, useState } from "react";
import {
  CarFront,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react";

import ServicePhoto from "@/components/ServicePhoto";
import { Service } from "../types";

interface Props {
  vehicle: string;
  selected: Service[];
  total: number;
  toggleService: (service: Service) => void;
  onContinue: () => void;
  showBasePackage: boolean;
}

function formatServicePrice(service: Service) {
  if (typeof service.price === "number") {
    return `Rs ${service.price.toLocaleString("en-IN")}`;
  }

  if (service.startingPrice) {
    return `Starting from ${service.startingPrice}`;
  }

  return "Request a quote";
}

export default function Summary({
  vehicle,
  selected,
  total,
  toggleService,
  onContinue,
  showBasePackage,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedSummary = selected.length
    ? selected.map((service) => service.name).join(" / ")
    : "No services selected";
  const canContinue = showBasePackage || selected.length > 0;

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <aside className="hidden min-w-0 overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.035] lg:block">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-semibold text-white">
            Booking Summary
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Review your package
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
            <CarFront
              size={18}
              className="text-red-400"
            />

            <div>
              <p className="text-xs text-zinc-500">
                Vehicle
              </p>

              <p className="font-medium capitalize text-white">
                {vehicle}
              </p>
            </div>
          </div>

          {showBasePackage && (
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={18}
                  className="text-red-400"
                />

                <div>
                  <p className="font-medium text-white">
                    Essential Detail
                  </p>

                  <p className="text-xs text-zinc-500">
                    Base Package
                  </p>
                </div>
              </div>

              <span className="font-semibold text-white">
                Rs 699
              </span>
            </div>
          )}

          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-red-500"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-white">
                  Services Selected ({selected.length})
                </p>

                <p className="mt-1 truncate text-xs text-zinc-500">
                  {selectedSummary}
                </p>
              </div>

              <ChevronRight
                className="shrink-0 text-zinc-500"
                size={18}
              />
            </div>
          </button>

          <div className="rounded-2xl bg-red-500/10 p-5">
            <p className="text-sm text-zinc-400">
              Grand Total
            </p>

            <h2 className="mt-1 break-words text-4xl font-bold text-white">
              Rs {total.toLocaleString("en-IN")}
            </h2>
          </div>

          <button
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full rounded-2xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            {canContinue ? "Continue Booking" : "Select a service first"}
          </button>

          <p className="text-center text-xs text-zinc-500">
            No advance payment required
          </p>
        </div>
      </aside>

      <div className="h-20 lg:hidden" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0b0b0b]/95 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition active:bg-white/[0.08]"
          >
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {selected.length} service{selected.length === 1 ? "" : "s"} · tap to review
            </p>
            <p className="mt-0.5 truncate text-lg font-bold text-white">
              Rs {total.toLocaleString("en-IN")}
            </p>
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="inline-flex min-h-[3.3rem] shrink-0 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(220,38,38,0.28)] transition active:scale-[0.98] active:bg-red-700 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:shadow-none"
          >
            {canContinue ? "Book now" : "Select first"}
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-t-[1.8rem] border border-white/10 bg-[#111111] shadow-2xl sm:rounded-[1.8rem]"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Selected Services
                </h2>

                <p className="text-sm text-zinc-500">
                  {selected.length} selected
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 transition hover:bg-white/5"
              >
                <X
                  size={18}
                  className="text-white"
                />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-3 overflow-y-auto p-5 sm:max-h-[420px]">
              {selected.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-zinc-500">
                    No services selected.
                  </p>
                </div>
              ) : (
                selected.map((service) => (
                  <div
                    key={`${service.category}-${service.name}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-red-500"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ServicePhoto
                        name={service.name}
                        category={service.category}
                        variant="compact-thumbnail"
                        className="rounded-lg sm:rounded-xl"
                        sizes="(max-width: 640px) 40px, 56px"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {service.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {formatServicePrice(service)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleService(service)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-white/10 bg-[#111111] p-5">
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-white/10 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
