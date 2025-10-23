"use client";
import Footer from "@/components/General/Footer";
import VehicleCard from "@/components/Products/VehicleCard";
import { Search, Filter, X, Car } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  brand: string;
  name: string;
  type: string;
  description?: string;
  images?: any[];
}

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>(typeFromUrl || "");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilOpen, setIsFilOpen] = useState(false);

  useEffect(() => {
    // Fetch all vehicles
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const result = await response.json();
        const vehicleData = result.data || [];
        setVehicles(vehicleData);

        // Extract unique types
        const types = [
          ...new Set(vehicleData.map((v: Vehicle) => v.type).filter(Boolean)),
        ];
        setAvailableTypes(types as string[]);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    // Filter vehicles based on search query and selected type
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

    setFilteredVehicles(filtered);
  }, [searchQuery, selectedType, vehicles]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
  };

  return (
    <div className="min-h-screen bg-primary text-white pt-24 lg:px-16">
      <div className="max-w-7xl px-4 mb-12 sm:px-8 mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold font-family-cera-stencil mb-4">
            Our Products
          </h1>
          <p className="text-xl text-white/70">
            Explore our range of electric vehicles
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div className="flex gap-4">
            {/* Type Filter */}
            <div
              onClick={() => setIsFilOpen(!isFilOpen)}
              className="flex w-full cursor-pointer relative justify-center items-center p-3 rounded-lg bg-white/10 border border-white/20 text-white "
            >
              <div className="  flex gap-2 justify-center items-center">
                <Filter className="text-white/50 w-5 h-5" />
                <div>
                  <p>{selectedType || "All Types"}</p>
                  <motion.ul
                    initial={{ height: 0, borderWidth: 0 }}
                    animate={{
                      height: isFilOpen ? "auto" : "0",
                      borderWidth: isFilOpen ? 1 : 0,
                    }}
                    className="absolute z-100 left-0 top-[110%] bg-primary w-full divide-y overflow-hidden divide-secondary border border-secondary rounded-lg"
                  >
                    <li
                      className="p-2"
                      onClick={() => {
                        setSelectedType("");
                        setIsFilOpen(false);
                      }}
                    >
                      All Types
                    </li>
                    {availableTypes.map((type, i) => (
                      <li
                        key={i}
                        className="p-2"
                        onClick={() => {
                          setSelectedType(type);
                          setIsFilOpen(false);
                        }}
                      >
                        {type}
                      </li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || selectedType) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 w-full justify-center  rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedType) && (
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
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-white/70">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
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
                transition={{ repeat: Infinity, ease: "linear", duration: 0.5 }}
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
              {searchQuery || selectedType
                ? "Try adjusting your search or filters"
                : "No vehicles available at the moment"}
            </p>
            {(searchQuery || selectedType) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-full bg-secondary text-white font-bold hover:bg-secondary-dark transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Vehicle Grid */}
        {!isLoading && filteredVehicles.length > 0 && (
          <div className="min-h-screen">
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
