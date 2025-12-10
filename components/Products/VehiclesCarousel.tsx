"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import VehicleCard from "@/components/General/VehicleCard";
import type { Vehicle } from "@/types/vehicle";
import { motion } from "motion/react";

const VehiclesCarousel = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch vehicles
  const fetchVehicles = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const seen = new Set<string>();
          const unique = data.data.filter((v: Vehicle) => {
            if (!v?._id || seen.has(v._id)) return false;
            seen.add(v._id);
            return true;
          });
          setVehicles(unique);
        } else {
          setError("Failed to load vehicles");
        }
      })
      .catch((err) => {
        setError(err?.message || "Failed to load vehicles");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Get unique vehicle types in specific order
  const desiredOrder = ["Sedan", "SUV", "Hatchback", "MPV"];
  const vehicleTypesSet = new Set(
    vehicles.map((v) => v.type).filter((type): type is string => Boolean(type))
  );
  const vehicleTypes = desiredOrder.filter((type) => vehicleTypesSet.has(type));

  // Filter vehicles based on selected type
  const filteredVehicles = filter
    ? vehicles.filter((v) => v.type === filter)
    : vehicles;

  // Sort vehicles by ranking (lower numbers first)
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    const aRanking = a.ranking ?? Infinity; // Vehicles without ranking go to the end
    const bRanking = b.ranking ?? Infinity;
    return aRanking - bRanking;
  });

  if (loading) {
    return (
      <div className="flex gap-8 overflow-auto">
        <div className="h-[530px] w-[390px] shrink-0 bg-white/20 rounded-lg animate-pulse " />
        <div className="h-[530px] w-[390px] shrink-0 bg-white/20 rounded-lg animate-pulse " />
        <div className="h-[530px] w-[390px] shrink-0 bg-white/20 rounded-lg animate-pulse " />
        <div className="h-[530px] w-[390px] shrink-0 bg-white/20 rounded-lg animate-pulse " />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchVehicles}
          className="px-6 py-2 bg-secondary text-primary rounded-full hover:bg-secondary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="py-12 text-center text-secondary">
        <p>No vehicles available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full items-center justify-center flex gap-3 flex-wrap mb-8">
        <motion.button
          whileHover={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
          whileTap={{
            backgroundColor: "#cecece",
            color: "#000000",
          }}
          animate={{
            backgroundColor: filter === "" ? "#ffffff" : "#001014",
            color: filter === "" ? "#000000" : "#ffffff",
          }}
          onClick={() => setFilter("")}
          className="border-secondary cursor-pointer border rounded-full px-4 py-2"
        >
          All
        </motion.button>
        {vehicleTypes.map((type) => (
          <motion.button
            key={type}
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{
              backgroundColor: "#cecece",
              color: "#000000",
            }}
            animate={{
              backgroundColor: filter === type ? "#ffffff" : "#001014",
              color: filter === type ? "#000000" : "#ffffff",
            }}
            onClick={() => setFilter(type)}
            className="border-secondary cursor-pointer border rounded-full px-4 py-2"
          >
            {type}
          </motion.button>
        ))}
      </div>
      <div className="relative w-full">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          tabIndex={0}
          className="flex gap-4 py-8 overflow-auto hide-scrollbar focus:outline-none"
          role="region"
          aria-label="Vehicles carousel"
        >
          {sortedVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="shrink-0 w-full sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[28vw]"
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
          }}
          transition={{ duration: 3 }}
          className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none"
        >
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-secondary/80 backdrop-blur-sm rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VehiclesCarousel;
