"use client";

import ServiceList from "../ServiceList";
import { Service } from "../../types";
import { audioUpgrades } from "../../data/audioUpgrades";

interface Props {
  selected: Service[];
  toggleService: (service: Service) => void;
}

export default function AudioUpgrades({
  selected,
  toggleService,
}: Props) {
  return (
    <ServiceList
      title="Audio Upgrades"
      description="Build a cleaner, stronger sound system with speakers, bass, amplification, damping, and professional DSP tuning."
      services={audioUpgrades}
      selected={selected}
      toggleService={toggleService}
      showStartingPrice
    />
  );
}
