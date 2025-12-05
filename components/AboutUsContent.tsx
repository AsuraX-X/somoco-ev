"use client";
import { motion } from "motion/react";
import Image from "next/image";

const AboutUsContent = () => {
  return (
    <div className=" w-full mx-auto overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[60vh] md:h-screen overflow-hidden"
      >
        <Image
          src="/company.jpg"
          alt="People Meeting"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/20 flex items-center">
          <div className="text-white mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl sm:text-6xl font-family-cera-stencil">
              Who Are We?
            </h1>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="max-w-4xl space-y-5 py-12 text-center mx-auto px-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-2xl sm:text-4xl font-family-cera-stencil">
          Somoco Ghana Limited{" "}
        </p>
        <p className="  text-sm sm:text-base">
          Somoco Ghana Limited, as subsidiary of the Mohinani Group brings over
          ten years of expertise as a leader in Ghana's mobility sector. We have
          built our reputation as a credible partner by delivering an end-to-end
          mobility ecosystem, encompassing local assembly, distribution, and
          robust aftersales service.
        </p>
        <p className="  text-sm sm:text-base">
          We are proud to be associated with offering the best and most trusted
          brands both locally and internationally with long term growth agenda
          and clear objective to improve the quality of Life for everyone and
          anyone who comes into contact with our solutions either directly or
          indirectly.
        </p>
        <p className="  text-sm sm:text-base">
          Our focus is on practical, eco-friendly transportation solutions
          engineered for Ghana's specific urban and territorial challenges.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 bg-white/5 min-h-[60vh] md:h-screen sm:grid-cols-2">
        <div className="relative sm:h-full h-[60vh]">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.02 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={"/sustainability.png"}
              className="object-cover"
              fill
              alt="Sustain image"
            />
          </motion.div>
        </div>
        <motion.div
          className="flex flex-col gap-4 justify-center px-4 pb-8 pt-4 sm:px-20"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-xl sm:text-3xl font-family-cera-stencil">
            Sustainability
          </h1>
          <p>
            Our dedication extends beyond launching electric vehicles. By
            merging global EV technology with local assembly, we drastically cut
            the carbon impact of both logistics and manufacturing. This local
            strategy not only makes green transportation more affordable but
            also boosts the local economy.
          </p>
          <motion.button
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            className="w-fit border px-6 rounded-full py-4"
          >
            Discover
          </motion.button>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 bg-white/5 min-h-[60vh] md:h-screen sm:grid-cols-2">
        <motion.div
          className="flex order-2 pt-4 pb-16 sm:order-1 flex-col gap-4 justify-center px-4 sm:px-20"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-xl sm:text-3xl font-family-cera-stencil">
            Careers
          </h1>
          <p>
            We're leading Ghana's transition to electric mobility, and your
            expertise can make the difference. Whether you're innovating
            technology, building partnerships, or reducing emissions, you'll
            create lasting change. This is your chance to build a meaningful
            career while powering sustainable progress acrossGhana.
          </p>
          <motion.button
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            className="w-fit border px-6 rounded-full py-4"
          >
            Discover
          </motion.button>
        </motion.div>
        <div className="relative h-[60vh] sm:h-full order-1">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.02 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={"/career.png"}
              className="object-cover object-left"
              fill
              alt="Career image"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
