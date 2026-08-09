import Link from "next/link";
import { MessageCircle } from "lucide-react";

const whatsappMessage = encodeURIComponent(
  "Hi Driveway Kustoms, I need help choosing and booking services for my car."
);

export default function QuickBookingBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090909] px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_35px_rgba(0,0,0,0.5)] lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[0.72fr_1.28fr] items-center gap-2.5">
        <a
          href={`https://wa.me/918796562667?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.055] px-3 text-xs font-semibold text-white"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Need help?
        </a>
        <div className="grid gap-1.5">
          <Link
            href="/book"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-red-600 px-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)] active:scale-[0.98]"
          >
            Book a Callback
          </Link>
          <Link
            href="/Build-package"
            className="inline-flex min-h-7 items-center justify-center text-[11px] font-semibold text-zinc-300 underline decoration-white/25 underline-offset-4"
          >
            Build Your Package
          </Link>
        </div>
      </div>
    </div>
  );
}
