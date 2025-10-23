"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { RefObject, useRef } from "react";

const Section2 = ({
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
        className="bg-cover bg-center absolute inset-0 text-white bg-[url(/EVsunrise.png)]"
      >
        <motion.div
          style={{ y: textY }}
          className="w-full h-full bg-black/50 flex flex-col justify-center px-4 sm:px-16 gap-4"
        >
          <h1 className="text-4xl sm:text-6xl font-bold font-family-cera-stencil">
            SOMOCO EV
          </h1>
          <p className="max-w-3xl text-xl sm:text-2xl">
            We are <span className="text-secondary">leading the charge</span>{" "}
            toward a cleaner, smarter future,pioneering electric mobility in
            Ghana through innovation and sustainable performance.
          </p>
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
            className="px-4 text-xl font-bold py-2 rounded-full border border-secondary text-secondary w-fit"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Section2;
