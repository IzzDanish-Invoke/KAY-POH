import { notFound } from "next/navigation";
import RatingExperience from "@/components/RatingExperience";
import { getLiveTours } from "@/lib/live-tour-store";
import "./rating.css";
export const dynamic = "force-dynamic";
export default async function RatingPage({ params }: PageProps<"/rate/[tourId]/[moduleId]">) { const { tourId, moduleId } = await params; const tour = (await getLiveTours()).find((item) => item.id === tourId); const tripModule = tour?.modules.find((item) => item.id === moduleId); if (!tour || !tripModule) notFound(); return <RatingExperience tour={tour} module={tripModule} />; }
