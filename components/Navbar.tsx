"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/Build-package", label: "Build Package" },
  { href: "/services", label: "Services" },
  { href: "/Car-Mods", label: "Car Mods" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/10 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <nav className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/driveway-kustoms-logo-cutout.png"
              alt="Driveway Kustoms logo"
              width={220}
              height={86}
              priority
              className="h-10 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,0,0,0.28)] sm:h-14"
            />
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/6 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="ml-2 rounded-full border border-red-500/70 bg-red-500/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500 hover:text-white"
            >
              Contact
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-red-500/60 hover:bg-red-500/10 lg:hidden"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 px-4 pb-4 lg:hidden">
            <div className="grid gap-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
