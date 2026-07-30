"use client";

import ServiceList from "../ServiceList";
import { Service } from "../../types";
import { protection } from "../../data/protection";

interface Props {
  selected: Service[];
  toggleService: (service: Service) => void;
}

export default function Protection({
  selected,
  toggleService,
}: Props) {
  return (
    <ServiceList
      title="Protection Packages"
      description="Protect your investment with premium coatings and films."
      services={protection}
      selected={selected}
      toggleService={toggleService}
      showStartingPrice
    />
  );
}