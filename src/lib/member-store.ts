import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Member } from "@/types/member";
const file = path.join(process.cwd(), "src", "data", "members.json");
const get = async () => JSON.parse(await readFile(file, "utf8")) as Member[];
const save = async (records: Member[]) => { const temporary = `${file}.tmp`; await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, "utf8"); await rename(temporary, file); };
export const getMembers = get;
export async function addMember(input: Omit<Member, "id">) { const records = await get(); const number = records.reduce((max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0), 0) + 1; const record = { ...input, id: `KP-M${number}` }; await save([...records, record]); return record; }
export async function updateMember(id: string, input: Member) { const records = await get(); const index = records.findIndex((item) => item.id === id); if (index < 0) return null; records[index] = { ...input, id }; await save(records); return records[index]; }
