"use client";

import { useEffect, useState } from "react";
import { tourGuides as initialTourGuides } from "@/data/data";
import type { TourGuide } from "@/types/tour-guide";

export function useTourGuides() {
  const [tourGuides, setTourGuides] = useState<TourGuide[]>(initialTourGuides as TourGuide[]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/tour-guides", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<TourGuide[]> : Promise.reject())
      .then(setTourGuides)
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return tourGuides;
}
