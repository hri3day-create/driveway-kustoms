import Link from "next/link";

import Navbar from "@/components/Navbar";
import ServicePhoto from "@/components/ServicePhoto";
import { interiorMods } from "../Build-package/[vehicle]/data/interiorMods";
import { exteriorMods } from "../Build-package/[vehicle]/data/exteriorMods";

const groups = [
  {
    title: "Interior Mods",
    eyebrow: "Comfort / technology / craftsmanship",
    description:
      "Elevate every journey with considered cabin upgrades and OEM-style integrations.",
    services: interiorMods,
  },
  {
    title: "Exterior Mods",
    eyebrow: "Style / presence / performance",
    description:
      "Make a stronger first impression with tailored styling and premium exterior upgrades.",
    services: exteriorMods,
  },
];

function formatStartingPrice(price: string) {
  return price
    .replace("₹", "Rs ")
    .replace("â‚¹", "Rs ")
    .replace("Ã¢â€šÂ¹", "Rs ");
}

export default function CarModsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <section className="border-b border-white/10 px-5 py-14 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
              Driveway Kustoms
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:mt-4 sm:text-6xl">
              Car modifications, tailored to you.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-5 sm:text-lg sm:leading-7">
              Explore our interior and exterior upgrades.
              We will help you select the right fit for your
              vehicle, style, and budget.
            </p>

            <div className="-mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
              {groups.map((group) => (
                <a
                  key={group.title}
                  href={`#${group.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="shrink-0 rounded-full border border-white/15 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-red-500 hover:text-white"
                >
                  {group.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-5 py-12 sm:space-y-24 sm:px-6 sm:py-20">
          {groups.map((group) => (
            <section
              key={group.title}
              id={group.title
                .toLowerCase()
                .replace(/\s+/g, "-")}
              className="scroll-mt-28"
            >
              <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                    {group.eyebrow}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
                    {group.title}
                  </h2>
                </div>

                <p className="max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {group.services.map((service) => (
                  <article
                    key={`${group.title}-${service.id}`}
                    className="group flex min-h-52 flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/70 hover:bg-white/[0.06] sm:min-h-56 sm:rounded-3xl sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <ServicePhoto
                          name={service.name}
                          category={service.category}
                          className="h-14 w-14 rounded-2xl"
                          sizes="56px"
                        />

                        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                          {service.category}
                        </span>
                      </div>

                      {service.popular && (
                        <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {service.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {service.description}
                    </p>

                    <div className="mt-auto pt-5">
                      {service.startingPrice ? (
                        <p className="text-sm font-semibold text-white">
                          Starting from{" "}
                          {formatStartingPrice(service.startingPrice)}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-red-400">
                          Request a quote
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-transparent p-6 text-center sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to build your custom package?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Select your vehicle and send us your preferred
              upgrades for a tailored consultation.
            </p>

            <Link
              href="/Build-package"
              className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500 sm:inline-flex sm:w-auto"
            >
              Build Your Package
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
