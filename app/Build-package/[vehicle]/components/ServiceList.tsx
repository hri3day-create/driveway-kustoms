"use client";

import { useState } from "react";
import { Check, Plus, Search, Star } from "lucide-react";

import ServicePhoto from "@/components/ServicePhoto";
import { Service } from "../types";

interface Props {
  title: string;
  description: string;
  services: Service[];
  selected: Service[];
  toggleService: (service: Service) => void;
  showPrices?: boolean;
  showStartingPrice?: boolean;
}

export default function ServiceList({
  title,
  description,
  services,
  selected,
  toggleService,
  showPrices = false,
  showStartingPrice = false,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [
      service.name,
      service.description,
      service.category,
      service.note ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
        {description}
      </p>

      <div className="relative mt-6 sm:mt-8">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search additional services"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:bg-white/[0.05]"
        />
      </div>

      {filteredServices.length === 0 ? (
        <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 text-center sm:mt-8">
          <p className="text-sm font-medium text-white">
            No services found
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Try searching with a different keyword.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 items-stretch gap-2.5 sm:mt-8 sm:gap-5 xl:grid-cols-3">
          {filteredServices.map((service) => {
          const active = selected.some(
            (item) => item.name === service.name
          );

          return (
            <div
              key={service.id}
              className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border p-2.5 transition-[border-color,background-color,box-shadow,transform] duration-300 sm:rounded-[1.85rem] sm:p-5 sm:hover:-translate-y-1 ${
                active
                  ? "border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.15)]"
                  : "border-white/10 bg-white/[0.035] hover:border-white/20"
              }`}
            >
              <ServicePhoto
                name={service.name}
                category={service.category}
                variant="compact-card"
                className="rounded-xl sm:rounded-2xl"
                sizes="(max-width: 640px) 43vw, (max-width: 1280px) 42vw, 260px"
              />

              <div className="mt-2.5 flex min-w-0 items-center justify-between gap-1.5 sm:mt-4 sm:gap-3">
                <span className="min-w-0 truncate rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[9px] uppercase tracking-wide text-zinc-300 sm:px-3 sm:text-[11px] sm:tracking-wider">
                  {service.category}
                </span>

                {service.popular && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-500 p-1.5 text-[9px] font-semibold text-white sm:px-3 sm:py-1 sm:text-xs">
                    <Star size={11} fill="white" />
                    <span className="hidden sm:inline">Popular</span>
                  </span>
                )}
              </div>

              <h3 className="mt-3 line-clamp-2 min-h-10 break-words text-sm font-semibold leading-5 text-white sm:mt-5 sm:min-h-0 sm:text-xl sm:leading-normal">
                {service.name}
              </h3>

              <p className="mt-1.5 line-clamp-3 text-[11px] leading-[1.05rem] text-zinc-400 sm:mt-3 sm:text-sm sm:leading-7">
                {service.description}
              </p>

              {service.note && (
                <div className="mt-2.5 rounded-lg border border-white/10 bg-black/25 p-2 sm:mt-4 sm:rounded-xl sm:p-3">
                  <p className="line-clamp-2 text-[10px] leading-4 text-zinc-500 sm:text-xs sm:leading-6">
                    {service.note}
                  </p>
                </div>
              )}

              <div className="mt-auto flex min-w-0 flex-col gap-2 pt-3 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-0">
                <div className="min-w-0">
                  {showPrices && service.price && (
                    <>
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                        Price
                      </p>

                      <p className="mt-1 truncate text-base font-bold text-white sm:text-3xl">
                        Rs {service.price.toLocaleString("en-IN")}
                      </p>
                    </>
                  )}

                  {showStartingPrice &&
                    service.startingPrice && (
                      <>
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                          Starting from
                        </p>

                        <p className="mt-1 truncate text-xs font-semibold text-red-400 sm:text-lg">
                          {service.startingPrice
                            .replace("₹", "Rs ")
                            .replace("â‚¹", "Rs ")
                            .replace("Ã¢â€šÂ¹", "Rs ")}
                        </p>
                      </>
                    )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition-all sm:min-h-11 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm ${
                    active
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {active ? (
                    <>
                      <Check size={14} />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </section>
  );
}
