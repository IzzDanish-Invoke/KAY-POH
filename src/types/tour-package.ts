export type ItineraryItem = { time: string; activity: string; note: string };
export type ItineraryDay = { day: number; label: string; title: string; items: ItineraryItem[] };
export type PackageRate = { label: string; price: number; note?: string };

export type TourPackage = {
  id: string;
  tag: string;
  days: string;
  title: string;
  color: string;
  price: number;
  currency: string;
  rates: PackageRate[];
  description: string;
  highlights: string[];
  includes: string[];
  notIncluded: string[];
  notices: string[];
  supportArrangement?: string;
  accessibility: { mobility: string; pace: string; support: string; venue: string };
  itinerary: ItineraryDay[];
  published: boolean;
};

export type NewTourPackage = Omit<TourPackage, "id"> & { id?: string };
