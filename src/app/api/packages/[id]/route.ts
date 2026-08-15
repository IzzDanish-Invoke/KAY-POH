import { deletePackage, updatePackage } from "@/lib/package-store";
import type { TourPackage } from "@/types/tour-package";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as TourPackage;
    if (!body.title?.trim() || !body.days?.trim() || Number(body.price) < 0) {
      return Response.json({ error: "Name, duration, and a valid price are required." }, { status: 400 });
    }
    const updated = await updatePackage(id, body);
    return updated ? Response.json(updated) : Response.json({ error: "Package not found." }, { status: 404 });
  } catch {
    return Response.json({ error: "Unable to update package." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await deletePackage(id) ? new Response(null, { status: 204 }) : Response.json({ error: "Package not found." }, { status: 404 });
  } catch {
    return Response.json({ error: "Unable to delete package." }, { status: 500 });
  }
}
