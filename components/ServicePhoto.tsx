import Image from "next/image";

interface Props {
  name: string;
  category?: string;
  variant?: "thumbnail" | "compact-thumbnail" | "card" | "compact-card";
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
  "Interior Mods": "interior-mods-mercedes-ambient.webp",
  "Interior Upgrades": "interior-mods-mercedes-ambient.webp",
  "Exterior Mods": "exterior-mods-bmw-jdm.webp",
  "Exterior Styling": "exterior-mods-bmw-jdm.webp",
  Protection: "protective-film-team.jpg",
  "Protection Packages": "protective-film-team.jpg",

  // Detailing services
  "Exterior Detailing": "soap-wash.jpg",
  "Deep Interior Cleaning": "deep-interior-cleaning-ai.png",
  "Deep Steam Interior Cleaning and Sanitisation": "steam-interior-ai.png",
  "Deep Interior Detailing": "deep-interior-detailing-brush-v2.webp",
  "Deep Seat Cleaning": "deep-seat-cleaning-ai.png",
  "Leather Cleaning and Conditioning": "leather-conditioning-v2.webp",
  "Dashboard and Trim Detailing": "dashboard-trim-ai.png",
  "Deep AC Vent Cleaning": "ac-vent.jpg",
  "Deep Carpet and Floor Cleaning": "carpet-floor-ai.png",
  "Deep Headliner / Roof Cleaning": "headliner-roof-ai.png",
  "Deep Boot Cleaning": "deep-boot-cleaning-v2.webp",
  "Window Detailing": "window-detailing-v2.webp",
  "Premium Glass Polish": "glass-cleaning.jpg",
  "Door Jamb Detailing": "door-jamb-cleaning.jpg",
  "Engine Bay Detailing": "engine-bay.jpg",
  "Tyre and Alloy Detailing": "wheel-detailing.jpg",
  "Premium Machine Wax": "paint-polish-door.jpg",
  "Premium Paint Decontamination": "paint-polish.jpg",
  "Clay Bar Decontamination": "clay-bar-decontamination-v2.webp",
  "Premium Paint Gloss Enhancement": "paint-gloss-enhancement-v2.webp",
  "Single Stage Paint Correction": "paint-correction.jpg",
  "Multi Stage Paint Correction": "paint-correction.jpg",
  "Swirl Mark Removal": "paint-correction.jpg",
  "Deep Paint Revival": "paint-polish-door.jpg",
  "Odour Neutralisation": "cabin-fragrance.jpg",
  "Cabin Sanitisation": "interior-cleaning.jpg",
  "Premium Cabin Fragrance": "cabin-fragrance-spray-v2.webp",

  // Interior mods
  "Premium Cabin & Strip Ambient Lighting": "premium-ambient-lighting-v2.webp",
  "Android Infotainment Systems": "infotainment.jpg",
  "360 Degree Camera System Installation": "360-camera-system-v2.webp",
  "Reverse Camera Installation": "reverse-camera-ai.png",
  "Premium Seat Upholstery": "seat-upholstery-v2.webp",
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
  "Underseat Subwoofer Installation": "underseat-subwoofer-v2.webp",
  "Boot Subwoofer Installation": "subwoofer.jpg",
  "Bass Tube Installation": "bass-tube-v2.webp",
  "Amplifier Installation": "amplifier-installation-ai.png",
  "Tweeter Installation": "tweeter-install-v2.webp",
  "DSP Tuning & Installation": "dsp-tuning-v2.webp",
  "Door Damping": "door-damping-v2.webp",
  "Floor Damping": "floor-mat.jpg",
  "Wireless Android Auto & Apple CarPlay Dongle": "car-multimedia-call.jpg",
  "Wireless Charger Installation": "phone-charging.jpg",
  "Digital Instrument Cluster": "digital-cluster.jpg",
  "Heads-Up Display (HUD)": "digital-cluster.jpg",
  "Custom Floor Mats": "custom-floor-mat.jpg",
  "USB Fast Charging Ports": "phone-charging.jpg",
  "Dash Camera Installation": "dash-camera.jpg",
  "Rear Seat Display": "rear-seat-display-ai.png",

  // Exterior mods
  "Gloss Black Roof Wrap": "roof-film.jpg",
  "Chrome Delete": "chrome-delete-v2.webp",
  "Full Body Wrap": "wrap-install.jpg",
  "Bonnet Wrap": "wrap-hood.jpg",
  "Roof Wrap": "roof-film.jpg",
  "PPF (Paint Protection Film)": "ppf-door.jpg",
  "Ceramic Coating": "ceramic-coating-bottle-v3.webp",
  "Front Lip / Splitter Installation": "front-lip-splitter-v2.webp",
  "Side Skirt Installation": "side-skirt.jpg",
  "Rear Diffuser Installation": "illuminated-rear-diffuser-v2.webp",
  "Boot Lip Spoiler Installation": "boot-lip-spoiler-v2.webp",
  "Roof Spoiler Installation": "roof-spoiler-v2.webp",
  "Body Kit Installation": "body-kit-install-v2.webp",
  "Alloy Wheel Painting": "black-alloy-wheel.jpg",
  "Brake Caliper Painting": "brake-caliper.jpg",
  "LED Headlamp Upgrade": "led-headlamps-v2.webp",
  "LED Fog Light Upgrade": "led-fog-lights-v2.webp",
  "Custom DRL & Sequential Indicator Upgrade": "custom-drl-v2.webp",
  "Custom JDM-Style Tail Light Upgrade": "jdm-tail-lights-v2.webp",
  "Window Tint Installation": "window-tint.jpg",
  "Rain Visor Installation": "rain-visor-install-v2.webp",
  "Shark Fin Antenna Installation": "shark-fin-antenna-v2.webp",
  "Front Grille Replacement": "jdm-grille-before-after-v2.webp",
  "Emblem Blackout / Badge Replacement": "emblem.jpg",
  "Chrome Garnish": "chrome-garnish-v2.webp",

  // Paint protection services
  "Paint Protection Film (PPF)": "ppf-door.jpg",
  "Graphene Coating": "graphene-coating-bottle-v3.webp",
  "Windshield Protection Film": "windshield-protection-film-v2.webp",
  "Headlight Protection Film": "headlight-protection.jpg",
  "Door Edge PPF": "ppf-door.jpg",
  "Door Cup PPF": "ppf-door.jpg",
  "Roof PPF": "roof-film.jpg",
  "Gloss Paint Protection Film": "protective-film-team.jpg",
  "Matte Paint Protection Film": "protective-film-team.jpg",
  "Ceramic Window Coating": "window-ceramic-bottle-v3.webp",
  "Leather Ceramic Coating": "leather-ceramic-bottle-v3.webp",
  "Alloy Wheel Ceramic Coating": "wheel-ceramic-bottle-v3.webp",
  "Plastic Trim Ceramic Coating": "trim-ceramic-bottle-v3.webp",
  "Fabric Protection Coating": "fabric-protection-bottle-v3.webp",
};

export function getServicePhoto(name: string, category = "") {
  const image = serviceImages[name] ?? serviceImages[category];

  return image ? `${imageBase}${image}` : null;
}

export default function ServicePhoto({
  name,
  category = "",
  variant = "thumbnail",
  className = "",
  imageClassName = "",
  sizes = "96px",
  priority = false,
}: Props) {
  const photo = getServicePhoto(name, category);

  if (!photo) {
    return null;
  }

  const sharedFrame =
    "relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_35px_rgba(0,0,0,0.28)]";
  const frameClass =
    variant === "card"
      ? `${sharedFrame} aspect-[4/3] w-full`
      : variant === "compact-card"
        ? `${sharedFrame} h-[5.5rem] w-full sm:h-auto sm:aspect-[4/3]`
        : variant === "compact-thumbnail"
          ? `${sharedFrame} h-10 w-10 shrink-0 sm:h-14 sm:w-14`
          : `${sharedFrame} h-14 w-14 shrink-0`;

  return (
    <span
      className={`${frameClass} ${className}`}
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
