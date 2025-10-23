"use client";

import { motion } from "motion/react";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
      console.error("Error sending contact form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-white font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
          placeholder="Your name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-white font-medium">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
          placeholder="Your phone number"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-white font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
          placeholder="your.email@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-white font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={
          status !== "loading"
            ? {
                backgroundColor: "#00c950",
                scale: 1.02,
              }
            : {}
        }
        whileTap={
          status !== "loading"
            ? {
                backgroundColor: "#00a63e",
                scale: 0.98,
              }
            : {}
        }
        className="px-6 py-3 rounded-full bg-secondary text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </motion.button>

      {status === "success" && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-secondary text-center font-medium"
        >
          Message sent successfully! We'll get back to you soon.
        </motion.p>
      )}

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-center font-medium"
        >
          {errorMessage}
        </motion.p>
      )}
    </form>
  );
};

export default ContactForm;
