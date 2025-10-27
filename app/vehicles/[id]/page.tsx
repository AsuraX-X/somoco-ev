"use client";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import VehicleGallery from "@/components/Products/VehicleGallery";
import { urlFor } from "@/sanity/lib/image";
import ParameterSection from "@/components/Products/Parameters";
import Footer from "@/components/General/Footer";
import { useContactModal } from "@/components/General/ContactModalProvider";

export interface Parameter {
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

const VehicleDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const { open: openContact } = useContactModal();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${params.id}`);
        const result = await response.json();

        if (result.success) {
          // Reverse the images array so first uploaded is shown first
          const vehicleData = {
            ...result.data,
            images: result.data.images ? [...result.data.images].reverse() : [],
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
          <Link href="/products">
            <button className="px-6 py-3 rounded-full bg-secondary text-white font-bold hover:bg-secondary-dark transition-colors">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentImage = vehicle.images?.[currentImageIndex];
  const imageUrl = currentImage
    ? urlFor(currentImage).width(1200).height(800).url()
    : "/placeholder-vehicle.jpg";

  const parameters = [
    {
      name: "Key Parameters",
      param: vehicle.specifications?.keyParameters,
    },
    {
      name: "Body Parameters",
      param: vehicle.specifications?.bodyParameters,
    },
    {
      name: "Motor Parameters",
      param: vehicle.specifications?.motorParameters,
    },
    {
      name: "Wheel & Brake Parameters",
      param: vehicle.specifications?.wheelBrakeParameters,
    },
    {
      name: "Key Configurations",
      param: vehicle.specifications?.keyConfigurations,
    },
  ];

  return (
    <div className="min-h-screen bg-primary text-white pt-20 pb-8 ">
      {/* Full-bleed hero (first uploaded image) */}
      {vehicle && vehicle.images && vehicle.images.length > 0 && (
        <div className="w-full">
          <div className="relative w-full h-80 md:h-[480px] mb-8 overflow-hidden">
            <Image
              src={urlFor(vehicle.images[0]).width(2000).height(900).url()}
              alt={`${vehicle.brand} ${vehicle.name}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            {/* Back button on top-left of hero */}
            <div className="absolute left-4 top-4 z-30">
              <Link href="/products">
                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-white/90 hover:text-secondary bg-black/30 backdrop-blur-md px-3 py-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Back</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl px-4 sm:px-8 lg:px-16 pb-10 mx-auto">
        {/* Back Button is shown on the hero above */}
        {/* Vehicle Header (shown under hero) */}
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
            <p className="text-xl mx-auto text-center text-white/70 max-w-3xl">
              {vehicle.description}
            </p>
          )}
        </div>
        {/* Image Gallery - Scrollable with Parallax */}
        {/* Key parameters + secondary image section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
          <div>
            <div className="space-y-3">
              {vehicle.specifications?.keyParameters &&
              vehicle.specifications.keyParameters.length > 0 ? (
                vehicle.specifications.keyParameters.slice(0, 3).map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start p-4 rounded-xl"
                  >
                    <div className="text-white text-3xl">{p.value}</div>
                    <div className="text-secondary font-bold">{p.name}</div>
                  </div>
                ))
              ) : (
                <p className="text-white/60">No key parameters available.</p>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src={
                  vehicle.images && vehicle.images.length > 1
                    ? urlFor(vehicle.images[1]).width(1600).height(900).url()
                    : vehicle.images && vehicle.images.length > 0
                    ? urlFor(vehicle.images[0]).width(1600).height(900).url()
                    : "/placeholder-vehicle.jpg"
                }
                alt={`${vehicle.brand} ${vehicle.name} secondary`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
        {/* Technical Specs button */}
        <div className="w-full mb-8">
          <motion.button
            onClick={() => setIsSpecsOpen(true)}
            whileHover={{
              scale: 1.02,
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{ scale: 0.98, backgroundColor: "#cecece" }}
            className="px-6 py-3 rounded-full text-secondary border border-secondary font-bold "
          >
            Technical Specs
          </motion.button>
        </div>
        <VehicleGallery
          images={vehicle.images || []}
          brand={vehicle.brand}
          name={vehicle.name}
          setCurrentImageIndex={setCurrentImageIndex}
          setIsFullscreen={setIsFullscreen}
        />
        {/* Technical Specs Modal Overlay */}
        {isSpecsOpen && vehicle.specifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-300 backdrop-blur-2xl flex items-start justify-end overflow-auto"
            onClick={() => setIsSpecsOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl h-full overflow-auto bg-primary/95  border-l border-white/10 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSpecsOpen(false)}
                className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
              >
                <X />
              </button>

              <h2 className="text-4xl font-bold font-family-cera-stencil mb-6">
                Specifications
              </h2>

              <div className="space-y-6">
                {parameters.map((param, i) => (
                  <ParameterSection
                    key={i}
                    title={param.name}
                    parameters={param.param}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {/* Fullscreen Image Modal */}
        {isFullscreen && vehicle.images && (
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
                    .width(1920)
                    .height(1080)
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
        )}{" "}
        {/* Specifications moved to modal opened by Technical Specs button */}
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
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
