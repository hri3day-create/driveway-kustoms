import { CarFront, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "We come to you",
    text: "Premium detailing and consultation at your home, office, or parking spot.",
  },
  {
    icon: CarFront,
    title: "Built around your car",
    text: "Every recommendation is matched to your vehicle, goals, and budget.",
  },
  {
    icon: ShieldCheck,
    title: "Clear before we begin",
    text: "Transparent package pricing and a confirmed scope before work starts.",
  },
  {
    icon: Sparkles,
    title: "A premium finish",
    text: "Tasteful execution with careful attention to the details you notice daily.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="border-y border-white/[0.07] bg-white/[0.018] px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
              The Driveway standard
            </p>
            <h2 className="mt-3 max-w-[12ch] text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Premium care without the garage wait.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
              One concierge for car care and customisation, designed to make
              upgrading your vehicle feel simple from the first tap.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:rounded-[2rem]">
            {reasons.map(({ icon: Icon, title, text }) => (
              <article key={title} className="min-h-48 bg-[#0a0a0a] p-4 sm:min-h-56 sm:p-7">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-sm font-semibold leading-5 sm:text-lg">{title}</h3>
                <p className="mt-2 text-[11px] leading-[1.1rem] text-zinc-500 sm:text-sm sm:leading-6">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
