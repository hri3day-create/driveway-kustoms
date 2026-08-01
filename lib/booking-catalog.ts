import { services } from "@/app/Build-package/[vehicle]/data/services";
import { interiorMods } from "@/app/Build-package/[vehicle]/data/interiorMods";
import { exteriorMods } from "@/app/Build-package/[vehicle]/data/exteriorMods";
import { protection } from "@/app/Build-package/[vehicle]/data/protection";

import type { BookingServiceLine } from "./booking-types";

export const ESSENTIAL_DETAIL_PRICE = 699;

type CatalogName = BookingServiceLine["catalog"];

interface CatalogSource {
  name: CatalogName;
  entries: Array<{
    name: string;
    category: string;
    price?: number;
    startingPrice?: string;
  }>;
}

const sources: CatalogSource[] = [
  { name: "detailing", entries: services },
  { name: "interior", entries: interiorMods },
  { name: "exterior", entries: exteriorMods },
  { name: "protection", entries: protection },
];

const normalizeServiceName = (name: string) =>
  name.trim().toLocaleLowerCase("en-US");

const parseStartingPrice = (value: string | undefined) => {
  const match = value?.match(/[\d,]+/);
  return match ? Number(match[0].replace(/,/g, "")) : null;
};

const catalog = new Map<string, BookingServiceLine>();

for (const source of sources) {
  for (const entry of source.entries) {
    const fixedPrice =
      typeof entry.price === "number" ? entry.price : null;
    const startingPrice = parseStartingPrice(entry.startingPrice);
    const amount = fixedPrice ?? startingPrice;

    if (amount === null || !Number.isFinite(amount) || amount < 0) {
      continue;
    }

    const key = normalizeServiceName(entry.name);

    if (!catalog.has(key)) {
      catalog.set(key, {
        name: entry.name,
        category: entry.category,
        catalog: source.name,
        amount,
        priceKind: fixedPrice === null ? "starting" : "fixed",
      });
    }
  }
}

export class UnknownBookingServicesError extends Error {
  readonly services: string[];

  constructor(serviceNames: string[]) {
    super("One or more selected services are not in the booking catalog.");
    this.name = "UnknownBookingServicesError";
    this.services = serviceNames;
  }
}

export interface BookingPricing {
  selectedServices: BookingServiceLine[];
  includeBasePackage: boolean;
  basePackageAmount: number;
  servicesAmount: number;
  totalAmount: number;
  currency: "INR";
}

export function calculateBookingPricing(
  selectedServiceNames: string[],
  includeBasePackage: boolean
): BookingPricing {
  const uniqueNames = new Map<string, string>();

  for (const name of selectedServiceNames) {
    const normalized = normalizeServiceName(name);
    if (!uniqueNames.has(normalized)) {
      uniqueNames.set(normalized, name.trim());
    }
  }

  const unknownServices: string[] = [];
  const selectedServices: BookingServiceLine[] = [];

  for (const [normalized, submittedName] of uniqueNames) {
    const service = catalog.get(normalized);

    if (!service) {
      unknownServices.push(submittedName);
      continue;
    }

    selectedServices.push({ ...service });
  }

  if (unknownServices.length > 0) {
    throw new UnknownBookingServicesError(unknownServices);
  }

  const servicesAmount = selectedServices.reduce(
    (sum, service) => sum + service.amount,
    0
  );
  const resolvedBasePackage =
    includeBasePackage ||
    selectedServices.some((service) => service.catalog === "detailing");
  const basePackageAmount = resolvedBasePackage
    ? ESSENTIAL_DETAIL_PRICE
    : 0;

  return {
    selectedServices,
    includeBasePackage: resolvedBasePackage,
    basePackageAmount,
    servicesAmount,
    totalAmount: basePackageAmount + servicesAmount,
    currency: "INR",
  };
}

export function getCanonicalServiceNames() {
  return Array.from(catalog.values(), (service) => service.name);
}
