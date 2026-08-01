import { Check } from "lucide-react";

import ServicePhoto from "@/components/ServicePhoto";

type Category =
  | "detailing"
  | "interior"
  | "exterior"
  | "protection";

interface Props {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories = [
  {
    id: "detailing",
    title: "Detailing",
    subtitle: "Cleaning and restoration",
  },
  {
    id: "interior",
    title: "Interior Mods",
    subtitle: "Seats, audio, ambient",
  },
  {
    id: "exterior",
    title: "Exterior Mods",
    subtitle: "Body kits, lighting and styling",
  },
  {
    id: "protection",
    title: "Protection",
    subtitle: "PPF, ceramic, graphene",
  },
] as const;

export default function CategorySelector({
  selected,
  onSelect,
}: Props) {
  return (
    <section className="mb-8 sm:mb-10">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Choose a category
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400 sm:text-base">
          Select what you would like to upgrade on your
          vehicle.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {categories.map((category) => {
          const active = selected === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              aria-pressed={active}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border p-2.5 text-left transition-all duration-300 sm:rounded-[1.6rem] sm:p-4 ${
                active
                  ? "border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.18)]"
                  : "border-white/10 bg-white/[0.035] hover:-translate-y-1 hover:border-white/20"
              }`}
            >
              {active && (
                <div className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/80 bg-red-500 text-white shadow-lg sm:h-8 sm:w-8">
                  <Check size={15} strokeWidth={3} />
                </div>
              )}

              <ServicePhoto
                name={category.title}
                category={category.title}
                variant="card"
                className={`mb-3 rounded-xl transition-all sm:mb-4 sm:rounded-2xl ${
                  active ? "border-red-500/60" : "group-hover:border-red-500/40"
                }`}
                sizes="(max-width: 640px) 43vw, (max-width: 1024px) 42vw, 280px"
              />

              <h3 className="text-sm font-semibold leading-5 text-white sm:text-lg sm:leading-normal">
                {category.title}
              </h3>

              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-zinc-400 sm:mt-2 sm:text-sm sm:leading-relaxed">
                {category.subtitle}
              </p>

              <span
                className={`mt-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide sm:mt-4 sm:px-3 sm:text-[10px] ${
                  active
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-zinc-400"
                }`}
              >
                {active ? "Selected" : "View options"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
