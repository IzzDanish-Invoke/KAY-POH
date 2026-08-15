import { addBooking, getBookings } from "@/lib/booking-store";
import type { NewBooking } from "@/types/booking";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function GET() { try { return Response.json(await getBookings(), { headers: { "Cache-Control": "no-store" } }); } catch { return Response.json({ error: "Unable to load bookings." }, { status: 500 }); } }
export async function POST(request: Request) { try { const body = await request.json() as NewBooking; if (!body.member?.trim() || !body.email?.trim() || !body.startDate || !body.packageId || !body.guideId || body.guests < 1) return Response.json({ error: "Traveller, date, package, and guide details are required." }, { status: 400 }); return Response.json(await addBooking(body), { status: 201 }); } catch { return Response.json({ error: "Unable to create booking." }, { status: 500 }); } }
