"use client";

import VehicleCard from "@/components/General/VehicleCard";
import { Search, X, Car, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState, useRef } from "react";
import type { Vehicle } from "@/types/vehicle";

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
        <div className="text-md text-white/80">
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

const ProductsPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get("q") ?? ""
  );
  const [selectedType, setSelectedType] = useState<string>(
    () => searchParams.get("type") ?? ""
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    () => searchParams.get("brand") ?? ""
  );
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
        // Sort vehicles by ranking (lower numbers first)
        vehicleData = vehicleData.sort((a: Vehicle, b: Vehicle) => {
          const aRanking = a.ranking ?? Infinity; // Vehicles without ranking go to the end
          const bRanking = b.ranking ?? Infinity;
          return aRanking - bRanking;
        });
        setVehicles(vehicleData);

        // Extract unique types
        const types = [
          ...new Set(vehicleData.map((v: Vehicle) => v.type).filter(Boolean)),
        ].sort();
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

  // Keep a ref for debouncing search updates to the URL
  const searchDebounceRef = useRef<number | null>(null);

  const syncToUrl = (params: {
    q?: string;
    type?: string;
    brand?: string;
    page?: number;
  }) => {
    try {
      const url = new URL(window.location.href);
      const sp = url.searchParams;

      if (params.q !== undefined) {
        if (params.q) sp.set("q", params.q);
        else sp.delete("q");
      }
      if (params.type !== undefined) {
        if (params.type) sp.set("type", params.type);
        else sp.delete("type");
      }
      if (params.brand !== undefined) {
        if (params.brand) sp.set("brand", params.brand);
        else sp.delete("brand");
      }
      if (params.page !== undefined) {
        if (params.page && params.page > 1) sp.set("page", String(params.page));
        else sp.delete("page");
      }

      const newUrl = `${url.pathname}${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      // use replace to avoid polluting history when filters change frequently
      router.replace(newUrl);
    } catch (e) {
      console.error(e);

      // noop
    }
  };

  // Sync searchQuery (debounced) to URL
  useEffect(() => {
    if (searchDebounceRef.current)
      window.clearTimeout(searchDebounceRef.current);
    // debounce 400ms
    searchDebounceRef.current = window.setTimeout(() => {
      syncToUrl({
        q: searchQuery,
        type: selectedType,
        brand: selectedBrand,
        page: 1,
      });
    }, 400) as unknown as number;

    return () => {
      if (searchDebounceRef.current)
        window.clearTimeout(searchDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Sync selectedType and selectedBrand immediately when they change
  useEffect(() => {
    syncToUrl({
      type: selectedType,
      brand: selectedBrand,
      q: searchQuery,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedBrand]);

  // Sync page changes
  useEffect(() => {
    syncToUrl({ page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    // Filter vehicles based on search query, selected type, and selected brand
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className="min-h-screen px-6 md:px-0 md:pr-8 bg-primary text-white pt-24">
      <div className="mb-12 mx-auto flex flex-col md:flex-row gap-8">
        {/* Side Panel */}
        <aside className="w-full  md:sticky top-18 md:h-screen md:max-w-80  md:border-r border-white/10  md:p-6 mb-8 ">
          <h2 className="text-2xl font-bold mb-6">Products Overview</h2>
          {/* Search Input */}
          <div className="mb-2">
            <label className="block text-md font-semibold mb-2">Search</label>
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
            <label className="block text-md font-semibold mb-2">Models</label>
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
            <label className="flex  justify-between text-md font-semibold mb-2">
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
              {filteredVehicles.length > 10 && (
                <div className="flex items-center justify-between  ">
                  {/* Active Filters Display */}
                  {(searchQuery || selectedType || selectedBrand) && (
                    <div className="flex w-full flex-wrap gap-2">
                      {searchQuery && (
                        <div className="px-3 py-2 rounded-full bg-secondary/20 text-secondary text-md flex items-center gap-2">
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
                        <div className="px-3 py-2 rounded-full bg-secondary/20 text-secondary text-md flex items-center gap-2">
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
                        <div className="px-3 py-2 rounded-full bg-secondary/20 text-secondary text-md flex items-center gap-2">
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
                  <PaginationControls
                    totalItems={filteredVehicles.length}
                    itemsPerPage={10}
                    currentPage={currentPage}
                    onPageChange={(p) => setCurrentPage(p)}
                  />
                </div>
              )}

              <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
                {filteredVehicles
                  .slice(
                    filteredVehicles.length > 10 ? (currentPage - 1) * 10 : 0,
                    filteredVehicles.length > 10
                      ? currentPage * 10
                      : filteredVehicles.length
                  )
                  .map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
              </div>

              {/* Pagination controls - bottom */}
              {filteredVehicles.length > 10 && (
                <PaginationControls
                  totalItems={filteredVehicles.length}
                  itemsPerPage={10}
                  currentPage={currentPage}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              )}
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
