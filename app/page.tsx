import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/Whychooseus";
import Testimonials from "@/components/Testimonials";
import CarModsPreview from "@/components/CarModsPreview";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import QuickBookingBar from "@/components/QuickBookingBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden pb-20 lg:pb-0">
        <Hero />
        <div className="border-y border-white/[0.07] bg-black/45 px-4 py-4 text-white backdrop-blur-xl sm:px-6 sm:py-5">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/10 text-center">
            <div className="px-2">
              <p className="text-sm font-semibold sm:text-xl">₹699</p>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.14em] text-zinc-500 sm:text-[10px] sm:tracking-[0.2em]">Base wash</p>
            </div>
            <div className="px-2">
              <p className="text-sm font-semibold sm:text-xl">4</p>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.14em] text-zinc-500 sm:text-[10px] sm:tracking-[0.2em]">Service studios</p>
            </div>
            <div className="px-2">
              <p className="text-sm font-semibold sm:text-xl">0</p>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.14em] text-zinc-500 sm:text-[10px] sm:tracking-[0.2em]">Advance payment</p>
            </div>
          </div>
        </div>
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <CarModsPreview />
        <FAQ />
      </main>
      <Footer />
      <QuickBookingBar />
    </>
  );
}
