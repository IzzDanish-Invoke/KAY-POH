import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Booking, BookingStatus, NewBooking } from "@/types/booking";
import type { LiveTour } from "@/types/live-tour";
import type { TourPackage } from "@/types/tour-package";
import type { Member } from "@/types/member";

const bookingsFile = path.join(process.cwd(), "src", "data", "bookings.json");
const toursFile = path.join(process.cwd(), "src", "data", "live-tours.json");
const packagesFile = path.join(process.cwd(), "src", "data", "packages.json");
const guidesFile = path.join(process.cwd(), "src", "data", "tour-guides.json");
const membersFile = path.join(process.cwd(), "src", "data", "members.json");
const read = async <T>(file: string) => JSON.parse(await readFile(file, "utf8")) as T[];
async function write<T>(file: string, records: T[]) { const temporary = `${file}.tmp`; await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`); await rename(temporary, file); }
const formatDay = (date: Date) => new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
const rangeLabel = (startDate: string, days: number) => {
  const start = new Date(`${startDate}T00:00:00Z`); const end = new Date(start); end.setUTCDate(end.getUTCDate() + Math.max(days - 1, 0));
  return days > 1 ? `${formatDay(start).replace(/ \w+ \d+$/, "")}–${formatDay(end)}` : formatDay(start);
};

export async function getBookings() {
  const bookings = await read<Booking>(bookingsFile);
  return bookings.sort((a, b) => {
    const byCreatedAt = Date.parse(b.createdAt) - Date.parse(a.createdAt);
    if (Number.isFinite(byCreatedAt) && byCreatedAt !== 0) return byCreatedAt;
    return Number(b.id.replace(/\D/g, "")) - Number(a.id.replace(/\D/g, ""));
  });
}

export async function addBooking(input: NewBooking) {
  const records = await getBookings();
  const next = records.reduce((max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0), 0) + 1;
  const packages = await read<TourPackage>(packagesFile); const pkg = packages.find((item) => item.id === input.packageId);
  const record: Booking = { ...input, id: `KP-B${next}`, date: rangeLabel(input.startDate, pkg?.itinerary.length || 1), status: "Pending", createdAt: new Date().toISOString() };
  const members = await read<Member>(membersFile);
  const memberIndex = members.findIndex((item) => item.email.toLowerCase() === input.email.toLowerCase());
  if (memberIndex >= 0) {
    members[memberIndex] = { ...members[memberIndex], name: input.member, bookings: members[memberIndex].bookings + 1, status: "Active" };
  } else {
    const nextMember = members.reduce((max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0), 0) + 1;
    const initials = input.member.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "KT";
    members.unshift({ id: `KP-M${nextMember}`, name: input.member, email: input.email, joined: formatDay(new Date()), bookings: 1, spent: 0, status: "New", initials });
  }
  await Promise.all([write(bookingsFile, [...records, record]), write(membersFile, members)]); return record;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const [bookings, tours, packages, guides] = await Promise.all([getBookings(), read<LiveTour>(toursFile), read<TourPackage>(packagesFile), read<{ id: string; name: string }>(guidesFile)]);
  const index = bookings.findIndex((item) => item.id === id); if (index < 0) return null;
  const booking = { ...bookings[index], status }; bookings[index] = booking;
  if (status === "Accepted") {
    const pkg = packages.find((item) => item.id === booking.packageId); const guide = guides.find((item) => item.id === booking.guideId);
    if (!pkg || !guide) throw new Error("The assigned package or guide no longer exists.");
    const start = new Date(`${booking.startDate}T00:00:00Z`);
    const generated = pkg.itinerary.map((day, index) => {
      const date = new Date(start); date.setUTCDate(date.getUTCDate() + index);
      const existing = tours.find((tour) => tour.bookingId === booking.id && tour.day === day.day);
      return { ...(existing ?? {}), id: existing?.id ?? `tour-${booking.id.toLowerCase()}-day-${day.day}`, bookingId: booking.id, packageId: pkg.id, day: day.day, requester: booking.member, requesterEmail: booking.email, title: `${pkg.title} · Day ${day.day}`, date: formatDay(date), time: day.items.length ? `${day.items[0].time}–${day.items.at(-1)?.time}` : "To be confirmed", status: existing?.status ?? "Upcoming", guideId: guide.id, guide: guide.name, guests: booking.guests, vehicle: existing?.vehicle ?? "To be assigned", progress: existing?.progress ?? 0, modules: existing?.modules ?? [] } satisfies LiveTour;
    });
    const otherTours = tours.filter((tour) => tour.bookingId !== booking.id); await write(toursFile, [...otherTours, ...generated]);
  }
  if (status === "Declined") await write(toursFile, tours.filter((tour) => tour.bookingId !== booking.id));
  await write(bookingsFile, bookings); return booking;
}
