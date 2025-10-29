import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/General/Header";
import Footer from "@/components/General/Footer";
import ContactModalProvider from "@/components/General/ContactModalProvider";
import LenisScrollProvider from "@/components/General/LenisProvider";

const ceraPro = localFont({
  src: [
    {
      path: "../public/cera-pro/Cera-Pro-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/cera-pro/Cera-Pro-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-cera-pro",
});

const ceraStencil = localFont({
  src: [
    {
      path: "../public/cera-stencil/Cera-Stencil-Regular-Demo.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/cera-stencil/Cera-Stencil-Bold-Demo.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cera-stencil",
});

export const metadataBase = new URL("https://somoco-ev.vercel.app");

export const metadata: Metadata = {
  title: "Somoco EV",
  description:
    "Somoco EV Ghana, your trusted source for electric vehicles, genuine parts, and expert aftersales service across Ghana. Discover our models, compare specifications, and get personalised support for pricing, delivery, and more.",
  manifest: "/favicon_io/site.webmanifest",
  icons: {
    icon: "/favicon_io/favicon.ico",
    shortcut: "/favicon_io/favicon-16x16.png",
    apple: "/favicon_io/apple-touch-icon.png",
  },
  openGraph: {
    title: "Somoco EV",
    description:
      "Somoco EV Ghana — electric vehicles, genuine parts, and expert aftersales across Ghana.",
    url: "/",
    siteName: "Somoco EV",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Somoco EV logo",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Somoco EV",
    description:
      "Electric vehicles, parts and aftersales support across Ghana.",
    images: ["/favicon_io/android-chrome-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ceraPro.variable} ${ceraStencil.variable}`}>
      <body className={`${ceraPro.className} antialiased`}>
        <LenisScrollProvider>
          <ContactModalProvider>
            <Header />
            {children}
            <Footer />
          </ContactModalProvider>
        </LenisScrollProvider>
      </body>
    </html>
  );
}
