"use client";
import ReactLenis from "lenis/react";
import { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";

const LenisScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  // Do not initialize Lenis on the Sanity Studio routes — it interferes with Studio's own scrolling.
  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

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
