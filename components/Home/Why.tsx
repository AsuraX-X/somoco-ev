"use client";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

const Why = () => {
  const parent = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, { once: true });

  return (
    <div className="w-full flex flex-col bg-primary/80 items-center gap-6 md:gap-8 justify-center h-screen relative">
      <Image
        fill
        height={0}
        src="/banner-PC.jpg"
        alt="Byd Song"
        unoptimized
        className="-z-1 absolute object-cover"
      />
      <h1 className="font-family-cera-stencil text-3xl md:text-4xl">
        Why Choose Somoco
      </h1>
      <motion.div
        variants={parent}
        ref={ref}
        initial="hidden"
        animate={inView && "visible"}
        className="grid grid-cols-1 text-center md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-10"
      >
        <motion.div
          variants={child}
          className=" bg-linear-to-t from-primary to-primary/50 rounded-lg mb-2 h-full flex flex-col justify-center py-4 px-6"
        >
          <h1 className=" text-xl md:text-2xl">Carefully Selected Range</h1>
          <p className="text-sm">
            We offer a curated selection of EVs chosen for quality, efficiency,
            and long-term reliability. Every model meets our standards, so you
            can shop confidently without sifting through endless options.
          </p>
        </motion.div>
        <motion.div
          variants={child}
          className=" bg-linear-to-t from-primary to-primary/50 rounded-lg mb-2 h-full flex flex-col justify-center py-4 px-6"
        >
          <h1 className=" text-xl md:text-2xl">
            Vehicle Service & Maintenance
          </h1>
          <p className="text-sm">
            Your EV is handled by technicians trained in the latest electric
            systems. We provide dependable maintenance, battery health checks,
            and diagnostics to keep your vehicle performing smoothly and safely.
          </p>
        </motion.div>
        <motion.div
          variants={child}
          className=" bg-linear-to-t from-primary to-primary/50 rounded-lg mb-2 h-full flex flex-col justify-center py-4 px-6"
        >
          <h1 className=" text-xl md:text-2xl">Financing Made Easy</h1>
          <p className="text-sm">
            From flexible payment plans to EV-friendly incentives, we simplify
            every step of the financing process. Our team helps you secure
            competitive rates and choose the option that fits your budget.
          </p>
        </motion.div>
      </motion.div>
      <div>
        <Link href={"/about-us"}>
          <motion.button
            initial={{ background: "#00101466" }}
            whileHover={{ background: "#001014" }}
            className="px-4 py-2 backdrop-blur-xs cursor-pointer rounded-full border"
          >
            About Somoco
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Why;
