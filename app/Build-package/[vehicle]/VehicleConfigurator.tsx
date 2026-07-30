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

  const basePrice =
    selectedCategory === "detailing" ? 699 : 0;

  const total =
    basePrice +
    selected.reduce(
      (sum, item) => sum + (item.price ?? 0),
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

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
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

        <div className="h-fit lg:sticky lg:top-24">
          <Summary
            vehicle={vehicle}
            selected={selected}
            total={total}
            toggleService={toggleService}
            onContinue={() => setDrawerOpen(true)}
            showBasePackage={
              selectedCategory === "detailing"
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
      />
    </>
  );
}
