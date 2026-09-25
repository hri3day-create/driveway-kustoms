import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Storefront from "./Storefront";

export const metadata: Metadata = {
  title: "Car Accessories Store | Driveway Kustoms",
  description:
    "Shop small car accessories for comfort, safety, convenience, and style from Driveway Kustoms.",
};

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#080808] pt-24 text-white sm:pt-28">
        <Storefront />
      </main>
      <Footer />
    </>
  );
}
