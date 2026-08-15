import { notFound } from "next/navigation";
import RatingExperience from "@/components/RatingExperience";
import { liveTours } from "@/data/data";
import "./rating.css";

export function generateStaticParams() {
  return liveTours.flatMap((tour) => tour.modules.map((module) => ({ tourId: tour.id, moduleId: module.id })));
}

export default async function RatingPage({ params }: PageProps<"/rate/[tourId]/[moduleId]">) {
  const { tourId, moduleId } = await params;
  const tour = liveTours.find((item) => item.id === tourId);
  const tripModule = tour?.modules.find((item) => item.id === moduleId);
  if (!tour || !tripModule) notFound();
  return <RatingExperience tour={tour} module={tripModule} />;
}
