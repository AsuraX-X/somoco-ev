"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Vehicle {
  _id: string;
  _createdAt: string;
  brand: string;
  name: string;
  type?: string;
  description?: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch vehicles");
      }

      setVehicles(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      setVehicles(vehicles.filter((v) => v._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete vehicle");
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.type &&
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#252525] rounded-lg p-6 border border-red-500/30">
        <p className="text-red-400">Error: {error}</p>
        <button
          onClick={fetchVehicles}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Vehicles</h2>
          <p className="text-sm text-gray-400 mt-1">
            {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}{" "}
            total
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors"
        >
          + Add New
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, brand, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#252525] border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Vehicles List */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-[#252525] rounded-lg p-12 border border-[#333] text-center">
          <p className="text-gray-400 text-lg">
            {searchTerm
              ? "No vehicles found matching your search."
              : "No vehicles yet. Add your first vehicle!"}
          </p>
          {!searchTerm && (
            <Link
              href="/admin"
              className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors"
            >
              Add Vehicle
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-[#252525] rounded-lg p-5 border border-[#333] hover:border-[#444] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {vehicle.brand} {vehicle.name}
                    </h3>
                    {vehicle.type && (
                      <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 border border-green-500/30 rounded">
                        {vehicle.type}
                      </span>
                    )}
                  </div>
                  {vehicle.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Added:{" "}
                    {new Date(vehicle._createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/vehicles/${vehicle._id}`}
                    className="px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded border border-[#333] hover:border-green-500 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(
                        vehicle._id,
                        `${vehicle.brand} ${vehicle.name}`
                      )
                    }
                    className="px-4 py-2 bg-[#1a1a1a] text-red-400 text-sm rounded border border-[#333] hover:border-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
