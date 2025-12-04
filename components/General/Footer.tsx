"use client";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useContactModal } from "./ContactModalProvider";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Footer = () => {
  const { open } = useContactModal();
  const pathname = usePathname();
  const [t, setT] = useState(false);
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
              Distribution, Sales and Aftersales Care.
            </p>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex">
                <Phone size={18} />{" "}
                <a
                  href="tel:+233540105131"
                  className="flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <span className="text-sm">+233 540 105 131</span>
                </a>
                <a
                  href="tel:+233531033489"
                  className="flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <span className="text-sm"> | +233 531 033 489</span>
                </a>
              </div>
              <a
                href="mailto:marketing1@somotex.com"
                className="flex items-center gap-2 text-white/80 hover:text-white"
              >
                <Mail size={18} />{" "}
                <span className="text-sm">marketing1@somotex.com</span>
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
                Aftersales Care
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-3">Follow Us</h4>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://www.facebook.com/somocoghltd/"
                target="_blank"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                whileTap={{ opacity: 0.8 }}
                className="border border-secondary p-2 rounded-full cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/somoco.ev/"
                target="_blank"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                whileTap={{ opacity: 0.8 }}
                className="border border-secondary p-2 rounded-full cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@somoco.ev"
                target="_blank"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                onHoverStart={() => setT(true)}
                onHoverEnd={() => setT(false)}
                whileTap={{ opacity: 0.8 }}
                className="border border-secondary p-2 rounded-full cursor-pointer"
                aria-label="Tiktok"
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    animate={{ stroke: t ? "#000000" : "#ffffff" }}
                    d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
                    stroke="#ffffff"
                    strokeWidth={2}
                    stroke-linejoin="round"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="https://gh.linkedin.com/company/somoco-ghana-limited"
                target="_blank"
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
                whileTap={{ opacity: 0.8 }}
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
