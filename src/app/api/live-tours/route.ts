import { getLiveTours } from "@/lib/live-tour-store";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function GET() { try { return Response.json(await getLiveTours(), { headers: { "Cache-Control": "no-store" } }); } catch { return Response.json({ error: "Unable to load live tours." }, { status: 500 }); } }
