"use client";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { location } from "./locations";

const LocationSection = ({
  location,
  index,
  s,
  o,
}: {
  location: location;
  index: number;
  s: (i: number | null) => void;
  o: number | null;
}) => {
  return (
    <motion.div
      initial={{ paddingBottom: 0 }}
      animate={{ paddingBottom: o === index ? 32 : 0 }}
      className="border-b-2 pt-4 border-secondary pb-8"
    >
      <div className="flex items-center pb-4 justify-between">
        <h3 className="text-xl sm:text-2xl font-bold font-family-cera-stencil">
          {location.place}
        </h3>
        <motion.button
          onTap={() => (o === index ? s(null) : s(index))}
          animate={{ rotate: o === index ? 135 : 0 }}
        >
          <Plus />
        </motion.button>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: o === index ? "auto" : 0 }}
        className="overflow-hidden grid grid-cols-1 gap-8 sm:gap-0 sm:grid-cols-2"
      >
        <div className="flex sm:pr-4 flex-col gap-2">
          <p>
            <span className="sm:text-xl text-secondary">Address: </span>
            <motion.a
              whileHover={{ color: "#57ff9a", textDecorationLine: "underline" }}
              href={location.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {location.address}
            </motion.a>
          </p>
          <p>
            <span className="sm:text-xl text-secondary">Phone: </span>
            <motion.a
              whileHover={{ color: "#57ff9a", textDecorationLine: "underline" }}
              href={`tel:${location.phone}`}
            >
              {location.phone}
            </motion.a>
          </p>
        </div>
        <div className="sm:pl-4">
          <iframe
            src={location.map}
            className="h-60 rounded-lg w-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />{" "}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LocationSection;
