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
  const [showAll, setShowAll] = useState(false);

  const filteredServices = [...services]
    .sort((first, second) => Number(second.popular) - Number(first.popular))
    .filter((service) => {
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
  const visibleServices =
    search.trim() || showAll
      ? filteredServices
      : filteredServices.slice(0, 6);

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
        <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {visibleServices.map((service, index) => {
          const active = selected.some(
            (item) => item.name === service.name
          );

          return (
            <div
              key={service.id}
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
              className={`service-card-enter group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border p-3 transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out sm:rounded-[1.85rem] sm:p-4 sm:hover:-translate-y-1 ${
                active
                  ? "border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.15)]"
                  : "border-white/10 bg-white/[0.035] hover:border-white/20"
              }`}
            >
              <ServicePhoto
                name={service.name}
                category={service.category}
                variant="card"
                className="!aspect-[16/10] rounded-[1.05rem] sm:rounded-[1.4rem]"
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 44vw, 300px"
              />

              <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
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

              <h3 className="mt-2.5 line-clamp-2 break-words text-lg font-semibold leading-6 text-white sm:text-xl">
                {service.name}
              </h3>

              <p className="mt-1 line-clamp-1 text-xs leading-5 text-zinc-400 sm:text-sm">
                {service.description}
              </p>

              {service.note && (
                <div className="mt-2 hidden rounded-lg border border-white/10 bg-black/25 p-2 sm:block">
                  <p className="line-clamp-1 text-xs leading-5 text-zinc-500">
                    {service.note}
                  </p>
                </div>
              )}

              <div className="mt-auto flex min-w-0 items-end justify-between gap-4 pt-3">
                <div className="min-w-0">
                  {showPrices && service.price && (
                    <>
                      <p className="truncate text-2xl font-bold text-white sm:text-3xl">
                        Rs {service.price.toLocaleString("en-IN")}
                      </p>
                    </>
                  )}

                  {showStartingPrice &&
                    service.startingPrice && (
                      <>
                        <p className="truncate text-base font-semibold text-red-400 sm:text-lg">
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
                  className={`flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-95 ${
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

      {!search.trim() && filteredServices.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:border-red-500/40 hover:bg-white/[0.06]"
        >
          {showAll
            ? "Show popular services only"
            : `Browse all ${filteredServices.length} services`}
        </button>
      )}
    </section>
  );
}
