import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
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
  scrollX: MotionValue<number>;
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
  scrollX,
  containerRef,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgUrl = urlFor(image).width(1200).height(800).url();

  const xShift = useTransform(scrollX, () => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return 0;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;

    const distance = cardCenter - containerCenter;
    const maxShift = 80;
    const normalized = Math.max(-1, Math.min(1, distance / 500));
    return -normalized * maxShift;
  });

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 w-[80vw] sm:w-[500px] h-[56vw] sm:h-[400px] rounded-xl overflow-hidden group cursor-pointer snap-center"
      onClick={onClick}
    >
      <motion.div
        style={{ x: xShift }}
        className="absolute inset-0 will-change-transform"
      >
        <div className="relative h-full w-full sm:w-[140%] sm:-left-[30%] rounded-2xl">
          <Img
            src={imgUrl}
            alt={`${brand} ${name} - Image ${index + 1}`}
            width={0}
            height={0}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
      </motion.div>

      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold">
        {(index % total) + 1} / {total}
      </div>
    </div>
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
  const { scrollX } = useScroll({ container: containerRef });
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const doubled = isMobile ? images : [...images, ...images];

  useEffect(() => {
    const el = containerRef.current;
    if (el) setScrollWidth(el.scrollWidth);
  }, [images]);

  useEffect(() => {
    // detect mobile and update state
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // only attach infinite-scroll reset when not on mobile
    if (isMobile) return;
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
  }, [scrollWidth, isMobile]);

  return (
    <div
      ref={containerRef}
      className={`w-full mb-12 overflow-x-auto flex gap-6 rounded-2xl hide-scrollbar relative px-4 sm:px-0 ${
        isMobile ? "snap-x snap-mandatory" : ""
      }`}
    >
      {doubled.map((image, index) => (
        <VehicleCard
          key={`${index}-${image}`}
          image={image}
          index={index}
          total={images.length}
          brand={brand}
          name={name}
          scrollX={scrollX}
          containerRef={containerRef}
          onClick={() => {
            setCurrentImageIndex(index % images.length);
            setIsFullscreen(true);
          }}
        />
      ))}
    </div>
  );
};

export default VehicleGallery;
