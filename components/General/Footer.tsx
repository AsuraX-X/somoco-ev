"use client";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const Footer = () => {
  return (
    <section className="px-8 flex sm:flex-row flex-col justify-center gap-10 py-10  sm:justify-between sm:items-center">
      <div>
        <h2 className="text-xl sm:text-3xl font-family-cera-stencil mb-2 text-secondary">
          Quick Links
        </h2>
        <ul className="flex sm:flex-row flex-col sm:divide-x">
          <motion.li
            className=" cursor-pointer sm:pr-2 underline-offset-4 w-fit"
            whileHover={{
              textDecorationLine: "underline",
              color: "#cecece",
            }}
          >
            <Link href={"/"}>FAQ's</Link>
          </motion.li>
          <motion.li
            className=" cursor-pointer sm:px-2 underline-offset-4 w-fit"
            whileHover={{
              textDecorationLine: "underline",
              color: "#cecece",
            }}
          >
            <Link href={"/about-us"}> About Us</Link>
          </motion.li>
          <motion.li
            className=" cursor-pointer sm:px-2 underline-offset-4 w-fit"
            whileHover={{
              textDecorationLine: "underline",
              color: "#cecece",
            }}
          >
            <Link href={"/"}>Aftersales Service</Link>
          </motion.li>
          <motion.li
            className=" cursor-pointer sm:px-2 underline-offset-4 w-fit"
            whileHover={{
              textDecorationLine: "underline",
              color: "#cecece",
            }}
          >
            <Link href={"/contact"}>Charging Solutions</Link>
          </motion.li>
          <motion.li
            className=" cursor-pointer sm:pl-2 underline-offset-4 w-fit"
            whileHover={{
              textDecorationLine: "underline",
              color: "#cecece",
            }}
          >
            <Link href={"/contact"}>Contact Us</Link>
          </motion.li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
          className="border border-secondary p-2 rounded-full cursor-pointer"
        >
          <Facebook />
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
          className="border border-secondary p-2 rounded-full cursor-pointer"
        >
          <Instagram />
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
          className="border border-secondary p-2 rounded-full cursor-pointer"
        >
          <Linkedin />
        </motion.button>
      </div>
    </section>
  );
};

export default Footer;
