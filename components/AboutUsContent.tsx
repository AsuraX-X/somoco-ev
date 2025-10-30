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
          src="https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
          alt="People Meeting"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/20 flex items-center">
          <div className="text-white mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl sm:text-6xl font-family-cera-stencil">
              Company
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
        <p className="text-sm sm:text-base">
          Somoco Ghana Limited bringsover ten years of expertise as a leader in
          Ghana's mobility sector. We have built our reputation a sa credible
          partner by delivering an end-to-end mobility ecosystem, encompassing
          local assembly, distribution, and robust aftersalesservice.
        </p>
        <p className="text-sm sm:text-base">
          Our focus is on practical, eco-friendly transportation solutions
          engineered for Ghana's specific urban and territorial challenges.
        </p>
        <p className="text-sm sm:text-base">
          Through our Somoco EV division, we are advancing the nation's
          sustainable future by integrating international EV technology with
          local operations, making electric mobility a viable and efficient
          choice for individuals and businesses.
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
              src={"/sustain.jpg"}
              className="object-cover"
              fill
              alt="Career image"
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
          <p className="text-base sm:text-xl">
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
          <p className="text-base sm:text-xl">
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
              src={"/career.jpg"}
              className="object-cover"
              fill
              alt="Sunstainability image"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
