export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  category: "Convenience" | "Safety" | "Interior" | "Exterior";
  price: number;
  image: string;
  badge?: string;
  compatibility?: string;
};

export const storeProducts: StoreProduct[] = [
  {
    id: "wireless-carplay-dongle",
    name: "Wireless CarPlay Dongle",
    description:
      "Turn compatible wired Apple CarPlay or Android Auto into a clean wireless connection.",
    category: "Convenience",
    price: 1500,
    image: "/images/service-thumbnails/phone-navigation.jpg",
    badge: "Popular",
    compatibility: "For compatible factory systems",
  },
  {
    id: "usb-fast-charger",
    name: "USB Fast Charging Port",
    description:
      "A tidy in-car fast-charging solution for phones, tablets, and everyday devices.",
    category: "Convenience",
    price: 1500,
    image: "/images/service-thumbnails/phone-charging.jpg",
    compatibility: "Installation included",
  },
  {
    id: "custom-floor-mats",
    name: "Custom-Fit Floor Mats",
    description:
      "Premium floor protection cut for a precise fit and a more finished cabin.",
    category: "Interior",
    price: 2500,
    image: "/images/service-thumbnails/custom-floor-mat.jpg",
    badge: "Made to fit",
    compatibility: "Vehicle model required",
  },
  {
    id: "premium-cabin-fragrance",
    name: "Premium Cabin Fragrance",
    description:
      "A fresh, refined cabin scent in a compact format that sits neatly in your car.",
    category: "Interior",
    price: 99,
    image: "/images/service-thumbnails/cabin-fragrance-spray-v2.webp",
    compatibility: "Multiple fragrances available",
  },
  {
    id: "reverse-camera",
    name: "Reverse Parking Camera",
    description:
      "A compact rear-view camera for easier, more confident parking and reversing.",
    category: "Safety",
    price: 1500,
    image: "/images/service-thumbnails/reverse-camera-ai.png",
    badge: "Fitted price",
    compatibility: "Display compatibility check required",
  },
  {
    id: "dash-camera",
    name: "Dash Camera",
    description:
      "Everyday road recording with discreet installation and neatly routed wiring.",
    category: "Safety",
    price: 4500,
    image: "/images/service-thumbnails/dash-camera.jpg",
    badge: "Best seller",
    compatibility: "Installation included",
  },
  {
    id: "rain-visors",
    name: "Smoked Rain Visors",
    description:
      "Vehicle-specific window visors for ventilation in light rain and a sharper profile.",
    category: "Exterior",
    price: 1500,
    image: "/images/service-thumbnails/rain-visor-install-v2.webp",
    compatibility: "Vehicle model required",
  },
  {
    id: "shark-fin-antenna",
    name: "Shark Fin Antenna",
    description:
      "A compact, colour-matched antenna upgrade for a cleaner modern roofline.",
    category: "Exterior",
    price: 1500,
    image: "/images/service-thumbnails/shark-fin-antenna-v2.webp",
    compatibility: "Compatibility check required",
  },
];

export function formatStorePrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
