"use client";
import React, { useRef, useState } from "react";
import Section from "./Section";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

const Sections = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const transformVal = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const [x, setX] = useState("0");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // can be used for debugging or triggering animations based on scroll progress
    console.log("Scroll progress:", latest);
    setX(`${transformVal.get()}vw`);
  });

  return (
    <div ref={ref} className="h-[400vh]">
      <motion.div style={{ x }} className="flex h-screen sticky top-0">
        <Section
          carName="Xpeng G6"
          carImage="/xpeng.jpg"
          spec1="EPA EST. RANGE"
          spec1Value="Up to 427 Km"
          spec2="0–100 km/h (AWD)"
          spec2Value="In 4.13 s"
        />
        <Section
          carName="NIO ONVO L90"
          carImage="/l90.jpg"
          spec1="EPA EST. RANGE"
          spec1Value="Up to 570 Km"
          spec2="POWER"
          spec2Value="Up to 440 kw"
        />
        <Section
          carName="Tesla Model Y"
          carImage="/tesla.jpg"
          spec1="EPA EST. RANGE"
          spec1Value="Up to 321 Km"
          spec2="POWER"
          spec2Value="Up to 331kw"
        />
      </motion.div>
    </div>
  );
};

export default Sections;
