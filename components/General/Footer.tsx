"use client";

import { motion } from "motion/react";
import ContactForm from "./ContactForm";
import Link from "next/link";
import { useEffect, useState } from "react";

motion;
const Footer = () => {
  const [vehicleTypes, setVehicleTypes] = useState<string[]>();

  useEffect(() => {
    // Fetch unique vehicle types from the database
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const result = await response.json();

        // Extract unique types from vehicles
        const types = [
          ...new Set(result.data.map((v: any) => v.type).filter(Boolean)),
        ];
        setVehicleTypes(types as string[]);
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };

    fetchVehicleTypes();
  }, []);

  return (
    <div className="min-h-screen border-t-white border-t-2 px-10 sm:px-0 bg-primary flex flex-col divide-y sm:divide-y-0 sm:divide-x py-10 sm:flex-row snap-center text-white">
      <div className="flex-1 py-10  sm:px-12 flex items-center justify-center flex-col">
        <div className="flex w-full flex-col gap-10">
          <div className="flex justify-between">
            <div className="flex-1">
              <h2 className="text-xl sm:text-3xl font-family-cera-stencil mb-2 text-secondary">
                Our Products
              </h2>
              <ul>
                {vehicleTypes && vehicleTypes.length > 0 ? (
                  vehicleTypes.map((type) => (
                    <motion.li
                      whileHover={{
                        textDecorationLine: "underline",
                        color: "#00c950",
                      }}
                      className="w-fit underline-offset-4 "
                      key={type}
                    >
                      <Link href={`/products?type=${encodeURIComponent(type)}`}>
                        {type}
                      </Link>
                    </motion.li>
                  ))
                ) : (
                  <div className="text-white/60">
                    No product types available
                  </div>
                )}
              </ul>
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-3xl font-family-cera-stencil mb-2 text-secondary">
                Quick Links
              </h2>
              <ul>
                <motion.li
                  className=" cursor-pointer underline-offset-4 w-fit"
                  whileHover={{
                    textDecorationLine: "underline",
                    color: "#00c950",
                  }}
                >
                  <Link href={"/about-us"}> About Us</Link>
                </motion.li>
                <motion.li
                  className=" cursor-pointer underline-offset-4 w-fit"
                  whileHover={{
                    textDecorationLine: "underline",
                    color: "#00c950",
                  }}
                >
                  <Link href={"/products"}>Products</Link>
                </motion.li>
                <motion.li
                  className=" cursor-pointer underline-offset-4 w-fit"
                  whileHover={{
                    textDecorationLine: "underline",
                    color: "#00c950",
                  }}
                >
                  <Link href={"/contact"}>Contact Us</Link>
                </motion.li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-family-cera-stencil mb-2 text-secondary">
              Can we help you?
            </h2>
            <ul>
              <li>
                <span className="text-secondary">Email: </span>
                <a
                  href="mailto:cs@somotex.com"
                  className="hover:underline underline-offset-4"
                >
                  cs@somotex.com
                </a>
              </li>
              <li>
                <span className="text-secondary">Phone: </span>
                <a
                  href="tel:+233501578360"
                  className="hover:underline underline-offset-4"
                >
                  0501578360
                </a>
                {" / "}
                <a
                  href="tel:+233247970012"
                  className="hover:underline underline-offset-4"
                >
                  0247970012
                </a>
              </li>
              <li>
                <span className="text-secondary">Address: </span>
                <a
                  href="https://maps.app.goo.gl/WEjnomT9AKM9K6gj7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-4"
                >
                  North Industrial Area, Dadeban Road, Opposite Duraplast
                </a>
              </li>
            </ul>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.907697423404!2d-0.2234263!3d5.5806614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a1e370781dd%3A0xb96cee63db927cb6!2sSomoco%20Ghana%20-%20North%20Industrial%20Area!5e0!3m2!1sen!2sgh!4v1761133389415!5m2!1sen!2sgh"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-50 rounded-3xl mt-5"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="flex-1 py-10 flex flex-col justify-center items-center sm:px-12">
        <ContactForm />
      </div>
    </div>
  );
};

export default Footer;
