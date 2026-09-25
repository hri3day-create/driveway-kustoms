const essentialDetailPrices: Record<string, number> = {
  hatchback: 699,
  sedan: 799,
  "compact-suv": 899,
  suv: 999,
  coupe: 1099,
};

export function getEssentialDetailPrice(vehicle: string) {
  return essentialDetailPrices[vehicle] ?? essentialDetailPrices.hatchback;
}
