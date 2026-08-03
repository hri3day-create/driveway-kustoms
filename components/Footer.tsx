import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MessageCircle, Phone } from "lucide-react";

const links = [
  { href: "/Build-package", label: "Build Package" },
  { href: "/services", label: "All Services" },
  { href: "/Car-Mods", label: "Car Mods" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="px-4 pb-5 pt-8 text-white sm:px-6 sm:pb-6 sm:pt-14">
      <div className="mx-auto max-w-7xl">
        <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-red-500/25 bg-[#0b0b0b] px-5 py-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:rounded-[2.5rem] sm:px-10 sm:py-16">
          <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[90px]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300 sm:text-xs">
            Ready when you are
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-[2.25rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
            Build the package your car deserves.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Select your vehicle, customise your services, and request a booking in minutes.
          </p>
          <Link
            href="/Build-package"
            className="group mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-7 text-sm font-semibold shadow-[0_15px_45px_rgba(220,38,38,0.3)] transition hover:-translate-y-0.5 hover:bg-red-500 sm:w-auto"
          >
            Build Your Package
            <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </section>

        <div className="mt-5 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:mt-6 sm:rounded-[2rem] sm:p-8">
          <div className="grid gap-9 border-b border-white/10 pb-8 md:grid-cols-[1.25fr_0.75fr_1fr]">
            <div>
              <Image
                src="/driveway-kustoms-logo-cutout.png"
                alt="Driveway Kustoms"
                width={330}
                height={120}
                className="h-14 w-auto object-contain sm:h-16"
              />
              <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
                Premium doorstep car care and customisation, built around your vehicle.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Navigate</p>
              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 md:grid-cols-1">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-zinc-300 transition hover:text-red-400">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Talk to us</p>
              <div className="mt-4 space-y-3">
                <a href="tel:+918796562667" className="flex items-center gap-3 text-sm text-zinc-300 transition hover:text-red-400">
                  <Phone size={15} aria-hidden="true" /> +91 87965 62667
                </a>
                <a href="https://wa.me/918796562667" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-zinc-300 transition hover:text-green-400">
                  <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                </a>
                <a href="https://instagram.com/driveway.kustoms" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-zinc-300 transition hover:text-pink-400">
                  <Camera size={15} aria-hidden="true" /> @driveway.kustoms
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-5 text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Driveway Kustoms. All rights reserved.</p>
            <p>Premium car care, delivered.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
