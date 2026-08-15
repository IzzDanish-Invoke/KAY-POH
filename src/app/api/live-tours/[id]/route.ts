import { updateLiveTour } from "@/lib/live-tour-store";
import type { LiveTour } from "@/types/live-tour";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const { id } = await params; const body = await request.json() as LiveTour; const result = await updateLiveTour(id, body); return result ? Response.json(result) : Response.json({ error: "Tour not found." }, { status: 404 }); } catch { return Response.json({ error: "Unable to update live tour." }, { status: 500 }); } }
