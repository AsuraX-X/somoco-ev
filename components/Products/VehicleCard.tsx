"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface KeyParameter {
  name: string;
  value: string;
}

type Specifications = {
  keyParameters?: KeyParameter[];
} & Record<string, unknown>;

interface Vehicle {
  _id: string;
  brand: string;
  name: string;
  type: string;
  description?: string;
  images?: string[];
  specifications?: Specifications;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}
const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const imageUrl = vehicle.images?.[0]
    ? urlFor(vehicle.images[0]).width(600).height(400).url()
    : "/placeholder-vehicle.jpg";

  // Get first three key parameters if available
  const keyParams: { name: string; value: string }[] =
    vehicle.specifications?.keyParameters?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-xl overflow-hidden transition-all duration-300"
    >
      <div className="relative h-64 w-full bg-white/10">
        <Link href={`/vehicles/${vehicle._id}`}>
          <Image
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.name}`}
            fill
            className="object-cover"
            unoptimized={imageUrl.includes("placeholder")}
          />
        </Link>
        {vehicle.type && (
          <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full text-black text-sm font-bold">
            {vehicle.type}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white font-family-cera-stencil mb-2">
          {vehicle.brand} {vehicle.name}
        </h3>
        {vehicle.description && (
          <p className="text-white/70 text-sm line-clamp-2 mb-2">
            {vehicle.description}
          </p>
        )}
        {/* Key Parameters */}
        {keyParams.length > 0 && (
          <div className="mb-4">
            <ul className="text-white/80 text-xs space-y-1">
              {keyParams.map((param, idx) => (
                <li key={idx}>
                  <span className="font-semibold text-secondary">
                    {param.name}:
                  </span>{" "}
                  {param.value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-2">
          <motion.button
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{
              backgroundColor: "#cecece",
              scale: 0.95,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
            className="w-full flex justify-center items-center py-2 rounded-full border border-secondary text-secondary font-bold transition-colors"
          >
            <Link className="w-full h-full" href={`/vehicles/${vehicle._id}`}>
              View Details
            </Link>
          </motion.button>

          <motion.button
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{
              backgroundColor: "#cecece",
              scale: 0.95,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
            className="w-full flex justify-center items-center py-2 rounded-full border border-secondary text-secondary font-bold transition-colors"
          >
            <Link
              className="w-full h-full"
              href={`/products/compare?first=${vehicle._id}`}
            >
              Compare
            </Link>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
