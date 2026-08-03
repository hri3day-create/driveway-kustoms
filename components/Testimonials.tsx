import Link from "next/link";
import { ArrowRight, CalendarCheck, CarFront, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CarFront,
    title: "Choose your vehicle",
    text: "Select the body type so your package starts with the right fit and pricing.",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Build your package",
    text: "Add detailing, interior, exterior, and protection services with a live total.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Request your slot",
    text: "Share your preferred time and address. Our team confirms the final appointment.",
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-16 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
              Built around your time
            </p>
            <h2 className="mt-3 text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              From idea to appointment.
            </h2>
          </div>

          <Link
            href="/Build-package"
            className="group hidden items-center gap-2 text-sm font-semibold text-white transition hover:text-red-300 sm:inline-flex"
          >
            Start building
            <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-10 grid gap-3 lg:grid-cols-3 lg:gap-4">
          <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent lg:block" />
          {steps.map(({ number, icon: Icon, title, text }) => (
            <article
              key={number}
              className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:rounded-[2rem] sm:p-7"
            >
              <span className="absolute right-5 top-2 text-7xl font-semibold tracking-[-0.08em] text-white/[0.035] sm:text-8xl">
                {number}
              </span>
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black text-red-400 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
                <Icon size={20} aria-hidden="true" />
              </div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-400">
                Step {number}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">{text}</p>
            </article>
          ))}
        </div>

        <Link
          href="/Build-package"
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold transition hover:bg-red-500 sm:hidden"
        >
          Build Your Package
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
