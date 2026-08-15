import { addPackage, getPackages } from "@/lib/package-store";
import type { NewTourPackage } from "@/types/tour-package";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await getPackages(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to load packages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as NewTourPackage;
    if (!body.title?.trim() || !body.days?.trim() || Number(body.price) < 0) {
      return Response.json({ error: "Name, duration, and a valid price are required." }, { status: 400 });
    }
    return Response.json(await addPackage(body), { status: 201 });
  } catch {
    return Response.json({ error: "Unable to create package." }, { status: 500 });
  }
}
