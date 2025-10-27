"use client";
import { ChevronDown, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useContactModal } from "./ContactModalProvider";

const Header = () => {
  const pathname = usePathname();
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [changeBg, setChangeBg] = useState(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { open: openContact } = useContactModal();

  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (i) => {
    if (i > 0.05 && pathname !== "/") setChangeBg(true);
    else setChangeBg(false);
    console.log(i);
  });

  // Close dropdowns/menus when the path changes
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileProductsOpen(false);
  }, [pathname]);

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

        // Extract unique types from vehicles
        interface Vehicle {
          type: string;
          // Add other properties if needed
        }

        interface VehiclesApiResponse {
          data: Vehicle[];
          // Add other properties if needed
        }

        const result: VehiclesApiResponse = await response.json();

        const types: string[] = [
          ...new Set(result.data.map((v: Vehicle) => v.type).filter(Boolean)),
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
    !pathname.includes("/admin") && (
      <div className="fixed top-0 w-full z-100">
        {/* Desktop Menu */}
        <motion.div
          animate={{ backgroundColor: changeBg ? "#1a1a1a" : "#1a1a1a0" }}
          className=" hidden sm:block text-white"
        >
          <div className="flex justify-between px-12 py-4">
            <Link className="flex-1" href={"/"}>
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
            <div className="flex flex-1 justify-center items-center">
              {pathname !== "/" && (
                <Link
                  className="w-25 flex items-center justify-center"
                  href={"/"}
                >
                  <button className="cursor-pointer">Home</button>
                </Link>
              )}

              {/* Products Dropdown */}

              <div
                className="relative w-25 flex justify-center items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="cursor-pointer flex items-center gap-1">
                  Discover
                  <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 bg-primary border border-secondary/20 rounded-lg shadow-lg min-w-[200px]">
                    {isLoading ? (
                      <div className="px-4 py-2 text-white/60">Loading...</div>
                    ) : (
                      <>
                        <Link
                          href="/products"
                          className="block px-4 py-2 hover:bg-secondary/10 transition-colors border-b border-white/10"
                        >
                          All Products
                        </Link>
                        {vehicleTypes.length > 0 ? (
                          vehicleTypes.map((type) => (
                            <Link
                              key={type}
                              href={`/products?type=${encodeURIComponent(
                                type
                              )}`}
                              className="block px-4 py-2 hover:bg-secondary/10 transition-colors"
                            >
                              {type}
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-white/60">
                            No product types available
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link
                className="flex justify-center items-center w-25"
                href={"/about-us"}
              >
                <button className="cursor-pointer">About Us</button>
              </Link>
            </div>
            <div className="flex-1 flex justify-end items-center">
              <motion.button
                whileHover={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
                whileTap={{
                  backgroundColor: "#cecece",
                }}
                className="border-secondary cursor-pointer border rounded-full px-4 py-2"
                onClick={() => openContact()}
              >
                Contact Us
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <motion.div
          animate={{
            backgroundColor:
              changeBg || isMobileMenuOpen ? "#1a1a1a" : "#1a1a1a0",
          }}
          className="sm:hidden text-white"
        >
          <div className="flex justify-between items-center px-6 py-4">
            <Link href={"/"}>
              <div className="font-family-cera-stencil font-bold text-xl gap-1 flex items-center">
                <Image
                  unoptimized
                  src="/LogoIconAlt.svg"
                  height={32}
                  width={32}
                  alt="Somoco Logo"
                />
                <h1>SOMOCO EV</h1>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <Image
                unoptimized
                src="/menu.svg"
                height={28}
                width={28}
                alt="Menu"
              />
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-primary/95 backdrop-blur-lg"
          >
            <div className="px-6 py-4 space-y-2">
              {pathname !== "/" && (
                <Link href={"/"} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="py-2 cursor-pointer hover:text-secondary transition-colors">
                    Home
                  </div>
                </Link>
              )}

              {/* Mobile Products Dropdown */}
              <div>
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className="w-full flex justify-between items-center cursor-pointer hover:text-secondary transition-colors"
                >
                  <span>Discover</span>
                  <motion.span
                    animate={{ rotate: isMobileProductsOpen ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isMobileProductsOpen ? "auto" : 0,
                    opacity: isMobileProductsOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 pt-1 space-y-2">
                    <Link
                      href="/products"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileProductsOpen(false);
                      }}
                      className="block py-2 text-white/80 hover:text-secondary transition-colors"
                    >
                      All Products
                    </Link>
                    {vehicleTypes.map((type) => (
                      <Link
                        key={type}
                        href={`/products?type=${encodeURIComponent(type)}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileProductsOpen(false);
                        }}
                        className="block py-2 text-white/80 hover:text-secondary transition-colors"
                      >
                        {type}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>

              <Link
                href={"/about-us"}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="cursor-pointer hover:text-secondary transition-colors">
                  About Us
                </div>
              </Link>

              <div className="pt-2">
                <button
                  className="w-full text-left cursor-pointer"
                  onClick={() => {
                    openContact();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Contact overlay is provided by ContactModalProvider */}
      </div>
    )
  );
};

export default Header;
