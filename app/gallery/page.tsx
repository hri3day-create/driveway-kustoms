import Link from "next/link";

import Navbar from "@/components/Navbar";

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <section className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
            Gallery
          </p>

          <h1 className="mt-3 text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Premium project gallery, coming soon.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            We are still curating the right before-and-after
            work, upgrade highlights, and finished customer
            vehicles for this page.
          </p>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-left sm:p-10">
            <p className="text-sm leading-7 text-zinc-300">
              Until the full gallery is live, the best way to
              explore our work is through the services and
              build-package flow.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.07]"
              >
                Explore Services
              </Link>

              <Link
                href="/Build-package"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Build Your Package
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
