"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { getPartners, Partner } from "@/lib/partners";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface PartnersListProps {
  onSelectPartner: (partner: Partner) => void;
}

const PartnersList: React.FC<PartnersListProps> = ({ onSelectPartner }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 font-family-cera-stencil">
        Our Partners
      </h2>

      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search partners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            className="rounded-full h-12 w-12 border-2 border-b-transparent border-t-transparent border-secondary"
          />
        </div>
      ) : filteredPartners.length > 0 ? (
        <div
          data-lenis-prevent
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2"
        >
          {filteredPartners.map((partner) => (
            <motion.button
              key={partner._id}
              onClick={() => onSelectPartner(partner)}
              className="relative aspect-square bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 rounded-lg p-4 transition-colors cursor-pointer"
            >
              <Image
                src={urlFor(partner.logo).auto("format").quality(80).url()}
                fill
                alt={partner.name}
                className="object-contain p-4"
              />
              <span className="absolute bottom-2 left-2 right-2 text-xs text-center text-gray-300 truncate">
                {partner.name}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          {searchTerm
            ? "No partners found matching your search."
            : "No partners available."}
        </div>
      )}
    </div>
  );
};

export default PartnersList;
