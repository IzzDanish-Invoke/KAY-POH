import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NewTourGuide, TourGuide } from "@/types/tour-guide";

const guideFile = path.join(process.cwd(), "src", "data", "tour-guides.json");
const temporaryGuideFile = `${guideFile}.tmp`;

async function saveTourGuides(guides: TourGuide[]) {
  await writeFile(temporaryGuideFile, `${JSON.stringify(guides, null, 2)}\n`, "utf8");
  await rename(temporaryGuideFile, guideFile);
}

export async function getTourGuides(): Promise<TourGuide[]> {
  const contents = await readFile(guideFile, "utf8");
  return JSON.parse(contents) as TourGuide[];
}

export async function addTourGuide(input: NewTourGuide): Promise<TourGuide> {
  const guides = await getTourGuides();
  const highestGuideNumber = guides.reduce((highest, guide) => {
    const match = guide.id.match(/^KP-G(\d+)$/);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0);
  const initials = input.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NG";

  const guide: TourGuide = {
    ...input,
    id: `KP-G${String(highestGuideNumber + 1).padStart(3, "0")}`,
    initials,
    rating: 0,
    reviews: 0,
    tours: 0,
    acceptance: 0,
    color: "aqua",
    testimonials: [],
  };

  await saveTourGuides([...guides, guide]);
  return guide;
}

export async function updateTourGuide(id: string, input: TourGuide): Promise<TourGuide | null> {
  const guides = await getTourGuides();
  const index = guides.findIndex((guide) => guide.id === id);
  if (index === -1) return null;

  const initials = input.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || guides[index].initials;
  const guide = { ...input, id, initials };
  const nextGuides = [...guides];
  nextGuides[index] = guide;
  await saveTourGuides(nextGuides);
  return guide;
}

export async function deleteTourGuide(id: string): Promise<boolean> {
  const guides = await getTourGuides();
  const nextGuides = guides.filter((guide) => guide.id !== id);
  if (nextGuides.length === guides.length) return false;
  await saveTourGuides(nextGuides);
  return true;
}
