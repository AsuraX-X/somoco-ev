"use client";
import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ContactForm from "./ContactForm";
import { X } from "lucide-react";

type ContactContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ContactContext = createContext<ContactContextType | undefined>(
  undefined
);

export const useContactModal = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactProvider");
  return ctx;
};

export const ContactModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ContactContext.Provider value={{ isOpen, open, close }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 backdrop-blur-2xl flex items-center justify-center"
            onClick={close}
          >
            <div
              className="relative w-full max-w-3xl bg-primary/95 h-full sm:h-fit sm:rounded-2xl border border-white/10 p-6 sm:mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                aria-label="Close contact form"
              >
                <X />
              </button>

              <h2 className="text-3xl font-bold mb-4 font-family-cera-stencil">Contact Us</h2>
              <ContactForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ContactContext.Provider>
  );
};

export default ContactModalProvider;
