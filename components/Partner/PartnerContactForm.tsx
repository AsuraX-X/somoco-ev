"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Partner } from "@/lib/partners";

interface PartnerContactFormProps {
  partner: Partner;
  onBack: () => void;
}

const PartnerContactForm: React.FC<PartnerContactFormProps> = ({
  partner,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    region: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/partner-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          partnerName: partner.name,
          partnerEmail: partner.email,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", city: "", region: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to partners</span>
      </button>

      <h2 className="text-3xl font-bold mb-2 font-family-cera-stencil">
        {partner.name}
      </h2>
      <p className="text-gray-400 mb-6">
        Fill out the form below to get in touch with this partner.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="partner-name"
              className="block mb-1 text-secondary font-medium"
            >
              Name *
            </label>
            <input
              type="text"
              id="partner-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe"
              className="px-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="partner-email"
              className="block mb-1 text-secondary font-medium"
            >
              Email *
            </label>
            <input
              type="email"
              id="partner-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. john@example.com"
              className="px-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="partner-phone"
              className="block mb-1 text-secondary font-medium"
            >
              Phone
            </label>
            <input
              type="tel"
              id="partner-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 02000000000"
              className="px-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="partner-region"
              className="block mb-1 text-secondary font-medium"
            >
              Region
            </label>
            <input
              type="text"
              id="partner-region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g. Greater Accra"
              className="px-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="partner-city"
            className="block mb-1 text-secondary font-medium"
          >
            City
          </label>
          <input
            type="text"
            id="partner-city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Accra"
            className="px-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        {submitStatus === "success" && (
          <div className="text-green-500 text-sm">
            Thank you! Your inquiry has been sent to {partner.name}.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="text-red-500 text-sm">
            Sorry, there was an error sending your inquiry. Please try again.
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={
            !isSubmitting ? { backgroundColor: "#cecece", scale: 0.98 } : {}
          }
          className="px-6 py-3 cursor-pointer w-full rounded-full bg-secondary text-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? "Sending..." : "Send Inquiry"}
        </motion.button>
      </form>
    </div>
  );
};

export default PartnerContactForm;
