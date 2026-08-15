"use client";

import { useEffect, useState } from "react";
import { packages as initialPackages } from "@/data/data";
import type { TourPackage } from "@/types/tour-package";

export function usePackages({ includeDrafts = false } = {}) {
  const [packages, setPackages] = useState<TourPackage[]>(initialPackages as TourPackage[]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/packages", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<TourPackage[]> : Promise.reject())
      .then(setPackages)
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return includeDrafts ? packages : packages.filter((item) => item.published);
}
