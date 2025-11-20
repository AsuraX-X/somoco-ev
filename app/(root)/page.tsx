"use client";
import Find from "@/components/Home/Find";
import Hero from "@/components/Home/Hero";
import { motion } from "motion/react";

// export const metadata = {
//   title: "SOMOCO EV — Home",
//   description:
//     "SOMOCO EV — Electric vehicles, products and company information.",
// };

const Home = () => {
  return (
    <div>
      <Hero />
      <div className="w-screen absolute h-screen left-0 top-[74px] flex items-end justify-center">
        <motion.button
          whileHover={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
          whileTap={{
            backgroundColor: "#cecece",
            color: "#000000",
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut" }}
          className="border-secondary bg-primary/40 mb-40  backdrop-blur-xs text-2xl z-1 shadow-2xs cursor-pointer border rounded-full px-8 py-2"
        >
          Find Your Car
        </motion.button>
      </div>
      <Find />
    </div>
  );
};

export default Home;
