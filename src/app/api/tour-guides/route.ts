import { addTourGuide, getTourGuides } from "@/lib/tour-guide-store";
import type { GuideStatus, NewTourGuide } from "@/types/tour-guide";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses: GuideStatus[] = ["Available", "On tour", "Off duty"];

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
    : [];
}

export async function GET() {
  try {
    return Response.json(await getTourGuides(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Unable to load tour guides." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const expertise = typeof body.expertise === "string" ? body.expertise.trim() : "";

    if (!name || !title || !expertise) {
      return Response.json({ error: "Name, guide title, and expertise are required." }, { status: 400 });
    }

    const requestedStatus = typeof body.status === "string" ? body.status : "Available";
    const guideInput: NewTourGuide = {
      name,
      email: typeof body.email === "string" ? body.email.trim() : undefined,
      title,
      bio: typeof body.bio === "string" && body.bio.trim() ? body.bio.trim() : "New KAYPOH trip companion profile.",
      languages: stringList(body.languages),
      specialties: stringList(body.specialties),
      status: statuses.includes(requestedStatus as GuideStatus) ? requestedStatus as GuideStatus : "Available",
      licensed: body.licensed === true,
      yearsExperience: Math.max(0, Number(body.yearsExperience) || 0),
      expertise,
      perks: stringList(body.perks),
    };

    return Response.json(await addTourGuide(guideInput), { status: 201 });
  } catch {
    return Response.json({ error: "Unable to create the tour guide." }, { status: 500 });
  }
}
