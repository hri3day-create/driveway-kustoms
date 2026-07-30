export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;

  // Used for detailing
  price?: number;

  // Used for mods & protection
  startingPrice?: string;

  // Optional note
  note?: string;

  popular?: boolean;
}

export interface BookingData {
  fullName: string;
  phone: string;
  email: string;
  registration: string;
  address: string;
  date: string;
  time: string;
  notes: string;
}