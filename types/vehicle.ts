// Import the Sanity-generated Event type locally so we can reference it in this file
import type { Event as Vehicle } from "@/sanity.types";

// Re-export for convenience
export type { Vehicle };

// Extended Vehicle type with combined images for component usage
export type VehicleWithImages = Vehicle & {
  // combined images array used by components (exterior then interior in upload order)
  images?: Vehicle["exteriorImages"];
};
