import Link from "next/link";
import { MessageCircle } from "lucide-react";

const whatsappMessage = encodeURIComponent(
  "Hi Driveway Kustoms, I need help choosing and booking services for my car."
);

export default function QuickBookingBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090909]/95 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-18px_55px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[0.78fr_1.22fr] gap-2.5">
        <a
          href={`https://wa.me/918796562667?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.055] px-3 text-xs font-semibold text-white"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Need help?
        </a>
        <Link
          href="/Build-package"
          className="inline-flex min-h-[3.25rem] items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)] active:scale-[0.98]"
        >
          Book in 2 minutes
        </Link>
      </div>
    </div>
  );
}
