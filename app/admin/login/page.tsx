import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";

import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/orders");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#080808] px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">
          <LockKeyholeIcon />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
          Private access
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Driveway Kustoms Orders
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Sign in to view customer bookings, call customers,
          and update job statuses.
        </p>

        <AdminLoginForm />
      </section>
    </main>
  );
}

function LockKeyholeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-400"
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M12 15v3" />
    </svg>
  );
}
