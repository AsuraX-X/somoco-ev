"use client";
import React from "react";
import VehiclesCarousel from "@/components/Products/VehiclesCarousel";

const Find = () => {
  return (
    <div className="py-10 px-4 sm:px-6 w-full h-full bg-primary">
      <h2 className="text-3xl font-family-cera-stencil text-center font-bold mb-4">Find Your Dream Car</h2>
      <VehiclesCarousel />
    </div>
  );
};

export default Find;
