"use client";
import { Parameter } from "@/app/vehicles/[id]/page";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ParameterSection = ({
  title,
  parameters,
}: {
  title: string;
  parameters?: Parameter[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold font-family-cera-stencil text-secondary mb-4">
          {title}
        </h3>
        <motion.button
          onTap={() => setIsOpen(!isOpen)}
          animate={{ rotate: isOpen ? 135 : 0 }}
        >
          <Plus />
        </motion.button>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="flex flex-col divide-y divide-secondary border overflow-hidden border-secondary rounded-sm"
      >
        {parameters?.map((param, index) => (
          <div key={index} className="bg-white/5 p-4">
            <p>
              <span className="text-white/70 text-sm mb-1">{param.name}: </span>
              {param.value}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ParameterSection;
