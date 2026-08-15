export type GuideStatus = "Available" | "On tour" | "Off duty";

export type GuideTestimonial = {
  quote: string;
  guest: string;
};

export type TourGuide = {
  id: string;
  name: string;
  email?: string;
  initials: string;
  title: string;
  bio: string;
  languages: string[];
  specialties: string[];
  rating: number;
  reviews: number;
  tours: number;
  acceptance: number;
  status: GuideStatus;
  color: string;
  licensed: boolean;
  yearsExperience: number;
  expertise: string;
  perks: string[];
  testimonials: GuideTestimonial[];
};

export type NewTourGuide = Pick<
  TourGuide,
  | "name"
  | "email"
  | "title"
  | "bio"
  | "languages"
  | "specialties"
  | "status"
  | "licensed"
  | "yearsExperience"
  | "expertise"
  | "perks"
>;
