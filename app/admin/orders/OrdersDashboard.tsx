"use client";

import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  BOOKING_STATUSES,
  type BookingRecord,
  type BookingStatus,
  type WhatsAppNotificationStatus,
} from "@/lib/booking-types";
import NotificationSetup from "./NotificationSetup";

interface Props {
  initialBookings: BookingRecord[];
}

type StatusFilter = BookingStatus | "all";

const statusLabels: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<BookingStatus, string> = {
  new: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  contacted: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  confirmed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  completed: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  cancelled: "border-rose-400/25 bg-rose-400/10 text-rose-200",
};

const whatsappLabels: Record<WhatsAppNotificationStatus, string> = {
  not_configured: "Not configured",
  pending: "Pending",
  sent: "Accepted",
  failed: "Failed",
};

const whatsappStyles: Record<WhatsAppNotificationStatus, string> = {
  not_configured: "text-zinc-500",
  pending: "text-amber-300",
  sent: "text-emerald-300",
  failed: "text-rose-300",
};

const filterOptions: Array<{
  value: StatusFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  ...BOOKING_STATUSES.map((status) => ({
    value: status,
    label: statusLabels[status],
  })),
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const createdFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : createdFormatter.format(date);
}

function formatTime(value: string) {
  const [hourText, minuteText = "00"] = value.split(":");
  const hour = Number(hourText);

  if (!Number.isFinite(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minuteText} ${suffix}`;
}

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function OrderCard({
  booking,
  updating,
  notifying,
  onStatusChange,
  onRetryWhatsApp,
}: {
  booking: BookingRecord;
  updating: boolean;
  notifying: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onRetryWhatsApp: (bookingId: string) => void;
}) {
  const customerName = `${booking.firstName} ${booking.lastName}`.trim();
  const address = [booking.address, booking.city, booking.postcode]
    .filter(Boolean)
    .join(", ");
  const whatsappNumber = getWhatsAppNumber(booking.phone);
  const whatsappMessage = encodeURIComponent(
    `Hi ${booking.firstName}, this is Driveway Kustoms regarding booking ${booking.bookingCode}.`
  );
  const visibleServices = booking.selectedServices.slice(0, 3);
  const hiddenServices = booking.selectedServices.slice(3);

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:rounded-[1.9rem]">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-sm font-semibold tracking-wide text-white">
                {booking.bookingCode}
              </p>
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[booking.status]}`}
              >
                {statusLabels[booking.status]}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              Received {formatCreatedAt(booking.createdAt)}
            </p>
          </div>

          <p className="shrink-0 text-right text-lg font-semibold text-white">
            {currency.format(booking.totalAmount)}
            <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Estimated
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">
            Customer
          </p>
          <h2 className="mt-1.5 text-xl font-semibold text-white">
            {customerName || "Customer"}
          </h2>
          <a
            href={`tel:${booking.phone}`}
            className="mt-1 inline-flex text-sm text-zinc-400 transition hover:text-white"
          >
            {booking.phone}
          </a>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-black/25 p-3.5">
            <div className="flex items-start gap-3">
              <CarFront className="mt-0.5 shrink-0 text-red-400" size={17} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Vehicle / model
                </p>
                <p className="mt-1 capitalize text-sm font-medium text-white">
                  {booking.vehicle.replace(/-/g, " ")}
                </p>
                {booking.vehicleModel && (
                  <p className="mt-0.5 text-xs text-zinc-300">
                    {booking.vehicleModel}
                  </p>
                )}
                <p className="mt-0.5 text-xs uppercase tracking-wide text-zinc-400">
                  {booking.registration || "Registration not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/25 p-3.5">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 shrink-0 text-red-400" size={17} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Requested schedule
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {formatDate(booking.appointmentDate)}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                  <Clock3 size={12} />
                  {formatTime(booking.appointmentTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/25 p-3.5">
          <MapPin className="mt-0.5 shrink-0 text-red-400" size={17} />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Service address
            </p>
            <p className="mt-1 break-words text-sm leading-6 text-zinc-300">
              {address || "Address not provided"}
            </p>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Services ({booking.selectedServices.length})
            </p>
            <div className="flex items-center gap-2">
              <p
                className={`text-[11px] font-semibold ${whatsappStyles[booking.whatsappNotificationStatus]}`}
              >
                WhatsApp: {whatsappLabels[booking.whatsappNotificationStatus]}
              </p>
              {booking.whatsappNotificationStatus !== "sent" && (
                <button
                  type="button"
                  onClick={() => onRetryWhatsApp(booking.id)}
                  disabled={notifying || booking.whatsappNotificationStatus === "pending"}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 transition hover:border-emerald-400/40 hover:text-emerald-200 disabled:cursor-wait disabled:opacity-40"
                >
                  {notifying ? "Sending..." : "Retry alert"}
                </button>
              )}
            </div>
          </div>

          {booking.includeBasePackage && (
            <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2 text-xs text-red-100">
              Essential Wash included · {currency.format(booking.basePackageAmount)}
            </p>
          )}

          {visibleServices.length ? (
            <div className="mt-2 space-y-2">
              {visibleServices.map((service, index) => (
                <div
                  key={`${booking.id}-${service.catalog}-${service.name}-${index}`}
                  className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.035] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200">{service.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                      {service.category}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-zinc-300">
                    {service.priceKind === "starting" && "From "}
                    {currency.format(service.amount)}
                  </p>
                </div>
              ))}

              {hiddenServices.length > 0 && (
                <details className="rounded-xl border border-white/8 bg-white/[0.025] px-3 py-2.5">
                  <summary className="cursor-pointer text-xs font-semibold text-zinc-300">
                    View {hiddenServices.length} more service{hiddenServices.length === 1 ? "" : "s"}
                  </summary>
                  <div className="mt-2 space-y-2 border-t border-white/8 pt-2">
                    {hiddenServices.map((service, index) => (
                      <div
                        key={`${booking.id}-hidden-${service.catalog}-${service.name}-${index}`}
                        className="flex items-start justify-between gap-3 text-xs"
                      >
                        <span className="text-zinc-400">{service.name}</span>
                        <span className="shrink-0 text-zinc-300">
                          {service.priceKind === "starting" && "From "}
                          {currency.format(service.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No additional services.</p>
          )}
        </section>

        {booking.notes && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Customer note
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 p-4 sm:p-5">
        <label
          htmlFor={`status-${booking.id}`}
          className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          Update status
        </label>
        <select
          id={`status-${booking.id}`}
          value={booking.status}
          disabled={updating}
          onChange={(event) =>
            onStatusChange(booking.id, event.target.value as BookingStatus)
          }
          className="min-h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3 text-sm font-semibold text-white outline-none transition focus:border-red-500 disabled:cursor-wait disabled:opacity-60"
        >
          {BOOKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${booking.phone}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white transition hover:border-red-500/50 hover:bg-white/[0.08]"
          >
            <Phone size={16} />
            Call
          </a>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <MessageCircle size={16} />
            Message
          </a>
        </div>
      </div>
    </article>
  );
}

export default function OrdersDashboard({ initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      new: bookings.filter((booking) => booking.status === "new").length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      completed: bookings.filter((booking) => booking.status === "completed").length,
    }),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings
      .filter(
        (booking) =>
          statusFilter === "all" || booking.status === statusFilter
      )
      .filter((booking) => {
        if (!query) {
          return true;
        }

        return [
          booking.bookingCode,
          booking.firstName,
          booking.lastName,
          booking.email,
          booking.phone,
          booking.vehicle,
          booking.vehicleModel,
          booking.registration,
          booking.address,
          booking.city,
          booking.postcode,
          ...booking.selectedServices.map((service) => service.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
      );
  }, [bookings, search, statusFilter]);

  const updateStatus = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    setError("");
    setUpdatingId(bookingId);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(bookingId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = (await response.json().catch(() => null)) as
        | { booking?: BookingRecord; error?: string }
        | null;

      if (response.status === 401) {
        window.location.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.error || "Unable to update booking status.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? result?.booking ?? {
                ...booking,
                status,
                updatedAt: new Date().toISOString(),
              }
            : booking
        )
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update booking status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Unable to sign out.");
      }
      window.location.replace("/admin/login");
    } catch (logoutError) {
      setLoggingOut(false);
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Unable to sign out."
      );
    }
  };

  const retryWhatsApp = async (bookingId: string) => {
    setError("");
    setNotifyingId(bookingId);

    try {
      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(bookingId)}`,
        { method: "POST" }
      );
      const result = (await response.json().catch(() => null)) as
        | {
            booking?: BookingRecord;
            notification?: { sent?: boolean };
            error?: string;
          }
        | null;

      if (response.status === 401) {
        window.location.replace("/admin/login");
        return;
      }

      if (!response.ok || !result?.booking) {
        throw new Error(result?.error || "Unable to send WhatsApp alert.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? result.booking! : booking
        )
      );

      if (!result.notification?.sent) {
        setError(
          "WhatsApp did not accept the alert. Check the Meta template and Vercel environment settings."
        );
      }
    } catch (notificationError) {
      setError(
        notificationError instanceof Error
          ? notificationError.message
          : "Unable to send WhatsApp alert."
      );
    } finally {
      setNotifyingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:py-10">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
              Private dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Orders
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Customer requests, schedules, services, and follow-ups in one place.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                window.location.reload();
              }}
              disabled={refreshing}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-red-500/40 hover:text-white disabled:opacity-50"
              aria-label="Refresh orders"
            >
              <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-300 transition hover:border-red-500/40 hover:text-white disabled:opacity-50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{loggingOut ? "Signing out" : "Sign out"}</span>
            </button>
          </div>
        </header>

        <NotificationSetup />

        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "All requests", value: counts.total, tone: "text-white" },
            { label: "New", value: counts.new, tone: "text-sky-300" },
            { label: "Confirmed", value: counts.confirmed, tone: "text-emerald-300" },
            { label: "Completed", value: counts.completed, tone: "text-violet-300" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:rounded-3xl sm:p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                {item.label}
              </p>
              <p className={`mt-2 text-3xl font-semibold ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-3 sm:p-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, vehicle, reg, service..."
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {filterOptions.map((option) => {
              const active = statusFilter === option.value;
              const count =
                option.value === "all"
                  ? bookings.length
                  : bookings.filter((booking) => booking.status === option.value)
                      .length;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition ${
                    active
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-white/10 bg-white/[0.035] text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {option.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      active ? "bg-black/20 text-white" : "bg-black/30 text-zinc-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          >
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-300">
            {filteredBookings.length} order{filteredBookings.length === 1 ? "" : "s"}
          </p>
          {filteredBookings.length > 0 && (
            <p className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:flex">
              <CheckCircle2 size={14} />
              Latest requests first
            </p>
          )}
        </div>

        {filteredBookings.length ? (
          <section className="mt-3 grid items-start gap-4 xl:grid-cols-2">
            {filteredBookings.map((booking) => (
              <OrderCard
                key={booking.id}
                booking={booking}
                updating={updatingId === booking.id}
                notifying={notifyingId === booking.id}
                onStatusChange={updateStatus}
                onRetryWhatsApp={retryWhatsApp}
              />
            ))}
          </section>
        ) : (
          <section className="mt-3 rounded-[2rem] border border-dashed border-white/12 bg-white/[0.02] px-5 py-16 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.05] text-zinc-500">
              <Search size={20} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">No orders found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Try another status or search term. New website bookings will appear here automatically.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
