"use client";
import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ContactForm from "./ContactForm";
import PartnerContactForm from "../Partner/PartnerContactForm";
import PartnersList from "../Partner/PartnersList";
import { X } from "lucide-react";
import { Partner } from "@/lib/partners";

type ModalType = "contact" | "partners" | "partner-contact" | null;

type ModalContextType = {
  activeModal: ModalType;
  selectedPartner: Partner | null;
  openContact: () => void;
  openPartners: () => void;
  openPartnerContact: (partner: Partner) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const openContact = () => {
    setActiveModal("contact");
    setSelectedPartner(null);
  };

  const openPartners = () => {
    setActiveModal("partners");
    setSelectedPartner(null);
  };

  const openPartnerContact = (partner: Partner) => {
    setSelectedPartner(partner);
    setActiveModal("partner-contact");
  };

  const close = () => {
    setActiveModal(null);
    setSelectedPartner(null);
  };

  const handleBackToPartners = () => {
    setActiveModal("partners");
    setSelectedPartner(null);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        selectedPartner,
        openContact,
        openPartners,
        openPartnerContact,
        close,
      }}
    >
      {children}

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 backdrop-blur-2xl flex items-center justify-center"
            onClick={close}
          >
            <div
              className="relative w-full max-w-3xl bg-primary/95 h-full flex flex-col justify-center sm:h-fit sm:rounded-2xl border border-white/10 p-6 sm:mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                aria-label="Close modal"
              >
                <X />
              </button>

              {activeModal === "contact" && (
                <>
                  <h2 className="text-3xl font-bold mb-4 font-family-cera-stencil">
                    Contact Us
                  </h2>
                  <ContactForm />
                </>
              )}

              {activeModal === "partners" && (
                <PartnersList onSelectPartner={openPartnerContact} />
              )}

              {activeModal === "partner-contact" && selectedPartner && (
                <PartnerContactForm
                  partner={selectedPartner}
                  onBack={handleBackToPartners}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const ContactModalProvider = ModalProvider;
export default ModalProvider;
