import { Check, Dot, Earth, Handshake, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const Mohinani = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
          alt="Modern business buildings"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/60 to-primary/10 flex items-center">
          <div className="text-white px-8 md:px-16 space-y-4">
            <h1 className="font-family-cera-stencil text-4xl md:text-6xl font-bold">
              Mohinani Group
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl">
              Building Tomorrow's Africa, Today
            </p>
          </div>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 items-center"
      >
        <motion.div variants={itemVariants} className="space-y-6 text-lg">
          <p>
            The Mohinani Group is a 3rd generation leading family business and
            we are proud to be associated with offering the best and most
            trusted brands both locally and internationally. Our business
            operation spans from packaging, consumer durable distribution,
            electronics retail, real estate, quick service restaurants and
            hospitality.
          </p>
          <p>
            In West Africa, we command leadership and enviable reputation in the
            Packaging Industry, especially for manufacturing solutions that meet
            the entire packaging needs of industries across the African
            continent.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="relative h-[300px] rounded-xl overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
            alt="Business team collaboration"
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border border-secondary rounded-2xl p-8 md:p-12 text-secondary"
      >
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="font-family-cera-stencil text-5xl font-bold">50+</h3>
            <p className="text-xl">Years of Excellence</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-family-cera-stencil text-5xl font-bold">
              3,000+
            </h3>
            <p className="text-xl">Employees</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-family-cera-stencil text-5xl font-bold">#1</h3>
            <p className="text-xl">Leader in West Africa</p>
          </div>
        </div>
      </motion.div>

      {/* Our Approach */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        <motion.h2
          variants={itemVariants}
          className="font-family-cera-stencil text-3xl md:text-4xl font-bold text-primary"
        >
          Our Approach
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-justify leading-relaxed"
        >
          The Mohinani Group believes that each employee is accountable for
          everything we do in achieving outstanding results by growing
          sustainable brands through innovation, consistency and efficiency. We
          focus on building and nurturing an all inclusive successful
          relationships. We make sure we stay grounded in all that we do to the
          benefit of our employees, communities and environment.
        </motion.p>
      </motion.div>

      {/* Vision & Mission Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#262626] border border-secondary rounded-xl p-8 space-y-4"
        >
          <div className="w-16 h-16 rounded-full border border-secondary flex items-center justify-center text-secondary text-2xl font-bold">
            V
          </div>
          <h3 className="font-family-cera-stencil text-2xl font-bold text-secondary">
            Our Vision
          </h3>
          <p className="text-lg leading-relaxed">
            Our vision is to be the leading company in chosen English speaking
            sub-Saharan Africa markets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#262626] border border-secondary rounded-xl p-8 space-y-4"
        >
          <div className="w-16 h-16 rounded-full border border-secondary flex items-center justify-center text-secondary text-2xl font-bold">
            M
          </div>
          <h3 className="font-family-cera-stencil text-2xl font-bold text-secondary">
            Our Mission
          </h3>
          <p className="text-lg leading-relaxed mb-4">
            We deliver global quality products and solutions to the local
            consumers of Sub-Saharan Africa through strategic partnerships.
          </p>
          <ul className="space-y-2 text-lg">
            <li className="flex items-center gap-2">
              <span className="text-primary mt-1">
                <Dot />
              </span>
              <span>Plastics and Packaging Manufacturing</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary mt-1">
                <Dot />
              </span>
              <span>Trade and Distribution - Industrial and Consumers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary mt-1">
                <Dot />
              </span>
              <span>Real Estate and Hospitality</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Core Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <h2 className="font-family-cera-stencil text-3xl md:text-4xl font-bold text-center text-secondary">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* People */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#262626] border-2 border-secondary rounded-xl p-6 space-y-4   "
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12  border border-secondary text-secondary rounded-full flex items-center justify-center">
                <Users />
              </div>
              <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
                Our Essence is People
              </h3>
            </div>
            <p className="text-base leading-relaxed">
              People are the essence of the Mohinani Group. While we strive to
              deliver great products and services, we recognize that it is
              people that make this possible. Ultimately, at the Mohinani Group
              it is people first, business second.
            </p>
          </motion.div>

          {/* Accountability */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#262626] border-2 border-secondary rounded-xl p-6 space-y-4   "
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12  border border-secondary text-secondary rounded-full flex items-center justify-center">
                <Check />
              </div>
              <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
                The Buck Stops with Me
              </h3>
            </div>
            <p className="text-base leading-relaxed">
              We believe that each employee is accountable for everything we do
              in achieving outstanding results. What you say you are going to
              do, you do. What you are responsible for, you focus on. What you
              see, you act on.
            </p>
          </motion.div>

          {/* Long Term Partnership */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#262626] border-2 border-secondary rounded-xl p-6 space-y-4   "
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12  border border-secondary text-secondary rounded-full flex items-center justify-center">
                <Handshake />
              </div>
              <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
                Partners for the Long Haul
              </h3>
            </div>
            <p className="text-base leading-relaxed">
              Being a multi-generational family business means we have built
              many relationships over many years. It is this commitment to the
              long haul that supports us in the good times and gets us through
              the bad ones.
            </p>
          </motion.div>

          {/* Grounded */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#262626] border-2 border-secondary rounded-xl p-6 space-y-4   "
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12  border border-secondary text-secondary rounded-full flex items-center justify-center">
                <Earth />
              </div>
              <h3 className="font-family-cera-stencil text-xl font-bold text-secondary">
                Feet on the Ground
              </h3>
            </div>
            <p className="text-base leading-relaxed">
              To stay grounded you have to be conscious and aware of what is
              going on around you. We make sure that we stay grounded in all
              that we do to the benefit of our employees, communities and the
              environment.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quote Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative h-[300px] rounded-2xl overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
          alt="Office workspace"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-white px-8 text-center max-w-4xl space-y-4">
            <p className="text-xl md:text-3xl italic leading-relaxed">
              "Through common alignment on these values as an organization, we
              strengthen our foundation and grow with purpose"
            </p>
            <p className="font-family-cera-stencil text-xl">
              - Mr. Ramchand Mohinani, Chairman
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Mohinani;
