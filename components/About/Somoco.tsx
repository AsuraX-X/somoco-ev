import {
  Check,
  GraduationCap,
  Motorbike,
  PencilRuler,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const Somoco = () => {
  return (
    <div className="max-w-7xl px-4 mx-auto space-y-20 pb-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] rounded-2xl overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
          alt="People Meeting"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/60 to-primary/10 flex items-center">
          <div className="text-white px-8 md:px-16 space-y-4">
            <h1 className="font-family-cera-stencil text-4xl md:text-6xl font-bold">
              Somoco Ghana Limited
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl">
              Driving Ghana into a Cleaner, Smarter Future
            </p>
          </div>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-8 items-center"
      >
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Somoco Ghana Limited is a trusted partner to the world's leading
            automobile manufacturers, including <strong>Bajaj Auto</strong>, the
            World's No.1 and largest 3-wheeler manufacturer, and now{" "}
            <strong>BYD</strong>, one of the global pioneers in electric vehicle
            innovation.
          </p>
          <p>
            Since 2013, Somoco Ghana Limited has been the exclusive partner of
            Bajaj Auto Limited, introducing Boxer motorbikes and RE auto
            rickshaws to Ghana and the West African market to meet the growing
            demand for reliable individual mobility.
          </p>
        </div>
        <div className="relative h-[300px] rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
            alt="Motorcycle and vehicles"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </motion.div>

      {/* Partnership Highlights */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bajaj */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[##262626] text-white rounded-xl p-8 space-y-4 border border-secondary"
        >
          <div className="flex items-center gap-4 text-secondary">
            <div className="w-16 h-16 border border-secondary rounded-full flex items-center justify-center">
              <Motorbike />
            </div>
            <h3 className="font-family-cera-stencil text-2xl font-bold">
              Bajaj Auto
            </h3>
          </div>
          <p className="text-lg leading-relaxed">
            Since 2013, exclusive partner bringing Boxer motorbikes and RE auto
            rickshaws to West Africa.
          </p>
          <p className="text-sm opacity-90">
            World's #1 3-Wheeler Manufacturer
          </p>
        </motion.div>

        {/* BYD */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[##262626] text-white rounded-xl p-8 space-y-4 border border-secondary"
        >
          <div className="flex items-center gap-4 text-secondary">
            <div className="w-16 h-16 border border-secondary rounded-full flex items-center justify-center">
              <Zap />
            </div>
            <h3 className="font-family-cera-stencil text-2xl font-bold">
              BYD Electric
            </h3>
          </div>
          <p className="text-lg leading-relaxed">
            Partnering with BYD to introduce the Seagull - a modern, efficient,
            fully electric vehicle for sustainable transportation.
          </p>
          <p className="text-sm opacity-90">World's Leading EV Manufacturer</p>
        </motion.div>
      </div>

      {/* BYD Partnership Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"
              alt="Electric car charging"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="bg-primary text-white p-8 md:p-12 flex flex-col justify-center space-y-6">
            <h2 className="font-family-cera-stencil text-3xl font-bold">
              The Future is Electric
            </h2>
            <p className="text-lg leading-relaxed">
              As Somoco expands into the future of mobility, we are proud to
              partner with BYD (Build Your Dreams), the world's leading new
              energy vehicle manufacturer, to introduce the BYD Seagull.
            </p>
            <p className="text-lg leading-relaxed">
              This partnership marks a major milestone in our journey toward
              cleaner and more advanced mobility solutions in West Africa.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Service Network */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="font-family-cera-stencil text-3xl md:text-4xl font-bold text-secondary">
            Largest Service Network in Ghana
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Over the years, Somoco has built the largest and most widespread
            service network across Ghana, offering swift, efficient, and
            excellent customer service to motorists nationwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#262626] border border-secondary rounded-xl p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-secondary text-2xl font-bold">
              <PencilRuler />
            </div>
            <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
              Expert Technicians
            </h3>
            <p className="text-base leading-relaxed">
              Well-trained and certified technicians across the country
              providing professional maintenance services.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#262626] border border-secondary rounded-xl p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-secondary text-2xl font-bold">
              <Check />
            </div>
            <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
              Genuine Parts
            </h3>
            <p className="text-base leading-relaxed">
              Authentic spare parts and 6-12 months product warranty ensuring
              quality and reliability.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#262626] border border-secondary rounded-xl p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-secondary text-2xl font-bold">
              <GraduationCap />
            </div>
            <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
              Education & Support
            </h3>
            <p className="text-base leading-relaxed">
              Road safety education, expert maintenance advice, and tailored
              support programs.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Customer-Driven Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="gray-50 rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 border border-secondary rounded-full flex items-center justify-center mx-auto text-secondary">
            <Target size={30} />
          </div>
          <h2 className="font-family-cera-stencil text-3xl md:text-4xl font-bold text-secondary">
            Customer-Driven Excellence
          </h2>
          <p className="text-lg leading-relaxed text-white">
            As a customer-driven company, Somoco continues to deliver
            exceptional Aftersales Support Services with well-trained and
            certified technicians across the country. Our commitment to
            excellence ensures that every customer receives the best service and
            support.
          </p>
        </div>
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative h-[350px] rounded-2xl overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=1600&q=80"
          alt="Modern city skyline"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent flex items-end">
          <div className="text-white px-8 md:px-16 pb-12 space-y-4">
            <h2 className="font-family-cera-stencil text-3xl md:text-5xl font-bold leading-tight">
              Driving Ghana into a Cleaner, Smarter, and More Sustainable
              Automotive Future
            </h2>
            <p className="text-xl opacity-90">
              With BYD's cutting-edge electric mobility solutions
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Somoco;
