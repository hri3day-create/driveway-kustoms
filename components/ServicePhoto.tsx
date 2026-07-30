import Image from "next/image";

interface Props {
  name: string;
  category?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

const imageBase = "/images/service-thumbnails/";

const serviceImages: Record<string, string> = {
  // Vehicle types
  Hatchback: "hatchback.jpg",
  Sedan: "sedan.jpg",
  "Compact SUV": "compact-suv.jpg",
  SUV: "suv.jpg",
  Coupe: "coupe.jpg",

  // Homepage and section cards
  Detailing: "detailing.jpg",
  "Premium Detailing": "detailing.jpg",
  "Interior Cleaning": "interior-cleaning.jpg",
  "Interior Mods": "bmw-ambient-unsplash.jpg",
  "Interior Upgrades": "bmw-ambient-unsplash.jpg",
  "Exterior Mods": "body-kit-show.jpg",
  "Exterior Styling": "body-kit-show.jpg",
  Protection: "protective-film-team.jpg",
  "Protection Packages": "protective-film-team.jpg",

  // Detailing services
  "Exterior Detailing": "soap-wash.jpg",
  "Deep Interior Cleaning": "deep-interior-cleaning-ai.png",
  "Deep Steam Interior Cleaning and Sanitisation": "steam-interior-ai.png",
  "Deep Interior Detailing": "interior-detailing.jpg",
  "Deep Seat Cleaning": "deep-seat-cleaning-ai.png",
  "Leather Cleaning and Conditioning": "leather-interior.jpg",
  "Dashboard and Trim Detailing": "dashboard-trim-ai.png",
  "Deep AC Vent Cleaning": "ac-vent.jpg",
  "Deep Carpet and Floor Cleaning": "carpet-floor-ai.png",
  "Deep Headliner / Roof Cleaning": "headliner-roof-ai.png",
  "Deep Boot Cleaning": "boot-trunk.jpg",
  "Interior Glass Cleaning": "car-window-cleaning.jpg",
  "Premium Glass Polish": "glass-cleaning.jpg",
  "Door Jamb Detailing": "door-jamb-cleaning.jpg",
  "Engine Bay Detailing": "engine-bay.jpg",
  "Tyre and Alloy Detailing": "wheel-detailing.jpg",
  "Premium Machine Wax": "paint-polish-door.jpg",
  "Premium Paint Decontamination": "paint-polish.jpg",
  "Clay Bar Decontamination": "paint-polish.jpg",
  "Iron Fallout Removal": "soap-wash.jpg",
  "Premium Paint Gloss Enhancement": "paint-polish-door.jpg",
  "Single Stage Paint Correction": "paint-correction.jpg",
  "Multi Stage Paint Correction": "paint-correction.jpg",
  "Swirl Mark Removal": "paint-correction.jpg",
  "Deep Paint Revival": "paint-polish-door.jpg",
  "Premium Paint Sealant": "water-beading.jpg",
  "Odour Neutralisation": "cabin-fragrance.jpg",
  "Cabin Sanitisation": "interior-cleaning.jpg",
  "Premium Cabin Fragrance": "cabin-fragrance.jpg",

  // Interior mods
  "OEM Fit Ambient Lighting & Ambient Light Kits": "ambient-lighting-kit-ai.png",
  "Android Infotainment Systems": "infotainment.jpg",
  "360 Degree Camera Systems": "infotainment-screen.jpg",
  "Reverse Camera Installation": "reverse-camera-ai.png",
  "Premium Seat Upholstery": "leather-interior.jpg",
  "Roof Starlight Installation": "starlight-roof-ai.png",
  "Steering Wheel Upholstery": "steering-wheel-upholstery-ai.png",
  "Dashboard Upholstery": "dashboard-upholstery-ai.png",
  "Door Panel Upholstery": "door-panel-upholstery-ai.png",
  "Roof Liner Upholstery": "roof-liner-upholstery-ai.png",
  "Complete Car Audio Setup": "audio-components.jpg",
  "Car Midrange Speakers": "car-midrange-speaker-ai.png",
  "Component Speakers": "component-speakers-ai.png",
  "Coaxial Speakers": "car-speaker.jpg",
  "OEM-Specific Subwoofer Upgrades": "oem-subwoofer-ai.png",
  "Underseat Subwoofer Installation": "subwoofer.jpg",
  "Boot Subwoofer Installation": "subwoofer.jpg",
  "Bass Tube Installation": "subwoofer.jpg",
  "Amplifier Installation": "amplifier-installation-ai.png",
  "Tweeter Installation": "car-speaker.jpg",
  "DSP Tuning & Installation": "audio-components.jpg",
  "Door Damping": "door-panel.jpg",
  "Floor Damping": "floor-mat.jpg",
  "Wireless Android Auto & Apple CarPlay Dongle": "car-multimedia-call.jpg",
  "Wireless Charger Installation": "phone-charging.jpg",
  "Digital Instrument Cluster": "digital-cluster.jpg",
  "Heads-Up Display (HUD)": "digital-cluster.jpg",
  "Custom Floor Mats": "custom-floor-mat.jpg",
  "Premium Cabin Lighting": "ambient-lighting-kit-ai.png",
  "USB Fast Charging Ports": "phone-charging.jpg",
  "Dash Camera Installation": "dash-camera.jpg",
  "Rear Seat Display": "rear-seat-display-ai.png",

  // Exterior mods
  "Gloss Black Roof Wrap": "roof-film.jpg",
  "Chrome Delete": "chrome-trim.jpg",
  "Full Body Wrap": "wrap-install.jpg",
  "Bonnet Wrap": "wrap-hood.jpg",
  "Roof Wrap": "roof-film.jpg",
  "PPF (Paint Protection Film)": "ppf-door.jpg",
  "Ceramic Coating": "ceramic-coating-ai.png",
  "Front Lip / Splitter Installation": "body-kit-show.jpg",
  "Side Skirt Installation": "side-skirt.jpg",
  "Rear Diffuser Installation": "exhaust-diffuser.jpg",
  "Boot Lip Spoiler Installation": "spoiler.jpg",
  "Roof Spoiler Installation": "spoiler.jpg",
  "Body Kit Installation": "body-kit-show.jpg",
  "Alloy Wheel Painting": "black-alloy-wheel.jpg",
  "Brake Caliper Painting": "brake-caliper.jpg",
  "LED Headlight Upgrade": "headlight.jpg",
  "LED Fog Lamp Upgrade": "headlight.jpg",
  "Sequential DRL / Indicator Upgrade": "headlight-protection.jpg",
  "Tail Light Upgrade": "tail-light.jpg",
  "Window Tint Installation": "window-tint.jpg",
  "Door Visors Installation": "rain-window.jpg",
  "Shark Fin Antenna Installation": "car-antenna.jpg",
  "Front Grille Replacement": "grille.jpg",
  "Emblem Blackout / Badge Replacement": "emblem.jpg",
  "Window Chrome Garnish": "window-chrome.jpg",

  // Paint protection services
  "Paint Protection Film (PPF)": "ppf-door.jpg",
  "Graphene Coating": "graphene-coating-ai.png",
  "Windshield Protection Film": "windshield-film.jpg",
  "Headlight Protection Film": "headlight-protection.jpg",
  "Door Edge PPF": "ppf-door.jpg",
  "Door Cup PPF": "ppf-door.jpg",
  "Roof PPF": "roof-film.jpg",
  "Gloss Paint Protection Film": "protective-film-team.jpg",
  "Matte Paint Protection Film": "protective-film-team.jpg",
  "Ceramic Window Coating": "glass-cleaning.jpg",
  "Leather Ceramic Coating": "leather-interior.jpg",
  "Alloy Wheel Ceramic Coating": "black-alloy-wheels.jpg",
  "Plastic Trim Ceramic Coating": "door-panel.jpg",
  "Fabric Protection Coating": "seat-cleaning.jpg",
};

export function getServicePhoto(name: string, category = "") {
  const image = serviceImages[name] ?? serviceImages[category];

  return image ? `${imageBase}${image}` : null;
}

export default function ServicePhoto({
  name,
  category = "",
  className = "",
  imageClassName = "",
  sizes = "96px",
  priority = false,
}: Props) {
  const photo = getServicePhoto(name, category);

  if (!photo) {
    return null;
  }

  return (
    <span
      className={`relative block h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_35px_rgba(0,0,0,0.28)] ${className}`}
    >
      <Image
        src={photo}
        alt={`${name} photo`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition duration-500 group-hover:scale-110 ${imageClassName}`}
      />

      <span className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-red-500/15" />
    </span>
  );
}
