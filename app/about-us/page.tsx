"use client";
import Mohinani from "@/components/About/Mohinani";
import Somoco from "@/components/About/Somoco";
import Footer from "@/components/General/Footer";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

const AboutUs = () => {
  const [company, setCompany] = useState("moh");

  return (
    <div>
      <div className="w-full h-80 text-white font-family-cera-stencil text-6xl font-bold flex items-center justify-center bg-secondary">
        <h1>About Us</h1>
      </div>
      <div className="flex items-center justify-center text-xl sm:gap-6 font-family-cera-stencil py-6">
        <motion.button
          animate={{
            borderColor: company === "moh" ? "#00c950" : "#ffffff",
          }}
          className="w-60 h-25 sm:h-auto cursor-pointer font-bold border-b-5"
          onClick={() => setCompany("moh")}
        >
          Mohinani Group
        </motion.button>
        <motion.button
          animate={{
            borderColor: company === "som" ? "#00c950" : "#ffffff",
          }}
          className="w-60 h-25 sm:h-auto cursor-pointer font-bold border-b-5"
          onClick={() => setCompany("som")}
        >
          Somoco Ghana Limited
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        {company === "moh" ? (
          <motion.div
            key="mohinani"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Mohinani />
          </motion.div>
        ) : (
          <motion.div
            key="somoco"
            initial={{ x: "100%", opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Somoco />
          </motion.div>
        )}
      </AnimatePresence>
      <div></div>
    </div>
  );
};

export default AboutUs;
