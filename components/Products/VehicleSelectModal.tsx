"use client";
import React, { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Vehicle {
  _id: string;
  brand: string;
  name: string;
  type: string;
  description?: string;
  images?: string[];
}

interface VehicleSelectModalProps {
  vehicles: Vehicle[];
  open: boolean;
  onClose: () => void;
  onSelect: (vehicleId: string) => void;
  title: string;
}

const VehicleSelectModal: React.FC<VehicleSelectModalProps> = ({
  vehicles,
  open,
  onClose,
  onSelect,
  title,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  // Extract unique types and brands
  const availableTypes = Array.from(
    new Set(vehicles.map((v) => v.type).filter(Boolean))
  );
  const availableBrands = Array.from(
    new Set(vehicles.map((v) => v.brand).filter(Boolean))
  );

  // Filter vehicles
  let filtered = vehicles;
  if (searchQuery) {
    filtered = filtered.filter(
      (v) =>
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedType) {
    filtered = filtered.filter((v) => v.type === selectedType);
  }
  if (selectedBrand) {
    filtered = filtered.filter((v) => v.brand === selectedBrand);
  }

  // Group vehicles by type
  const groupedByType: { [type: string]: Vehicle[] } = {};
  filtered.forEach((v) => {
    const type = v.type || "Other";
    if (!groupedByType[type]) groupedByType[type] = [];
    groupedByType[type].push(v);
  });

  if (!open) return null;

  // Lazy import for next/image and urlFor
  const Image = require("next/image").default;
  const { urlFor } = require("@/sanity/lib/image");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 backdrop-blur-2xl flex items-center sm:justify-end  justify-center"
      >
        <button
          className="fixed top-2 right-4 sm:top-3 sm:right-3 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="bg-primary h-screen sm:h-full rounded-xl w-full flex flex-col sm:flex-row overflow-hidden sm:w-4/5">
          {/* Side Panel */}
          <aside className="w-full sm:w-80 p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-white/10 bg-primary">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            {/* Search Input */}
            <div className="mb-6">
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
                    className="accent-secondary"
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
                      className="accent-secondary"
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
                    className="accent-secondary"
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
                      className="accent-secondary"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </motion.div>
            </div>
            {/* Clear Filters Button */}
            {(searchQuery || selectedType || selectedBrand) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("");
                  setSelectedBrand("");
                }}
                className="px-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center gap-2 justify-center mt-4"
              >
                <X className="w-5 h-5" />
                Clear All Filters
              </button>
            )}
          </aside>
          {/* Vehicle List */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto relative">
            {Object.keys(groupedByType).length === 0 ? (
              <div className="text-center py-20 text-white/70 text-base">
                No vehicles found. Try adjusting your search or filters.
              </div>
            ) : (
              Object.entries(groupedByType).map(([type, vehicles]) => (
                <div key={type} className="mb-8">
                  <h3 className="text-lg font-bold mb-4 text-secondary">
                    {type}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map((v) => (
                      <button
                        key={v._id}
                        className="bg-white/5 rounded-lg p-4 flex flex-col items-start hover:bg-secondary/10 transition-colors border border-white/10 text-left"
                        onClick={() => {
                          onSelect(v._id);
                          onClose();
                        }}
                      >
                        <div className="relative w-full h-32 mb-2">
                          <Image
                            src={
                              v.images?.[0]
                                ? urlFor(v.images[0])
                                    .width(300)
                                    .height(200)
                                    .url()
                                : "/placeholder-vehicle.jpg"
                            }
                            alt={`${v.brand} ${v.name}`}
                            fill
                            className="object-cover rounded"
                            unoptimized={true}
                          />
                        </div>
                        <span className="font-bold text-white mb-1">
                          {v.brand} {v.name}
                        </span>
                        {/* Show first three key parameters */}
                        {(v as any).specifications?.keyParameters?.length >
                          0 && (
                          <ul className="text-white/80 text-xs space-y-1 mb-2">
                            {(v as any).specifications.keyParameters
                              .slice(0, 3)
                              .map((param: any, idx: number) => (
                                <li key={idx}>
                                  <span className="font-semibold text-secondary">
                                    {param.name}:
                                  </span>{" "}
                                  {param.value}
                                </li>
                              ))}
                          </ul>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehicleSelectModal;
