import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LiveTour, RatingResponse } from "@/types/live-tour";
import type { TourPackage } from "@/types/tour-package";
import type { Booking } from "@/types/booking";

const toursFile = path.join(process.cwd(), "src", "data", "live-tours.json");
const responsesFile = path.join(process.cwd(), "src", "data", "rating-responses.json");
const packagesFile = path.join(process.cwd(), "src", "data", "packages.json");
const bookingsFile = path.join(process.cwd(), "src", "data", "bookings.json");
async function read<T>(file: string): Promise<T[]> { return JSON.parse(await readFile(file, "utf8")) as T[]; }
async function write<T>(file: string, records: T[]) { const temporary = `${file}.tmp`; await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, "utf8"); await rename(temporary, file); }
const moduleId = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export async function getLiveTours() {
  const [tours, packages, bookings] = await Promise.all([read<LiveTour>(toursFile), read<TourPackage>(packagesFile), read<Booking>(bookingsFile)]);
  return tours.map((tour) => {
    const booking = bookings.find((item) => item.id === tour.bookingId);
    const bookingDetails = booking ? { requester: booking.member, requesterEmail: booking.email } : {};
    if (!tour.packageId || !tour.day) return { ...tour, ...bookingDetails };
    const itineraryDay = packages.find((item) => item.id === tour.packageId)?.itinerary.find((item) => item.day === tour.day);
    if (!itineraryDay) return { ...tour, ...bookingDetails };
    return {
      ...tour,
      ...bookingDetails,
      modules: itineraryDay.items.map((item) => {
        const id = moduleId(item.activity);
        const existing = tour.modules.find((module) => module.id === id);
        return { id, time: item.time, title: item.activity, venue: existing?.venue || "Venue to be confirmed", status: existing?.status || "Upcoming" as const };
      }),
    };
  });
}
export const getRatingResponses = () => read<RatingResponse>(responsesFile);
export async function updateLiveTour(id: string, input: LiveTour) { const records = await getLiveTours(); const index = records.findIndex((item) => item.id === id); if (index < 0) return null; records[index] = { ...input, id }; await write(toursFile, records); return records[index]; }
export async function addRatingResponse(input: Omit<RatingResponse, "id" | "submittedAt">) { const records = await getRatingResponses(); const nextNumber = records.reduce((max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0), 0) + 1; const record: RatingResponse = { ...input, id: `R-${nextNumber}`, submittedAt: new Intl.DateTimeFormat("en-MY", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kuala_Lumpur" }).format(new Date()) }; await write(responsesFile, [...records, record]); return record; }
