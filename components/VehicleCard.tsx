"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface VehicleCardProps {
  vehicle: {
    _id: string;
    brand: string;
    name: string;
    type: string;
    description?: string;
    images?: any[];
  };
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const imageUrl = vehicle.images?.[vehicle.images.length - 1]
    ? urlFor(vehicle.images[vehicle.images.length - 1])
        .width(600)
        .height(400)
        .url()
    : "/placeholder-vehicle.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-secondary/50 transition-all duration-300"
    >
      <Link href={`/vehicles/${vehicle._id}`}>
        <div className="relative h-64 w-full bg-white/10">
          <Image
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.name}`}
            fill
            className="object-cover"
            unoptimized={imageUrl.includes("placeholder")}
          />
          {vehicle.type && (
            <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full text-white text-sm font-bold">
              {vehicle.type}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white font-family-cera-stencil mb-2">
            {vehicle.brand} {vehicle.name}
          </h3>
          {vehicle.description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-4">
              {vehicle.description}
            </p>
          )}
          <motion.button
            whileHover={{
              backgroundColor: "#00c950",
              color: "#ffffff",
            }}
            whileTap={{
              backgroundColor: "#00a63e",
              scale: 0.95,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
            className="w-full py-2 rounded-full border-2 border-secondary text-secondary font-bold transition-colors"
          >
            View Details
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
