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
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:mt-8 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => {
          const active = selected.some(
            (item) => item.name === service.name
          );

          return (
            <div
              key={service.id}
              className={`group rounded-[1.6rem] border p-4 transition-all duration-300 hover:-translate-y-1 sm:rounded-[1.85rem] sm:p-5 ${
                active
                  ? "border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.15)]"
                  : "border-white/10 bg-white/[0.035] hover:border-white/20"
              }`}
            >
              <ServicePhoto
                name={service.name}
                category={service.category}
                variant="card"
                sizes="(max-width: 768px) calc(100vw - 72px), (max-width: 1280px) 42vw, 260px"
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-wider text-zinc-300">
                  {service.category}
                </span>

                {service.popular && (
                  <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                    <Star size={12} fill="white" />
                    Popular
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {service.name}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {service.description}
              </p>

              {service.note && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
                  <p className="text-xs leading-6 text-zinc-500">
                    {service.note}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {showPrices && service.price && (
                    <>
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                        Price
                      </p>

                      <p className="mt-1 text-3xl font-bold text-white">
                        Rs {service.price}
                      </p>
                    </>
                  )}

                  {showStartingPrice &&
                    service.startingPrice && (
                      <>
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                          Starting from
                        </p>

                        <p className="mt-1 text-lg font-semibold text-red-400">
                          {service.startingPrice
                            .replace("₹", "Rs ")
                            .replace("â‚¹", "Rs ")
                            .replace("Ã¢â€šÂ¹", "Rs ")}
                        </p>
                      </>
                    )}
                </div>

                <button
                  onClick={() => toggleService(service)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {active ? (
                    <>
                      <Check size={16} />
                      Selected
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Select
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
