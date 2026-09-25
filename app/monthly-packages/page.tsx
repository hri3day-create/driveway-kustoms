import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MonthlyPackages from "@/components/MonthlyPackages";
import Navbar from "@/components/Navbar";
import QuickBookingBar from "@/components/QuickBookingBar";

export const metadata: Metadata = {
  title: "Monthly Car Care Packages | Driveway Kustoms",
  description: "Monthly doorstep car care plans with scheduled washes, Dyson interior vacuuming, detailing, and priority booking in Delhi NCR.",
};

export default function MonthlyPackagesPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden pb-20 pt-24 lg:pb-0 sm:pt-28">
        <MonthlyPackages headingLevel="h1" />
      </main>
      <Footer />
      <QuickBookingBar />
    </>
  );
}
