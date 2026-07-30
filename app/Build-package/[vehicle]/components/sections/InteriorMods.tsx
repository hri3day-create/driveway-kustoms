"use client";

import ServiceList from "../ServiceList";
import { Service } from "../../types";
import { interiorMods } from "../../data/interiorMods";

interface Props {
  selected: Service[];
  toggleService: (service: Service) => void;
}

export default function InteriorMods({
  selected,
  toggleService,
}: Props) {
  return (
    <ServiceList
      title="Interior Upgrades"
      description="Upgrade your cabin with premium OEM-fit accessories and luxury enhancements."
      services={interiorMods}
      selected={selected}
      toggleService={toggleService}
      showStartingPrice
    />
  );
}