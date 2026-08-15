import { deleteTourGuide, updateTourGuide } from "@/lib/tour-guide-store";
import type { GuideStatus, TourGuide } from "@/types/tour-guide";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses: GuideStatus[] = ["Available", "On tour", "Off duty"];

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
    : [];
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as TourGuide;
    if (!body.name?.trim() || !body.title?.trim() || !body.expertise?.trim()) {
      return Response.json({ error: "Name, guide title, and expertise are required." }, { status: 400 });
    }

    const guide: TourGuide = {
      ...body,
      id,
      name: body.name.trim(),
      title: body.title.trim(),
      bio: body.bio?.trim() || "KAYPOH trip companion profile.",
      expertise: body.expertise.trim(),
      languages: stringList(body.languages),
      specialties: stringList(body.specialties),
      perks: stringList(body.perks),
      status: statuses.includes(body.status) ? body.status : "Available",
      yearsExperience: Math.max(0, Number(body.yearsExperience) || 0),
    };
    const updated = await updateTourGuide(id, guide);
    return updated
      ? Response.json(updated)
      : Response.json({ error: "Tour guide not found." }, { status: 404 });
  } catch {
    return Response.json({ error: "Unable to update the tour guide." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await deleteTourGuide(id)
      ? new Response(null, { status: 204 })
      : Response.json({ error: "Tour guide not found." }, { status: 404 });
  } catch {
    return Response.json({ error: "Unable to delete the tour guide." }, { status: 500 });
  }
}
