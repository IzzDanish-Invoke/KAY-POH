import { addMember, getMembers } from "@/lib/member-store";
import type { Member } from "@/types/member";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function GET() { try { return Response.json(await getMembers(), { headers: { "Cache-Control": "no-store" } }); } catch { return Response.json({ error: "Unable to load members." }, { status: 500 }); } }
export async function POST(request: Request) { try { return Response.json(await addMember(await request.json() as Omit<Member, "id">), { status: 201 }); } catch { return Response.json({ error: "Unable to create member." }, { status: 500 }); } }
