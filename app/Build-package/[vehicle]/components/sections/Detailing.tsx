"use client";

import ServiceList from "../ServiceList";
import { Service } from "../../types";
import { services } from "../../data/services";

interface Props {
  selected: Service[];
  toggleService: (service: Service) => void;
}

export default function Detailing({
  selected,
  toggleService,
}: Props) {
  return (
    <ServiceList
      title="Detailing Services"
      description="Choose premium detailing services to restore and protect your vehicle."
      services={services}
      selected={selected}
      toggleService={toggleService}
      showPrices
    />
  );
}