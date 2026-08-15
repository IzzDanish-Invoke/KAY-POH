import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NewTourPackage, TourPackage } from "@/types/tour-package";

const packageFile = path.join(process.cwd(), "src", "data", "packages.json");
const temporaryPackageFile = `${packageFile}.tmp`;

export async function getPackages(): Promise<TourPackage[]> {
  return JSON.parse(await readFile(packageFile, "utf8")) as TourPackage[];
}

async function savePackages(packages: TourPackage[]) {
  await writeFile(temporaryPackageFile, `${JSON.stringify(packages, null, 2)}\n`, "utf8");
  await rename(temporaryPackageFile, packageFile);
}

function slug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-package";
}

export async function addPackage(input: NewTourPackage): Promise<TourPackage> {
  const packages = await getPackages();
  const baseId = slug(input.id || input.title);
  let id = baseId;
  let suffix = 2;
  while (packages.some((item) => item.id === id)) id = `${baseId}-${suffix++}`;
  const packageRecord = { ...input, id } as TourPackage;
  await savePackages([...packages, packageRecord]);
  return packageRecord;
}

export async function updatePackage(id: string, input: TourPackage): Promise<TourPackage | null> {
  const packages = await getPackages();
  const index = packages.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...input, id };
  const next = [...packages];
  next[index] = updated;
  await savePackages(next);
  return updated;
}

export async function deletePackage(id: string): Promise<boolean> {
  const packages = await getPackages();
  const next = packages.filter((item) => item.id !== id);
  if (next.length === packages.length) return false;
  await savePackages(next);
  return true;
}
