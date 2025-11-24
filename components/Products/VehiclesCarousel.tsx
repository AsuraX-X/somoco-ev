"use client";

import React, { useEffect, useState, useCallback } from "react";
import VehicleCard from "@/components/General/VehicleCard";
import type { Vehicle } from "@/types/vehicle";
import { motion } from "motion/react";

const VehiclesCarousel = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

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

  // Get unique vehicle types
  const vehicleTypes = Array.from(
    new Set(
      vehicles
        .map((v) => v.type)
        .filter((type): type is string => Boolean(type))
    )
  );

  // Filter vehicles based on selected type
  const filteredVehicles = filter
    ? vehicles.filter((v) => v.type === filter)
    : vehicles;

  if (loading) {
    return (
      <div className="flex gap-8 overflow-auto">
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
          tabIndex={0}
          className="flex gap-4 py-8 overflow-auto hide-scrollbar focus:outline-none"
          role="region"
          aria-label="Vehicles carousel"
        >
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="shrink-0 w-full sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[28vw]"
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehiclesCarousel;
