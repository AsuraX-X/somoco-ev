"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
const VehicleSelectModal = dynamic(
  () => import("@/components/Products/VehicleSelectModal"),
  { ssr: false }
);
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

interface Parameter {
  name: string;
  value: string;
}

interface Specifications {
  keyParameters?: Parameter[];
  bodyParameters?: Parameter[];
  engineParameters?: Parameter[];
  motorParameters?: Parameter[];
  wheelBrakeParameters?: Parameter[];
  keyConfigurations?: Parameter[];
}

interface Vehicle {
  _id: string;
  brand: string;
  name: string;
  type: string;
  description?: string;
  images?: string[];
  specifications?: Specifications;
}

const parameterSections = [
  { name: "Key Parameters", key: "keyParameters" },
  { name: "Body Parameters", key: "bodyParameters" },
  { name: "Engine Parameters", key: "engineParameters" },
  { name: "Motor Parameters", key: "motorParameters" },
  { name: "Wheel & Brake Parameters", key: "wheelBrakeParameters" },
  { name: "Key Configurations", key: "keyConfigurations" },
];

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstId = searchParams.get("first") || "";
  const secondId = searchParams.get("second") || "";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [firstVehicle, setFirstVehicle] = useState<Vehicle | null>(null);
  const [secondVehicle, setSecondVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  useEffect(() => {
    // Fetch all vehicles for selection
    const fetchVehicles = async () => {
      const res = await fetch("/api/vehicles");
      const result = await res.json();
      setVehicles(result.data || []);
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    // Fetch selected vehicles
    const fetchVehicle = async (id: string) => {
      if (!id) return null;
      const res = await fetch(`/api/vehicles/${id}`);
      const result = await res.json();
      return result.success ? result.data : null;
    };
    setLoading(true);
    Promise.all([fetchVehicle(firstId), fetchVehicle(secondId)]).then(
      ([first, second]) => {
        setFirstVehicle(first);
        setSecondVehicle(second);
        setLoading(false);
      }
    );
  }, [firstId, secondId]);

  const handleSelect = (which: "first" | "second", id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(which, id);
    router.replace(`/products/compare?${params.toString()}`);
  };

  const handleClear = (which: "first" | "second") => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(which);
    router.replace(`/products/compare?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-primary text-white pt-24 pb-8">
      <div className="max-w-7xl px-4 sm:px-8 lg:px-16 pb-10 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products">
              <motion.button
                whileHover={{ x: -4 }}
                className="flex items-center gap-2 text-white/80 hover:text-secondary"
              >
                <ArrowLeft size={18} /> Back to Products
              </motion.button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold font-family-cera-stencil">
            Compare Vehicles
          </h1>
          <div className="w-24" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Vehicle Selectors */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">First Vehicle</h2>
            <motion.button
              onClick={() => setShowFirstModal(true)}
              whileHover={{ scale: 1.02 }}
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 text-white mb-4 text-left"
            >
              {firstVehicle
                ? `${firstVehicle.brand} ${firstVehicle.name}`
                : "Select Vehicle"}
            </motion.button>

            {firstVehicle && (
              <div className="bg-white/5 rounded-xl p-4 mb-4 shadow-sm">
                <div className="relative h-44 w-full mb-4 rounded overflow-hidden">
                  <Image
                    src={
                      firstVehicle.images?.[0]
                        ? urlFor(firstVehicle.images[0])
                            .width(800)
                            .height(600)
                            .url()
                        : "/placeholder-vehicle.jpg"
                    }
                    alt={`${firstVehicle.brand} ${firstVehicle.name}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <div className="flex flex-col items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      {firstVehicle.brand} {firstVehicle.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {firstVehicle.description}
                    </p>
                  </div>
                  <div className="flex w-full gap-4 mt-4">
                    <button
                      onClick={() => handleClear("first")}
                      className="w-full flex items-center justify-center border rounded-full py-2 "
                    >
                      Clear
                    </button>
                    <Link
                      href={`/vehicles/${firstVehicle._id}`}
                      className="w-full flex items-center justify-center border rounded-full py-2 "
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Second Vehicle</h2>
            <motion.button
              onClick={() => setShowSecondModal(true)}
              whileHover={{ scale: 1.02 }}
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 text-white mb-4 text-left"
            >
              {secondVehicle
                ? `${secondVehicle.brand} ${secondVehicle.name}`
                : "Select Vehicle"}
            </motion.button>

            {secondVehicle && (
              <div className="bg-white/5 rounded-xl p-4 mb-4 shadow-sm">
                <div className="relative h-44 w-full mb-4 rounded overflow-hidden">
                  <Image
                    src={
                      secondVehicle.images?.[0]
                        ? urlFor(secondVehicle.images[0])
                            .width(800)
                            .height(600)
                            .url()
                        : "/placeholder-vehicle.jpg"
                    }
                    alt={`${secondVehicle.brand} ${secondVehicle.name}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <div className="flex flex-col items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      {secondVehicle.brand} {secondVehicle.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {secondVehicle.description}
                    </p>
                  </div>
                  <div className="flex w-full gap-4 mt-4">
                    <button
                      onClick={() => handleClear("second")}
                      className="w-full flex items-center justify-center border rounded-full py-2 "
                    >
                      Clear
                    </button>
                    <Link
                      href={`/vehicles/${secondVehicle._id}`}
                      className="w-full flex items-center justify-center border rounded-full py-2 "
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Comparison Table */}
        {firstVehicle && secondVehicle && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Parameters Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white/5 rounded-xl overflow-hidden">
                <thead>
                  <tr>
                    <th className="p-3 bg-secondary/20 text-secondary font-bold rounded-tl-xl">
                      Parameter
                    </th>
                    <th className="p-3 bg-secondary/10 text-white font-bold">
                      {firstVehicle.brand} {firstVehicle.name}
                    </th>
                    <th className="p-3 bg-secondary/10 text-white font-bold rounded-tr-xl">
                      {secondVehicle.brand} {secondVehicle.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parameterSections.map((section) => {
                    const firstParams =
                      firstVehicle.specifications?.[
                        section.key as keyof Specifications
                      ] || [];
                    const secondParams =
                      secondVehicle.specifications?.[
                        section.key as keyof Specifications
                      ] || [];
                    const maxLen = Math.max(
                      firstParams.length,
                      secondParams.length
                    );
                    return (
                      <React.Fragment key={section.key}>
                        <tr>
                          <td
                            className="p-3 font-bold bg-white/10 text-secondary"
                            colSpan={3}
                          >
                            {section.name}
                          </td>
                        </tr>
                        {[...Array(maxLen)].map((_, idx) => (
                          <tr
                            key={section.key + idx}
                            className="even:bg-white/3"
                          >
                            <td className="p-3 border-b border-white/10 text-xs align-top">
                              {firstParams[idx]?.name ||
                                secondParams[idx]?.name ||
                                "-"}
                            </td>
                            <td className="p-3 border-b border-white/10 text-xs align-top">
                              {firstParams[idx]?.value || "-"}
                            </td>
                            <td className="p-3 border-b border-white/10 text-xs align-top">
                              {secondParams[idx]?.value || "-"}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
