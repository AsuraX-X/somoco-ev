import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface VehicleGalleryProps {
  images: string[];
  brand: string;
  name: string;
  setCurrentImageIndex: (index: number) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

interface VehicleCardProps {
  image: string;
  index: number;
  total: number;
  brand: string;
  name: string;
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
  const imgUrl = urlFor(image).width(1200).height(800).url();

  return (
    <motion.div className="w-full max-w-120 shrink-0 relative h-full">
      <div onClick={onClick} className="h-full w-full rounded-2xl">
        <Img
          src={imgUrl}
          alt={`${brand} ${name} - Image ${index + 1}`}
          width={0}
          height={0}
          className="h-full w-full object-contain"
          unoptimized
        />
      </div>
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold">
        {(index % total) + 1} / {total}
      </div>
    </motion.div>
  );
};

const VehicleGallery: React.FC<VehicleGalleryProps> = ({
  images,
  brand,
  name,
  setCurrentImageIndex,
  setIsFullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  // display order: reverse the provided images array for the gallery view
  const ordered = React.useMemo(() => [...images].reverse(), [images]);

  const doubled = [...ordered, ...ordered];

  useEffect(() => {
    const el = containerRef.current;
    if (el) setScrollWidth(el.scrollWidth);
  }, [images]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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
  }, [scrollWidth]);

  return (
    <div
      ref={containerRef}
      className="w-full flex mb-12 overflow-x-scroll gap-6 rounded-2xl hide-scrollbar"
    >
      {doubled.map((image, index) => (
        <VehicleCard
          key={`${index}-${image}`}
          image={image}
          index={index}
          total={ordered.length}
          brand={brand}
          name={name}
          containerRef={containerRef}
          onClick={() => {
            // map the clicked (possibly doubled & reversed) index back to the original images array
            const len = images.length || ordered.length;
            if (len === 0) return;
            const orderedIndex = index % ordered.length;
            const originalIndex = Math.max(0, len - 1 - orderedIndex);
            setCurrentImageIndex(originalIndex);
            setIsFullscreen(true);
          }}
        />
      ))}
    </div>
  );
};

export default VehicleGallery;
