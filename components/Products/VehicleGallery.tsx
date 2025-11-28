import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Event } from "@/sanity.types";

type SanityImage = NonNullable<Event["exteriorImages"]>[number];

interface VehicleGalleryProps {
  exteriorImages: SanityImage[];
  interiorImages: SanityImage[];
  brand?: string;
  name?: string;
  setCurrentImageIndex: (index: number) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

interface VehicleCardProps {
  image: SanityImage;
  index: number;
  total: number;
  brand?: string;
  name?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
}

const Img = motion.create(Image);

const VehicleCard: React.FC<VehicleCardProps> = ({
  image,
  index,
  total,
  brand,
  name,
  onClick,
}) => {
  const imgUrl = urlFor(image).auto("format").quality(80).url();

  return (
    <div className="w-full max-w-120 shrink-0  relative h-full">
      <div onClick={onClick} className="h-full w-full">
        <Img
          src={imgUrl}
          alt={`${brand} ${name} - Image ${index + 1}`}
          width={0}
          height={0}
          className="h-full object-center w-full object-cover"
          unoptimized
        />
      </div>
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold">
        {(index % total) + 1} / {total}
      </div>
    </div>
  );
};

const VehicleGallery: React.FC<VehicleGalleryProps> = ({
  exteriorImages,
  interiorImages,
  brand,
  name,
  setCurrentImageIndex,
  setIsFullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [filter, setFilter] = useState<"all" | "exterior" | "interior">("all");

  // Filter images based on current filter (arrays are already supplied in display order)
  const filteredImages = React.useMemo(() => {
    switch (filter) {
      case "exterior":
        return (exteriorImages || []).slice(1);
      case "interior":
        return interiorImages || [];
      default:
        return [...(exteriorImages || []).slice(1), ...(interiorImages || [])];
    }
  }, [exteriorImages, interiorImages, filter]);

  // display order: use the filteredImages as-is (exterior first when combining)
  const ordered = React.useMemo(() => filteredImages, [filteredImages]);

  const imagesToDisplay = ordered.length <= 2 ? ordered : [...ordered, ...ordered];

  useEffect(() => {
    const el = containerRef.current;
    if (el) setScrollWidth(el.scrollWidth);
  }, [filteredImages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || ordered.length <= 2) return;

    const handleScroll = () => {
      const totalWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= totalWidth) {
        el.scrollLeft -= totalWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += totalWidth;
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [ordered]);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <motion.button
          whileHover={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
          whileTap={{
            backgroundColor: "#cecece",
            color: "#000000",
          }}
          animate={{
            backgroundColor: filter === "all" ? "#ffffff" : "#001014",
            color: filter === "all" ? "#000000" : "#ffffff",
          }}
          onClick={() => setFilter("all")}
          className="border-secondary cursor-pointer border rounded-full px-4 py-2"
        >
          All
        </motion.button>
        <motion.button
          whileHover={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
          whileTap={{
            backgroundColor: "#cecece",
            color: "#000000",
          }}
          animate={{
            backgroundColor: filter === "exterior" ? "#ffffff" : "#001014",
            color: filter === "exterior" ? "#000000" : "#ffffff",
          }}
          onClick={() => setFilter("exterior")}
          className="border-secondary cursor-pointer border rounded-full px-4 py-2"
        >
          Exterior
        </motion.button>
        <motion.button
          whileHover={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
          whileTap={{
            backgroundColor: "#cecece",
            color: "#000000",
          }}
          animate={{
            backgroundColor: filter === "interior" ? "#ffffff" : "#001014",
            color: filter === "interior" ? "#000000" : "#ffffff",
          }}
          onClick={() => setFilter("interior")}
          className="border-secondary cursor-pointer border rounded-full px-4 py-2"
        >
          Interior
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-65 flex mb-12 overflow-x-scroll items-center overflow-hidden gap-6 rounded-2xl hide-scrollbar"
      >
        {imagesToDisplay.map((image, index) => (
          <VehicleCard
            key={`${index}-${image}`}
            image={image}
            index={index}
            total={ordered.length}
            brand={brand}
            name={name}
            containerRef={containerRef}
            onClick={() => {
              // map the clicked index back to the original combined array
              const len = filteredImages.length;
              if (len === 0) return;
              const orderedIndex = index % ordered.length;

              let originalIndex = 0;
              if (filter === "all") {
                // all: ordered == filteredImages -> [ext1, ext2, int1, int2]
                originalIndex = orderedIndex;
              } else if (filter === "exterior") {
                // exterior: filteredImages == exteriorImages, so orderedIndex maps directly to exterior index
                originalIndex = orderedIndex;
              } else if (filter === "interior") {
                // interior: filteredImages == interiorImages; in combined images interior starts after exterior
                originalIndex = (exteriorImages?.length || 0) + orderedIndex;
              }

              setCurrentImageIndex(originalIndex);
              setIsFullscreen(true);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default VehicleGallery;
