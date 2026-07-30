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
    subtitle: "Body kits and wraps",
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

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
        {categories.map((category) => {
          const active = selected === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={`group relative min-h-[164px] min-w-[15.5rem] shrink-0 rounded-[1.6rem] border p-5 text-left transition-all duration-300 sm:min-w-0 sm:p-6 ${
                active
                  ? "border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                  : "border-white/10 bg-white/[0.035] hover:-translate-y-1 hover:border-white/20"
              }`}
            >
              {active && (
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
                  <Check size={16} />
                </div>
              )}

              <ServicePhoto
                name={category.title}
                category={category.title}
                className={`mb-5 h-20 w-full rounded-[1.2rem] transition-all ${
                  active ? "border-red-500/60" : "group-hover:border-red-500/40"
                }`}
                sizes="(max-width: 640px) 250px, 25vw"
              />

              <h3 className="text-lg font-semibold text-white">
                {category.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {category.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
