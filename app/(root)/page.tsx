"use client";
import Find from "@/components/Home/Find";
import Hero from "@/components/Home/Hero";
import Ready from "@/components/Home/Ready";
import Why from "@/components/Home/Why";
import { motion } from "motion/react";

// export const metadata = {
//   title: "SOMOCO EV — Home",
//   description:
//     "SOMOCO EV — Electric vehicles, products and company information.",
// };

const Home = () => {
  return (
    <div>
      <div>
        <Hero />
        <div className="w-screen absolute h-screen left-0 top-[74px] flex items-end justify-center">
          <motion.button
            initial={{ y: 50, opacity: 0, background: "#00101466" }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{
              backgroundColor: "#001014",
              transition: { duration: 0.3 },
            }}
            transition={{ ease: "easeInOut" }}
            className="border-secondary mb-40  backdrop-blur-xs text-2xl z-1 shadow-2xs cursor-pointer border rounded-full px-8 py-2"
          >
            Find Your Car
          </motion.button>
        </div>
        <Find />
      </div>
      <Why />
      <Ready />
    </div>
  );
};

export default Home;
