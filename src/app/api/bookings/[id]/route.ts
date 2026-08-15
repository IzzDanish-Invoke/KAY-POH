import { updateBookingStatus } from "@/lib/booking-store";
import type { BookingStatus } from "@/types/booking";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
const statuses: BookingStatus[] = ["Pending", "Accepted", "Declined", "Completed"];
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const { id } = await params; const { status } = await request.json() as { status: BookingStatus }; if (!statuses.includes(status)) return Response.json({ error: "Invalid booking status." }, { status: 400 }); const booking = await updateBookingStatus(id, status); return booking ? Response.json(booking) : Response.json({ error: "Booking not found." }, { status: 404 }); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Unable to update booking." }, { status: 500 }); } }
