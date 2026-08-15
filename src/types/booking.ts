export type BookingStatus = "Pending" | "Accepted" | "Declined" | "Completed";

export type Booking = {
  id: string;
  member: string;
  email: string;
  packageId: string;
  packageName: string;
  guideId: string;
  guide: string;
  startDate: string;
  date: string;
  guests: number;
  value: number;
  rateLabel: string;
  addOns: string[];
  supportNeeds: string[];
  supportNotes: string;
  contact?: string;
  identityDocument?: string;
  travellerType?: string;
  preferences?: Record<string, string>;
  participants?: Array<{ name: string; email: string; contact: string; identityDocument?: string; disabilityType?: string }>;
  status: BookingStatus;
  createdAt: string;
};

export type NewBooking = Omit<Booking, "id" | "date" | "status" | "createdAt">;
