import ContactForm from "@/components/General/ContactForm";
import Locations from "@/components/Contact/Locations";
import { Calendar, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import React from "react";

const ContactUs = () => {
  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative w-full h-64 sm:h-96">
        <Image
          src="/contact-banner.png"
          alt="Contact banner"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute left-6 bottom-6">
          <h1 className="text-3xl sm:text-5xl font-family-cera-stencil font-bold text-secondary">
            Contact Us
          </h1>
          <p className="mt-2 text-base sm:text-xl">
            We’re here to help — get in touch
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-12">
        <aside className="order-2 md:order-1">
          <div className=" backdrop-blur-md p-6 rounded-xl border-2 bg-[#262626] border-secondary">
            <h2 className="font-family-cera-stencil text-2xl mb-3">
              Have Questions?
            </h2>
            <p className="mb-4">
              Our team is available to assist with sales, service and support.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">0501578360 / 0247970012</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    North Industrial Area, Dadeban Road, Opposite Duraplast
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hours</p>
                  <p className="font-medium">
                    Mon–Sat · 8:00am–5:00pm (Sat 9:00am–2:00pm )
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-muted-foreground mb-2">Find us</h3>
              <div className="w-full rounded-md overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9076974613263!2d-0.22600122501467668!3d5.5806613944000025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a1e370781dd%3A0xb96cee63db927cb6!2sSomoco%20Ghana%20-%20North%20Industrial%20Area!5e0!3m2!1sen!2sgh!4v1760969046732!5m2!1sen!2sgh"
                  className="h-45 sm:h-90 w-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Form */}
        <main className="order-1 md:order-2">
          <div className="sticky top-30 p-6 rounded-xl border-2 bg-[#262626] border-secondary">
            <ContactForm />
          </div>
        </main>
      </div>
      <div>
        <Locations />
      </div>
    </div>
  );
};

export default ContactUs;
