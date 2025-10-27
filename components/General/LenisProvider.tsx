"use client";
import ReactLenis from "lenis/react";
import { ReactNode } from "react";
import { useRef } from "react";

const LenisScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef(null);
  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisScrollProvider;
