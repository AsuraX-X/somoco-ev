import VehicleDetailsPage from "@/components/VehicleContent";
import React from "react";
import { client } from "@/sanity/lib/client";
import type { Metadata } from "next";

/**
 * Dynamically generate per-vehicle metadata for better SEO.
 * Falls back to a sensible default when the vehicle can't be fetched.
 */
export async function generateMetadata(props: unknown): Promise<Metadata> {
  let id: string | undefined = undefined;
  if (typeof props === "object" && props !== null && "params" in props) {
    const p = props as { params?: { id?: string } };
    id = p.params?.id;
  }

  try {
    const vehicle = await client.fetch(
      `*[_type == "event" && _id == $id][0]{name, brand, description, exteriorImages[0]}`,
      { id }
    );

    if (!vehicle) {
      return {
        title: "Vehicle Details — SOMOCO EV",
        description:
          "Technical specifications and images for the selected vehicle.",
      };
    }

    const titleParts: string[] = [];
    if (vehicle.brand) titleParts.push(vehicle.brand);
    if (vehicle.name) titleParts.push(vehicle.name);
    const title =
      titleParts.length > 0
        ? `${titleParts.join(" ")} — SOMOCO EV`
        : "Vehicle Details — SOMOCO EV";

    const description = vehicle.description
      ? vehicle.description
      : `Specifications, images and details for ${
          vehicle.name ?? "this vehicle"
        }.`;

    const metadata: Metadata = {
      title,
      description,
      // Optionally include Open Graph image if available
      openGraph: vehicle.exteriorImages?.[0]
        ? {
            images: [vehicle.exteriorImages[0]],
            title,
            description,
          }
        : undefined,
    };

    return metadata;
  } catch (error) {
    // On error, return defaults so the page still has usable metadata
    console.error("generateMetadata error for vehicle", id, error);
    return {
      title: "Vehicle Details — SOMOCO EV",
      description:
        "Technical specifications and images for the selected vehicle.",
    };
  }
}

const page = () => {
  return (
    <div>
      <VehicleDetailsPage />
    </div>
  );
};

export default page;
