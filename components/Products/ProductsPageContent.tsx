"use client";

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function PaginationControls({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePrev = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className="w-full flex items-center justify-end py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded bg-white/6 disabled:opacity-40"
        >
          Prev
        </button>
        <div className="text-sm text-white/80">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded bg-white/6 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
import VehicleCard from "@/components/Products/VehicleCard";
import { Search, X, Car, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState, useRef } from "react";

interface Vehicle {
  _id: string;
  brand: string;
  name: string;
  type: string;
  description?: string;
  images?: string[]; // Array of image URLs
}

const ProductsPageContent = () => {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>(typeFromUrl || "");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  useEffect(() => {
    // Fetch all vehicles
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const result = await response.json();
        let vehicleData = result.data || [];
        // Sort vehicles alphabetically by name (case-insensitive)
        vehicleData = vehicleData.sort((a: Vehicle, b: Vehicle) =>
          String(a.brand).localeCompare(String(b.brand), undefined, {
            sensitivity: "base",
          })
        );
        setVehicles(vehicleData);

        // Extract unique types
        const types = [
          ...new Set(vehicleData.map((v: Vehicle) => v.type).filter(Boolean)),
        ];
        setAvailableTypes(types as string[]);
        // Extract unique brands
        const brands = [
          ...new Set(vehicleData.map((v: Vehicle) => v.brand).filter(Boolean)),
        ];
        setAvailableBrands(brands as string[]);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    // Filter vehicles based on search query, selected type, and selected brand
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((vehicle) => vehicle.type === selectedType);
    }

    if (selectedBrand) {
      filtered = filtered.filter((vehicle) => vehicle.brand === selectedBrand);
    }

    setFilteredVehicles(filtered);
    // Reset to first page whenever filters or the underlying list change
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedBrand, vehicles]);

  // Scroll the main content into view when the page changes
  const mainRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // delay to allow layout to update, then scroll
    const id = setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);

    return () => clearTimeout(id);
  }, [currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedBrand("");
  };

  return (
    <div className="min-h-screen px-6 sm:px-0 sm:pr-8 bg-primary text-white pt-24">
      <div className="mb-12 mx-auto flex flex-col lg:flex-row gap-8">
        {/* Side Panel */}
        <aside className="w-full  sm:sticky top-18 sm:h-screen sm:max-w-80  sm:border-r border-white/10  sm:p-6 mb-8 ">
          <h2 className="text-2xl font-bold mb-6">Products Overview</h2>
          {/* Search Input */}
          <div className="mb-2">
            <label className="block text-sm font-semibold mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
          {(searchQuery || selectedType || selectedBrand) && (
            <button
              onClick={clearFilters}
              className="px-4 mb-6 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center gap-2 justify-center"
            >
              <X className="w-5 h-5" />
              Clear All Filters
            </button>
          )}
          {/* Type Filter Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Models</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={selectedType === ""}
                  onChange={() => setSelectedType("")}
                  className=" accent-primary/70  size-4 "
                />
                <span>All Models</span>
              </label>
              {availableTypes.map((type, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                    className="accent-primary/70  size-4"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Brand Filter Section */}
          <div className="pb-3 border-b border-secondary">
            <label className="flex  justify-between text-sm font-semibold mb-2">
              Brand
              <motion.button
                onClick={() => setIsBrandOpen(!isBrandOpen)}
                animate={{ rotate: isBrandOpen ? 135 : 0 }}
                className=" cursor-pointer "
              >
                <Plus size={20} />
              </motion.button>
            </label>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: isBrandOpen ? "auto" : 0 }}
              className="flex overflow-hidden flex-col gap-2"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === ""}
                  onChange={() => setSelectedBrand("")}
                  className="accent-primary/70 size-4"
                />
                <span>All Brands</span>
              </label>
              {availableBrands.map((brand, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                    className="accent-primary/70 size-4"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </motion.div>
          </div>
          {/* Clear Filters Button */}
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold font-family-cera-stencil mb-4">
              Our Products
            </h1>
            <p className="text-xl text-white/70">
              Explore our range of electric vehicles
            </p>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedType || selectedBrand) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchQuery && (
                <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm flex items-center gap-2">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {selectedType && (
                <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm flex items-center gap-2">
                  Type: {selectedType}
                  <button
                    onClick={() => setSelectedType("")}
                    className="hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {selectedBrand && (
                <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm flex items-center gap-2">
                  Brand: {selectedBrand}
                  <button
                    onClick={() => setSelectedBrand("")}
                    className="hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center h-screen py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                className="rounded-full h-12 w-12 border-2 border-b-transparent border-t-transparent flex items-center justify-center border-secondary mx-auto mb-4"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 0.5,
                  }}
                  className="rounded-full h-9 w-9 border-2 border-b-transparent border-t-transparent"
                />
              </motion.div>
              <p className="text-white/70">Loading vehicles...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredVehicles.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-4 place-items-center">
                <Car size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">No vehicles found</h3>
              <p className="text-white/70 mb-6">
                {searchQuery || selectedType || selectedBrand
                  ? "Try adjusting your search or filters"
                  : "No vehicles available at the moment"}
              </p>
            </div>
          )}

          {/* Vehicle Grid with Pagination */}
          {!isLoading && filteredVehicles.length > 0 && (
            <div className="min-h-screen">
              {/* Pagination controls - top */}
              <PaginationControls
                totalItems={filteredVehicles.length}
                itemsPerPage={10}
                currentPage={currentPage}
                onPageChange={(p) => setCurrentPage(p)}
              />

              <div className="grid grid-cols-1  md:grid-cols-2 lg: gap-6">
                {filteredVehicles
                  .slice((currentPage - 1) * 10, currentPage * 10)
                  .map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
              </div>

              {/* Pagination controls - bottom */}
              <PaginationControls
                totalItems={filteredVehicles.length}
                itemsPerPage={10}
                currentPage={currentPage}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ProductsPage = () => (
  <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
    <ProductsPageContent />
  </Suspense>
);

export default ProductsPage;
