"use client";
import ReactLenis from "lenis/react";
import { ReactNode, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const LenisScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  // When users hold Shift and use the mouse wheel they expect horizontal scrolling.
  // Lenis captures wheel events and prevents the native behavior, so we install
  // a capture-phase handler that, when Shift is pressed, finds the nearest
  // horizontally-scrollable ancestor and scrolls it manually. We then stop
  // propagation so Lenis doesn't intercept the same event.
  useEffect(() => {
    if (pathname?.startsWith("/studio")) return; // no-op on Studio routes

    const opts: AddEventListenerOptions = { passive: false, capture: true };

    const findHorizontalScrollable = (start: Element | null): HTMLElement | null => {
      let el = start as HTMLElement | null;
      while (el && el !== document.documentElement) {
        const style = getComputedStyle(el);
        const overflowX = style.overflowX;
        if ((overflowX === "auto" || overflowX === "scroll" || overflowX === "overlay") && el.scrollWidth > el.clientWidth) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const handler = (e: WheelEvent) => {
      try {
        if (!e.shiftKey) return; // only handle Shift+wheel here

        const target = e.target as Element | null;
        const scrollEl = findHorizontalScrollable(target) || (document.scrollingElement as HTMLElement | null);
        if (!scrollEl) return;

        // Perform horizontal scroll using the vertical wheel delta so behavior
        // matches native Shift+wheel semantics.
        scrollEl.scrollLeft += e.deltaY;

        // Prevent Lenis and other listeners from handling this event.
        e.preventDefault();
        e.stopImmediatePropagation();
      } catch (err) {
        // swallow errors — don't break page scroll
        console.error("Shift+wheel handler error", err);
      }
    };

    window.addEventListener("wheel", handler, opts);
    return () => window.removeEventListener("wheel", handler, opts as EventListenerOptions);
  }, [pathname]);

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
