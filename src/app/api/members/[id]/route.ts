import { updateMember } from "@/lib/member-store";
import type { Member } from "@/types/member";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const { id } = await params; const result = await updateMember(id, await request.json() as Member); return result ? Response.json(result) : Response.json({ error: "Member not found." }, { status: 404 }); } catch { return Response.json({ error: "Unable to update member." }, { status: 500 }); } }
