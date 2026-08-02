"use client";

import { useState } from "react";

import CategorySelector from "./components/CategorySelector";
import BasePackage from "./components/BasePackage";
import Summary from "./components/Summary";
import BookingDrawer from "./components/BookingDrawer";

import Detailing from "./components/sections/Detailing";
import InteriorMods from "./components/sections/InteriorMods";
import ExteriorMods from "./components/sections/ExteriorMods";
import Protection from "./components/sections/Protection";

import { Service } from "./types";

interface Props {
  vehicle: string;
}

type Category =
  | "detailing"
  | "interior"
  | "exterior"
  | "protection";

export default function VehicleConfigurator({
  vehicle,
}: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("detailing");

  const [selected, setSelected] = useState<Service[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasDetailingSelection = selected.some(
    (service) => typeof service.price === "number"
  );

  const basePrice =
    selectedCategory === "detailing" || hasDetailingSelection
      ? 699
      : 0;

  const getServicePrice = (service: Service) => {
    if (typeof service.price === "number") {
      return service.price;
    }

    const startingPrice = service.startingPrice?.match(/[\d,]+/);
    return startingPrice
      ? Number(startingPrice[0].replace(/,/g, ""))
      : 0;
  };

  const total =
    basePrice +
    selected.reduce(
      (sum, item) => sum + getServicePrice(item),
      0
    );

  function toggleService(service: Service) {
    setSelected((prev) => {
      const exists = prev.some(
        (item) => item.name === service.name
      );

      if (exists) {
        return prev.filter(
          (item) => item.name !== service.name
        );
      }

      return [...prev, service];
    });
  }

  return (
    <>
      <CategorySelector
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {selectedCategory === "detailing" && (
        <div className="mt-8">
          <BasePackage />
        </div>
      )}

      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
        <div className="min-w-0">
          {selectedCategory === "detailing" && (
            <Detailing
              selected={selected}
              toggleService={toggleService}
            />
          )}

          {selectedCategory === "interior" && (
            <InteriorMods
              selected={selected}
              toggleService={toggleService}
            />
          )}

          {selectedCategory === "exterior" && (
            <ExteriorMods
              selected={selected}
              toggleService={toggleService}
            />
          )}

          {selectedCategory === "protection" && (
            <Protection
              selected={selected}
              toggleService={toggleService}
            />
          )}
        </div>

        <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <Summary
            vehicle={vehicle}
            selected={selected}
            total={total}
            toggleService={toggleService}
            onContinue={() => setDrawerOpen(true)}
            showBasePackage={
              selectedCategory === "detailing" ||
              hasDetailingSelection
            }
          />
        </div>
      </div>

      <BookingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        total={total}
        vehicle={vehicle}
        selectedServices={selected.map(
          (service) => service.name
        )}
        basePackageIncluded={
          selectedCategory === "detailing" ||
          hasDetailingSelection
        }
      />
    </>
  );
}
