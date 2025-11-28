"use client";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getPartners, Partner } from "@/lib/partners";
import { urlFor } from "@/sanity/lib/image";
import { useModal } from "@/components/General/ContactModalProvider";

const FinanceSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { openPartners, openPartnerContact } = useModal();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="h-screen relative">
      <Image
        src={"/asset-finance.png"}
        fill
        alt="Asset finance partner"
        className="-z-1 object-cover"
      />
      <div className="size-full gap-10 px-6 bg-primary/70 text-center flex flex-col items-center justify-center">
        <div className="max-w-4xl  mx-auto">
          <h1 className="font-family-cera-stencil mb-2 text-3xl md:text-4xl">
            Choose Your Asset Finance Partner
          </h1>
          <p className="text-gray-300 mx-auto">
            Partner with leading asset finance providers to make your electric
            vehicle purchase seamless and affordable. Our trusted partners offer
            competitive rates, flexible terms, and expert guidance to help you
            drive home your dream EV today.
          </p>
        </div>
        <div
          className={`w-full ${
            partners.length < 6 && "lg:justify-center"
          } flex overflow-x-scroll rounded-lg gap-4`}
        >
          {loading ? (
            <div className="text-center place-content-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                className="rounded-full h-12 w-12 border-2 border-b-transparent border-t-transparent flex items-center justify-center border-secondary mx-auto mb-4"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 0.5,
                  }}
                  className="rounded-full h-9 w-9 border-2 border-b-transparent border-t-transparent"
                />
              </motion.div>
            </div>
          ) : partners.length > 0 ? (
            partners.map((partner) => (
              <motion.button
                key={partner._id}
                onClick={() => openPartnerContact(partner)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="size-50 shrink-0 relative border bg-primary rounded-lg cursor-pointer hover:border-secondary/50 transition-colors"
              >
                <Image
                  src={urlFor(partner.logo).auto("format").quality(80).url()}
                  fill
                  alt={partner.name}
                  className="object-contain p-4"
                />
              </motion.button>
            ))
          ) : (
            <div className="flex items-center justify-center w-full py-8 text-gray-400">
              No partners available
            </div>
          )}
        </div>
        <div>
          <motion.button
            onClick={openPartners}
            initial={{ background: "#00101466" }}
            whileHover={{ background: "#001014" }}
            className="px-4 py-2 backdrop-blur-xs cursor-pointer rounded-full border"
          >
            Our Partners
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FinanceSection;
