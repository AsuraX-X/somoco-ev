"use client";
import React, { Suspense, useEffect, useState } from "react";
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
import type { Vehicle } from "@/types/vehicle";

interface Parameter {
  name?: string;
  value?: string;
  _key: string;
}

interface Specifications {
  keyParameters?: Parameter[];
  bodyParameters?: Parameter[];
  engineParameters?: Parameter[];
  motorParameters?: Parameter[];
  wheelBrakeParameters?: Parameter[];
  keyConfigurations?: Parameter[];
}

const parameterSections = [
  { name: "Key Parameters", key: "keyParameters" },
  { name: "Body Parameters", key: "bodyParameters" },
  { name: "Engine Parameters", key: "engineParameters" },
  { name: "Motor Parameters", key: "motorParameters" },
  { name: "Wheel & Brake Parameters", key: "wheelBrakeParameters" },
  { name: "Key Configurations", key: "keyConfigurations" },
];

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstId = searchParams.get("first") || "";
  const secondId = searchParams.get("second") || "";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [firstVehicle, setFirstVehicle] = useState<Vehicle | null>(null);
  const [secondVehicle, setSecondVehicle] = useState<Vehicle | null>(null);
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
    Promise.all([fetchVehicle(firstId), fetchVehicle(secondId)]).then(
      ([first, second]) => {
        setFirstVehicle(first);
        setSecondVehicle(second);
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
        <div>
          <Link href="/products">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ opacity: 0.8 }}
              className="flex items-center gap-2 mb-4 text-white/90 hover:text-secondary bg-black/30 backdrop-blur-md px-3 py-2 rounded-full transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </motion.button>
          </Link>
        </div>
        <h1 className="text-4xl w-full text-center mb-4 sm:mb-12 font-bold font-family-cera-stencil">
          Compare Vehicles
        </h1>
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Vehicle Selectors */}
          <div className="flex-1">
            <h2 className="text-xl text-center font-bold mb-4">
              First Vehicle
            </h2>
            <motion.button
              onClick={() => setShowFirstModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ opacity: 0.8 }}
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 text-white mb-4 text-left"
            >
              {firstVehicle
                ? `${firstVehicle.brand} ${firstVehicle.name}`
                : "Select Vehicle"}
            </motion.button>

            {firstVehicle && (
              <div className="bg-white/5 flex flex-col rounded-xl h-110 p-4 mb-4">
                <div className="relative flex-1 w-full mb-4 rounded overflow-hidden">
                  <Image
                    src={
                      firstVehicle.exteriorImages?.[0]
                        ? urlFor(firstVehicle.exteriorImages[0]).auto('format').quality(80).url()
                        : "/placeholder-vehicle.jpg"
                    }
                    alt={`${firstVehicle.brand} ${firstVehicle.name}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <div className="flex flex-col justify-between  flex-1">
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
            <VehicleSelectModal
              vehicles={vehicles}
              open={showFirstModal}
              onClose={() => setShowFirstModal(false)}
              onSelect={(id: string) => handleSelect("first", id)}
              title="Select First Vehicle"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl text-center font-bold mb-4">
              Second Vehicle
            </h2>
            <motion.button
              onClick={() => setShowSecondModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ opacity: 0.8 }}
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 text-white mb-4 text-left"
            >
              {secondVehicle
                ? `${secondVehicle.brand} ${secondVehicle.name}`
                : "Select Vehicle"}
            </motion.button>

            {secondVehicle && (
              <div className="bg-white/5 flex flex-col rounded-xl h-110 p-4 mb-4">
                <div className="relative flex-1 w-full mb-4 rounded overflow-hidden">
                  <Image
                    src={
                      secondVehicle.exteriorImages?.[0]
                        ? urlFor(secondVehicle.exteriorImages[0]).auto('format').quality(80).url()
                        : "/placeholder-vehicle.jpg"
                    }
                    alt={`${secondVehicle.brand} ${secondVehicle.name}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <div className="flex flex-col justify-between  flex-1">
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
            <VehicleSelectModal
              vehicles={vehicles}
              open={showSecondModal}
              onClose={() => setShowSecondModal(false)}
              onSelect={(id: string) => handleSelect("second", id)}
              title="Select Second Vehicle"
            />
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
                    // only show a section if at least one vehicle has any parameters in it
                    if ((firstParams.length || secondParams.length) === 0) {
                      return null;
                    }
                    // Merge parameter rows by name so differing parameter orders/names are aligned
                    const normalize = (s?: string) =>
                      (s || "").toLowerCase().trim();

                    const seen = new Set<string>();
                    const orderedNames: string[] = [];

                    const addNames = (params: Parameter[] = []) => {
                      params.forEach((p) => {
                        const key = normalize(p.name);
                        if (key && !seen.has(key)) {
                          seen.add(key);
                          orderedNames.push(p.name || key);
                        }
                      });
                    };

                    // prefer first vehicle's name order, then include unique names from second
                    addNames(firstParams);
                    addNames(secondParams);

                    return (
                      <React.Fragment key={section.key}>
                        {/* Section header row: show section title + vehicle names */}
                        <tr>
                          <td className="p-3 font-bold bg-white/10 text-secondary">
                            {section.name}
                          </td>
                          <td className="p-3 bg-secondary/10 text-white font-bold">
                            {firstVehicle.brand} {firstVehicle.name}
                          </td>
                          <td className="p-3 bg-secondary/10 text-white font-bold">
                            {secondVehicle.brand} {secondVehicle.name}
                          </td>
                        </tr>
                        {orderedNames.map((paramName, idx) => {
                          const key = normalize(paramName);
                          const firstMatch = firstParams.find(
                            (p) => normalize(p.name) === key
                          );
                          const secondMatch = secondParams.find(
                            (p) => normalize(p.name) === key
                          );

                          // skip rows where both vehicles have no value
                          if (!firstMatch?.value && !secondMatch?.value)
                            return null;

                          return (
                            <tr
                              key={section.key + idx}
                              className="even:bg-white/3"
                            >
                              <td className="p-3 border-b border-white/10 text-xs align-top">
                                {firstMatch?.name ||
                                  secondMatch?.name ||
                                  paramName}
                              </td>
                              <td className="p-3 border-b border-white/10 text-xs align-top">
                                {firstMatch?.value || "-"}
                              </td>
                              <td className="p-3 border-b border-white/10 text-xs align-top">
                                {secondMatch?.value || "-"}
                              </td>
                            </tr>
                          );
                        })}
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

const ComparePage = () => (
  <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
    <ComparePageContent />
  </Suspense>
);

export default ComparePage;
