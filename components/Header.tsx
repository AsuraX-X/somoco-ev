"use client";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const Cd = motion.create(ChevronDown);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch unique vehicle types from the database
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const result = await response.json();

        // Extract unique types from vehicles
        const types = [
          ...new Set(result.data.map((v: any) => v.type).filter(Boolean)),
        ];
        setVehicleTypes(types as string[]);
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  return (
    <div className="fixed top-0 w-full z-100">
      <div className=" hidden sm:block text-white">
        <div className="flex justify-between px-12 py-4">
          <Link href={"/"}>
            <div className="font-family-cera-stencil font-bold text-2xl gap-1 flex">
              <Image
                unoptimized
                src="/LogoIconAlt.svg"
                height={40}
                width={40}
                alt="Somoco Logo"
              />{" "}
              <h1>SOMOCO EV</h1>
            </div>
          </Link>
          <div className="flex gap-6 items-center">
            {pathname !== "/" && (
              <Link href={"/"}>
                <button className="cursor-pointer">Home</button>
              </Link>
            )}

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="cursor-pointer flex items-center gap-1">
                Products
                <Cd
                  animate={{ rotate: isDropdownOpen ? 180 : [180, 0] }}
                  size={20}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-primary border border-secondary/20 rounded-lg shadow-lg min-w-[200px]">
                  {isLoading ? (
                    <div className="px-4 py-2 text-white/60">Loading...</div>
                  ) : vehicleTypes.length > 0 ? (
                    vehicleTypes.map((type) => (
                      <Link
                        key={type}
                        href={`/products?type=${encodeURIComponent(type)}`}
                        className="block px-4 py-2 hover:bg-secondary/10 transition-colors"
                      >
                        {type}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-white/60">
                      No products available
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href={"/about-us"}>
              <button className="cursor-pointer">About Us</button>
            </Link>

            <Link href={"/contact"}>
              <button className="cursor-pointer">Contact Us</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
