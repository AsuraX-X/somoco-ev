"use client";
import React, { useState } from "react";
import { locations } from "./locations";
import LocationSection from "./LocationSection";

const Locations = () => {
  const [openLocation, setOpenLocation] = useState<number | null>(0);
  return (
    <div className="px-6 sm:px-32">
      <h2 className="font-family-cera-stencil text-3xl font-bold mb-8 border-b-2 border-secondary mx-auto w-fit px-4">
        Branches
      </h2>

      {locations.map((loc, i) => (
        <LocationSection
          key={i}
          s={setOpenLocation}
          o={openLocation}
          index={i}
          location={loc}
        />
      ))}
    </div>
  );
};

export default Locations;
