export const BOOKING_STATUSES = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingPriceKind = "fixed" | "starting";

export interface BookingServiceLine {
  name: string;
  category: string;
  catalog: "detailing" | "interior" | "exterior" | "protection";
  amount: number;
  priceKind: BookingPriceKind;
}

export type WhatsAppNotificationStatus =
  | "not_configured"
  | "pending"
  | "sent"
  | "failed";

export interface BookingRecord {
  id: string;
  bookingCode: string;
  requestId: string;
  status: BookingStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  vehicle: string;
  vehicleModel: string;
  registration: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  selectedServices: BookingServiceLine[];
  includeBasePackage: boolean;
  basePackageAmount: number;
  servicesAmount: number;
  totalAmount: number;
  currency: "INR";
  whatsappNotificationStatus: WhatsAppNotificationStatus;
  whatsappMessageId: string | null;
  whatsappNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingReceipt {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  totalAmount: number;
  currency: "INR";
  createdAt: string;
}

export interface CreateBookingInput {
  requestId: string;
  requestFingerprint: string;
  bookingCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  vehicle: string;
  vehicleModel: string;
  registration: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  selectedServices: BookingServiceLine[];
  includeBasePackage: boolean;
  basePackageAmount: number;
  servicesAmount: number;
  totalAmount: number;
}

export interface CreateBookingResult {
  booking: BookingRecord;
  created: boolean;
  fingerprintMatches: boolean;
}

export interface BookingListOptions {
  status?: BookingStatus;
  limit?: number;
  offset?: number;
}
