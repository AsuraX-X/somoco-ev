"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

import type { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
}
const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const MLink = motion.create(Link);

  const imageUrl = vehicle.images?.[0]
    ? urlFor(vehicle.images[0]).width(600).height(400).url()
    : "/placeholder-vehicle.jpg";

  // Get first three key parameters if available
  const keyParams: { name: string; value: string }[] =
    vehicle.specifications?.keyParameters?.slice(0, 3) || [];

  const saveScrollBeforeNav = () => {
    try {
      if (typeof window !== "undefined") {
        // store current scroll position so we can restore it when returning
        sessionStorage.setItem(
          "products:scrollY",
          String(window.scrollY || window.pageYOffset || 0)
        );
        // also persist current page (if any)
        const p = localStorage.getItem("products:page");
        if (p) localStorage.setItem("products:page", p);
      }
    } catch {
      // noop
    }
  };

  // Preserve the current query string when navigating so listing state is
  // preserved in the URL (q/type/brand/page). This avoids relying solely on
  // sessionStorage when users navigate back/forward or share links.
  const currentSearch =
    typeof window !== "undefined" ? window.location.search || "" : "";
  const buildHref = (base: string) =>
    currentSearch
      ? base.includes("?")
        ? `${base}&${currentSearch.slice(1)}`
        : `${base}${currentSearch}`
      : base;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-xl w-full overflow-hidden transition-all duration-300"
    >
      <div className="relative h-64 w-full bg-white/10">
        <Link
          href={buildHref(`/vehicles/${vehicle._id}`)}
          onClick={saveScrollBeforeNav}
        >
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
          <MLink
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{
              backgroundColor: "#cecece",
              color: "#000000",
              scale: 0.95,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
            className="w-full flex h-full justify-center items-center py-2 rounded-full border border-secondary text-secondary font-bold transition-colors"
            href={buildHref(`/vehicles/${vehicle._id}`)}
            onClick={saveScrollBeforeNav}
          >
            <button>View Details</button>
          </MLink>
          <MLink
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{
              backgroundColor: "#cecece",
              color: "#000000",
              scale: 0.95,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
            className="w-full flex justify-center items-center py-2 rounded-full border border-secondary text-secondary font-bold transition-colors"
            href={buildHref(`/products/compare?first=${vehicle._id}`)}
            onClick={saveScrollBeforeNav}
          >
            <button>Compare</button>
          </MLink>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
