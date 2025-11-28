"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Ready = () => {
  const text = "Ready To Drive The Future?";

  const chars = text.split("");

  return (
    <div className="h-screen bg-primary/40 w-full relative flex flex-col items-center justify-center gap-6 text-center md:gap-8">
      <Image
        src="/inner.png"
        alt="Ready to Drive Electric"
        unoptimized
        fill
        className="object-cover -z-1"
      />
      <h1 className="sm:text-6xl text-5xl font-family-cera-stencil capitalize">
        {chars.map((char, index) => (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              delay: index * 0.05,
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 6,
            }}
            key={index}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <Link href={"/products"}>
        <motion.button
          initial={{ background: "#00101466" }}
          whileHover={{ background: "#001014" }}
          className="px-4 text-2xl py-2 backdrop-blur-xs cursor-pointer rounded-full border"
        >
          Start Now
        </motion.button>
      </Link>
    </div>
  );
};

export default Ready;
