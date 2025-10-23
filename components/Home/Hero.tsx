"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { RefObject, useRef } from "react";

const Hero = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef, // Track scroll of the parent container
    offset: ["start start", "end start"],
  });

  // Background moves slower (50% of scroll)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Text moves faster (100% of scroll) - creates parallax effect
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden snap-center">
      <motion.div
        style={{ y: bgY }}
        className="bg-cover bg-center absolute inset-0 text-white bg-[url(/seagull1.jpg)]"
      >
        <motion.div
          style={{ y: textY }}
          className="w-full h-full bg-black/50 flex flex-col justify-center px-4 sm:px-16 gap-4"
        >
          <h1 className="text-4xl sm:text-6xl font-bold font-family-cera-stencil">
            Drive Tomorrow, Today
          </h1>
          <p className="max-w-3xl text-xl sm:text-2xl">
            Experience the{" "}
            <span className="text-secondary font-medium">
              future of mobility
            </span>{" "}
            with electric vehicles where innovation, sustainability, and
            performance come together to redefine the way we drive.
          </p>
          <div className="flex gap-2">
            <Link href={"/products"}>
              <motion.button
                whileHover={{
                  color: "#ffffff",

                  backgroundColor: "#00c950",
                  fontWeight: "normal",
                }}
                whileTap={
                  typeof window !== "undefined" && window.innerWidth >= 768
                    ? { backgroundColor: "#00A63E" }
                    : {}
                }
                className="text-xl font-bold py-2 rounded-full border border-secondary text-secondary w-40 md:w-45"
              >
                Our Products
              </motion.button>
            </Link>
            <Link href={"/about-us"}>
              <motion.button
                whileHover={{
                  color: "#ffffff",
                  backgroundColor: "#00c950",
                  fontWeight: "normal",
                }}
                whileTap={
                  typeof window !== "undefined" && window.innerWidth >= 768
                    ? { backgroundColor: "#00A63E" }
                    : {}
                }
                className="text-xl font-bold py-2 rounded-full border border-secondary text-secondary w-40 md:w-45"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
