"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import VehicleGallery from "@/components/Products/VehicleGallery";
import VehicleCard from "@/components/General/VehicleCard";
import { urlFor } from "@/sanity/lib/image";
import { useContactModal } from "@/components/General/ContactModalProvider";

import type { Vehicle, VehicleWithImages } from "@/types/vehicle";

const VehicleDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleWithImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // No overlay: download specs PDF instead
  const [recommendations, setRecommendations] = useState<Vehicle[]>([]);
  const { open: openContact } = useContactModal();

  // Helper that resolves Sanity file ref to a CDN URL
  const getFileUrl = (file?: Vehicle["document"]) => {
    if (!file?.asset) return null;

    const ref = file.asset._ref;
    // ref may be like "file-<id>-pdf" — fallback to safe parsing
    if (!ref || typeof ref !== "string") return null;
    const parts = ref.split("-");
    if (parts.length < 3) return null;
    const id = parts[1];
    const ext = parts[parts.length - 1];

    const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const ds = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!pid || !ds) return null;

    return `https://cdn.sanity.io/files/${pid}/${ds}/${id}.${ext}`;
  };

  const downloadDocument = () => {
    if (!vehicle?.document) {
      // no file — redirect user to contact modal as fallback
      openContact();
      return;
    }

    const url = getFileUrl(vehicle.document);
    if (!url) {
      openContact();
      return;
    }

    // Create an anchor and click it to open/download the PDF
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    // try to set a filename for download — may be ignored cross-origin
    const name =
      vehicle.document.title || `${vehicle.brand}-${vehicle.name}-specs.pdf`;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${params.id}`);
        const result = await response.json();

        if (result.success) {
          // Keep arrays in upload order — first uploaded should display first
          const exterior = result.data.exteriorImages
            ? [...result.data.exteriorImages]
            : [];
          const interior = result.data.interiorImages
            ? [...result.data.interiorImages]
            : [];

          // Combined images: exterior (excluding first which is used as hero), then interior
          const vehicleData = {
            ...result.data,
            exteriorImages: exterior,
            interiorImages: interior,
            images: [...exterior.slice(1), ...interior],
          };
          setVehicle(vehicleData);
        } else {
          console.error("Vehicle not found");
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVehicle();
    }
  }, [params.id]);

  // Fetch recommendations (same type) after vehicle is loaded
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!vehicle || !vehicle.type) return;

      try {
        const res = await fetch(`/api/vehicles`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const vehicles = data.data as Vehicle[];

          // Filter by same type and exclude current vehicle
          const sameType = vehicles.filter(
            (v) => v.type === vehicle.type && v._id !== vehicle._id
          );

          // Shuffle the array and take up to 4
          const shuffled = sameType
            .map((v) => ({ v, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map((x) => x.v)
            .slice(0, 4);

          setRecommendations(shuffled);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [vehicle]);

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === vehicle.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? vehicle.images!.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center h-screen place-content-center py-20">
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
        <p className="text-white/70">Loading vehicles details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-primary text-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Vehicle not found</h2>
          <motion.button
            onClick={() => router.back()}
            whileHover={{ color: "#000000", background: "#ffffff" }}
            className="px-6 py-3 rounded-full border text-white font-bold transition-colors"
          >
            Return
          </motion.button>
        </div>
      </div>
    );
  }

  // const parameters = [
  //   {
  //     name: "Key Parameters",
  //     param: vehicle.specifications?.keyParameters,
  //   },
  //   {
  //     name: "Body Parameters",
  //     param: vehicle.specifications?.bodyParameters,
  //   },
  //   {
  //     name: "Motor Parameters",
  //     param: vehicle.specifications?.motorParameters,
  //   },
  //   {
  //     name: "Wheel & Brake Parameters",
  //     param: vehicle.specifications?.wheelBrakeParameters,
  //   },
  //   {
  //     name: "Key Configurations",
  //     param: vehicle.specifications?.keyConfigurations,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-primary text-white pt-20 pb-8 ">
      {/* Full-bleed hero (first interior image, or first exterior if no interior) */}
      {vehicle &&
        ((vehicle.interiorImages && vehicle.interiorImages.length > 0) ||
          (vehicle.exteriorImages && vehicle.exteriorImages.length > 0)) && (
          <div className="relative w-screen  bg-linear-to-b from-white/8 to-transparent h-80 md:h-[480px] mb-8">
            <Image
              src={
                vehicle.interiorImages && vehicle.interiorImages.length > 0
                  ? urlFor(vehicle.interiorImages[0])
                      .auto("format")
                      .quality(80)
                      .url()
                  : vehicle.exteriorImages && vehicle.exteriorImages.length > 0
                  ? urlFor(vehicle.exteriorImages[0])
                      .auto("format")
                      .quality(80)
                      .url()
                  : "/placeholder-vehicle.jpg"
              }
              alt={`${vehicle.brand} ${vehicle.name}`}
              fill
              className="object-cover "
            />
            {/* Back button on top-left of hero */}
            <div className="absolute left-4 top-4 z-30">
              <motion.button
                onClick={() => router.back()}
                whileHover={{ x: -5 }}
                whileTap={{ opacity: 0.8 }}
                className="flex items-center gap-2 text-white/90 hover:text-secondary bg-black/30 backdrop-blur-md px-3 py-2 rounded-full transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
              </motion.button>
            </div>
          </div>
        )}

      <div className="pb-10 mx-auto">
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl font-bold font-family-cera-stencil">
              {vehicle.brand} {vehicle.name}
            </h1>
            {vehicle.type && (
              <span className="bg-white/5 text-sm px-2 py-1 rounded-full">
                {vehicle.type}
              </span>
            )}
          </div>
          {vehicle.description && (
            <p className="sm:text-xl px-4 text-sm mx-auto text-center text-white/70 max-w-3xl">
              {vehicle.description}
            </p>
          )}
        </div>
        {/* Key parameters + secondary image section */}
        <div className=" bg-linear-to-t px-8 md:px-20 pb-10 from-white/10 to-transparent mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
            <div className="w-full h-full">
              <div className="h-full flex flex-col items-center md:items-start justify-center">
                {vehicle.specifications?.keyParameters &&
                vehicle.specifications.keyParameters.length > 0 ? (
                  // Filter out any parameter entries missing a name or value so we can map safely
                  (
                    vehicle.specifications.keyParameters.filter(
                      (p): p is { name: string; value: string; _key: string } =>
                        typeof p?.name === "string" &&
                        typeof p?.value === "string" &&
                        typeof p._key === "string"
                    ) || []
                  )
                    .slice(0, 3)
                    .map((p, i) => (
                      <div
                        key={p._key ?? i}
                        className="flex flex-col items-center md:items-start p-4 rounded-xl"
                      >
                        <div className="text-white text-6xl">{p.value}</div>
                        <div className="text-secondary font-bold">{p.name}</div>
                      </div>
                    ))
                ) : (
                  <p className="text-white/60">No key parameters available.</p>
                )}
              </div>
            </div>

            <div className="w-full relative flex items-center justify-center h-full">
              <Image
                src={
                  vehicle.exteriorImages && vehicle.exteriorImages.length > 0
                    ? urlFor(vehicle.exteriorImages[0])
                        .auto("format")
                        .quality(80)
                        .url()
                    : vehicle.interiorImages &&
                      vehicle.interiorImages.length > 0
                    ? urlFor(vehicle.interiorImages[0])
                        .auto("format")
                        .quality(80)
                        .url()
                    : "/placeholder-vehicle.jpg"
                }
                alt={`${vehicle.brand} ${vehicle.name} secondary`}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="w-fit mx-auto pt-12">
            <motion.button
              onClick={downloadDocument}
              whileHover={{
                scale: 1.02,
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
              whileTap={{ scale: 0.98, backgroundColor: "#cecece" }}
              className="px-6 py-3 rounded-full text-secondary border border-secondary font-bold "
              disabled={!vehicle.document}
            >
              {vehicle.document ? "Download Specs" : "Request Specs"}
            </motion.button>
          </div>
        </div>
        <div className="py-10">
          <VehicleGallery
            exteriorImages={vehicle.exteriorImages || []}
            interiorImages={vehicle.interiorImages || []}
            brand={vehicle.brand || "Vehicle"}
            name={vehicle.name || ""}
            setCurrentImageIndex={setCurrentImageIndex}
            setIsFullscreen={setIsFullscreen}
          />
        </div>
        {/* Technical Specs are now downloadable; the overlay has been removed. */}
        {/* Fullscreen Image Modal */}
        {isFullscreen && vehicle.images && vehicle.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/95 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative w-full h-full max-w-7xl"
              >
                <Image
                  src={urlFor(vehicle.images[currentImageIndex])
                    .auto("format")
                    .quality(90)
                    .url()}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  fill
                  className="object-contain"
                />
              </motion.div>

              {/* Navigation in fullscreen */}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
                  >
                    <ChevronRight size={32} />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold">
                    {currentImageIndex + 1} / {vehicle.images.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
        <div className="mx-4 md:mx-20 ">
          {/* Contact CTA */}
          <div className="mt-12 bg-white/5 rounded-2xl p-8">
            <h3 className="text-3xl font-bold font-family-cera-stencil mb-4">
              Interested in this vehicle?
            </h3>
            <p className="text-white mb-6">
              Contact us for more information, pricing, and availability.
            </p>
            <motion.button
              onClick={() => openContact()}
              whileHover={{
                scale: 1.02,
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
              whileTap={{ scale: 0.95, backgroundClip: "#cecece" }}
              className="px-8 py-3 cursor-pointer rounded-full border border-secondary text-secondary font-bold"
            >
              Contact Us
            </motion.button>
          </div>
          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="mt-12">
              <h3 className="text-3xl font-bold font-family-cera-stencil mb-6">
                More {vehicle?.type} vehicles you might like
              </h3>

              <div
                tabIndex={0}
                className="flex gap-4 py-8 overflow-auto hide-scrollbar focus:outline-none"
                role="region"
                aria-label="Vehicles carousel"
              >
                {recommendations.map((rec) => (
                  <div
                    key={rec._id}
                    className="shrink-0 w-full sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[28vw]"
                  >
                    <VehicleCard vehicle={rec} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
