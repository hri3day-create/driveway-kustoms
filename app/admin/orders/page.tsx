import { redirect } from "next/navigation";

import OrdersDashboard from "./OrdersDashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listBookings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const bookings = await listBookings({ limit: 250 });

  return <OrdersDashboard initialBookings={bookings} />;
}
