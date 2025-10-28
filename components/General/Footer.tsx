"use client";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useContactModal } from "./ContactModalProvider";
import { usePathname } from "next/navigation";

const Footer = () => {
  const { open } = useContactModal();
  const pathname = usePathname();

  // Hide footer on studio and admin routes
  if (
    !pathname ||
    pathname.startsWith("/studio") ||
    pathname.includes("/admin")
  ) {
    return null;
  }

  return (
    <footer className="bg-white/3 border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-family-cera-stencil text-secondary">
              SOMOCO EV
            </h3>
            <p className="text-sm text-white/70 max-w-sm">
              Official Somoco electric vehicles distributor — sales, service and
              charging solutions across the region.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="tel:+233540105129"
                className="flex items-center gap-2 text-white/80 hover:text-white"
              >
                <Phone size={18} />{" "}
                <span className="text-sm">+233 540 105 129</span>
              </a>
              <a
                href="mailto:cs@somotex.com"
                className="flex items-center gap-2 text-white/80 hover:text-white"
              >
                <Mail size={18} />{" "}
                <span className="text-sm">cs@somotex.com</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:items-start">
            <h4 className="text-lg font-bold mb-3">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
              <Link href="/about-us" className="hover:text-white">
                About Us
              </Link>
              <button
                onClick={() => open()}
                className="hover:text-white text-left"
              >
                Contact
              </button>
              <Link href="/" className="hover:text-white">
                Aftersales
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-3">Follow Us</h4>
            <div className="flex items-center gap-3">
              <motion.a
                href="#"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                className="border border-secondary p-2 rounded-full cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                className="border border-secondary p-2 rounded-full cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                className="border border-secondary p-2 rounded-full cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </motion.a>
            </div>

            {/* Newsletter removed per request */}
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Somoco. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
