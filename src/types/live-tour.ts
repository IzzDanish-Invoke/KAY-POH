export type LiveTourModule = {
  id: string; time: string; title: string; venue: string;
  status: "Completed" | "Rating open" | "Next" | "Upcoming";
};
export type LiveTour = {
  id: string; bookingId: string; title: string; date: string; time: string;
  packageId?: string; day?: number;
  requester?: string; requesterEmail?: string;
  status: "Upcoming" | "Live" | "Starting soon" | "Completed";
  guideId: string; guide: string; guests: number; vehicle: string; progress: number;
  modules: LiveTourModule[];
};
export type RatingResponse = {
  id: string; tourId: string; moduleId: string; rating: number; tags: string[];
  comment: string; submittedAt: string; anonymous: boolean;
};
