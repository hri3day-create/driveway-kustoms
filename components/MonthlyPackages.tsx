import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Essential Care",
    tagline: "Clean car, twice a month",
    price: "₹1,499",
    visits: "2 doorstep visits",
    image: "/images/service-thumbnails/dk-ncr-exterior-detailing-v1.webp",
    features: [
      "2 maintenance exterior washes",
      "Dyson interior vacuum each visit",
      "Tyre and alloy finishing",
      "Exterior glass cleaning",
    ],
  },
  {
    name: "Signature Care",
    tagline: "Our most practical monthly plan",
    price: "₹2,999",
    visits: "4 doorstep visits",
    image: "/images/service-thumbnails/deep-interior-cleaning-dyson-v2.webp",
    popular: true,
    features: [
      "4 maintenance exterior washes",
      "2 Dyson interior vacuum sessions",
      "Dashboard and trim refresh",
      "Monthly spray-wax finish",
      "Priority booking slots",
    ],
  },
  {
    name: "Elite Care",
    tagline: "Weekly care with deeper protection",
    price: "₹4,999",
    visits: "4 premium visits",
    image: "/images/service-thumbnails/dk-ncr-paint-correction-v1.webp",
    features: [
      "4 premium maintenance washes",
      "Dyson interior vacuum every visit",
      "Monthly machine-wax treatment",
      "Cabin sanitisation",
      "Leather and trim conditioning",
      "Priority rescheduling",
    ],
  },
];

function whatsappLink(plan: string) {
  const message = `Hi Driveway Kustoms, I am interested in the ${plan} monthly car care package. Please share availability and the final price for my vehicle.`;
  return `https://wa.me/918796562667?text=${encodeURIComponent(message)}`;
}

export default function MonthlyPackages({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;

  return (
    <section className="relative px-4 py-16 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
              Monthly car care
            </p>
            <Heading className="mt-3 max-w-[16ch] text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
              Your car, always ready.
            </Heading>
          </div>
          <p className="max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
            Scheduled doorstep care for one registered vehicle, delivered by trained professionals at your home.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`group relative overflow-hidden rounded-[1.75rem] border bg-[#0c0c0c] shadow-[0_25px_70px_rgba(0,0,0,0.3)] ${
                plan.popular ? "border-red-500/60" : "border-white/10"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={plan.image}
                  alt={`${plan.name} monthly car care`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/10" />
                {plan.popular && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg">
                    <Sparkles size={12} aria-hidden="true" /> Most popular
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                  {plan.visits}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{plan.tagline}</p>

                <div className="mt-5 flex items-end gap-2 border-y border-white/10 py-5">
                  <span className="text-4xl font-semibold tracking-[-0.05em]">{plan.price}</span>
                  <span className="pb-1 text-xs text-zinc-500">/ month*</span>
                </div>

                <ul className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-5 text-zinc-300">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-400">
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={whatsappLink(plan.name)}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    plan.popular
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "border border-white/15 bg-white/[0.04] text-white hover:border-red-500/60 hover:bg-red-500/10"
                  }`}
                >
                  Choose {plan.name}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-5 text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>*Starting prices shown for hatchbacks. Final pricing depends on vehicle size and condition.</p>
          <Link href="/Build-package" className="inline-flex items-center gap-1 font-semibold text-zinc-300 transition hover:text-red-400">
            Need a custom combination? Build a package <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
