"use client";

import ServiceList from "../ServiceList";
import { Service } from "../../types";
import { exteriorMods } from "../../data/exteriorMods";

interface Props {
  selected: Service[];
  toggleService: (service: Service) => void;
}

export default function ExteriorMods({
  selected,
  toggleService,
}: Props) {
  return (
    <ServiceList
      title="Exterior Upgrades"
      description="Transform the look of your vehicle with premium exterior modifications."
      services={exteriorMods}
      selected={selected}
      toggleService={toggleService}
      showStartingPrice
    />
  );
}