"use client";
import Footer from "@/components/General/Footer";
import Hero from "@/components/Home/Hero";
import Section2 from "@/components/Home/Section2";
import React, { RefObject, useEffect, useRef, useState } from "react";

const SCROLL_LOCK_MS = 1400; // time to lock additional scrolls while smooth scrolling

const Home = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const DEBOUNCE_MS = 100; // Minimum time between scroll attempts

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Prevent native wheel scrolling and use our own handler
    const onWheel = (e: WheelEvent) => {
      if (!container) return;
      // allow modifier keys to behave normally
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Debounce to prevent multiple rapid scrolls
      const now = Date.now();
      if (
        isAnimatingRef.current ||
        now - lastScrollTimeRef.current < DEBOUNCE_MS
      ) {
        e.preventDefault();
        return;
      }

      const sections = Array.from(container.children) as HTMLElement[];
      const currentSection = sections[activeIndex];

      // Check if current section is taller than viewport and needs internal scrolling
      if (currentSection && currentSection.scrollHeight > window.innerHeight) {
        const delta = e.deltaY;
        const scrollTop = container.scrollTop;
        const sectionTop = currentSection.offsetTop;
        const sectionBottom = sectionTop + currentSection.scrollHeight;
        const viewportBottom = scrollTop + window.innerHeight;

        const atTop = scrollTop <= sectionTop + 5; // 5px tolerance
        const atBottom = viewportBottom >= sectionBottom - 5; // 5px tolerance

        // Allow internal scrolling within the tall section
        if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
          // Let the browser handle internal scrolling
          return;
        }

        // At boundaries, prevent default and move to next/prev section
        e.preventDefault();
        lastScrollTimeRef.current = now;

        if (delta > 0 && atBottom) {
          const next = Math.min(sections.length - 1, activeIndex + 1);
          if (next !== activeIndex) {
            scrollToIndex(container, sections, next);
          }
        } else if (delta < 0 && atTop) {
          const prev = Math.max(0, activeIndex - 1);
          if (prev !== activeIndex) {
            scrollToIndex(container, sections, prev);
          }
        }
      } else {
        // Normal section-to-section scrolling
        e.preventDefault();
        lastScrollTimeRef.current = now;

        const delta = e.deltaY;
        if (delta > 0) {
          // scroll down
          const next = Math.min(sections.length - 1, activeIndex + 1);
          if (next !== activeIndex) {
            scrollToIndex(container, sections, next);
          }
        } else if (delta < 0) {
          const prev = Math.max(0, activeIndex - 1);
          if (prev !== activeIndex) {
            scrollToIndex(container, sections, prev);
          }
        }
      }
    };

    let touchMoved = false;
    const onTouchStart = (e: TouchEvent) => {
      touchMoved = false;
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchMoved = true;
      const sections = Array.from(container.children) as HTMLElement[];
      const currentSection = sections[activeIndex];

      // Check if current section is taller than viewport
      if (currentSection && currentSection.scrollHeight > window.innerHeight) {
        const atTop = container.scrollTop <= currentSection.offsetTop;
        const atBottom =
          container.scrollTop + window.innerHeight >=
          currentSection.offsetTop + currentSection.scrollHeight;

        // Allow internal scrolling within the tall section
        if (!atTop && !atBottom) {
          return; // Don't prevent default, allow native scroll
        }
      }

      // prevent native overscroll at boundaries or for short sections
      if (e.cancelable) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = e.changedTouches[0]?.clientY ?? null;
      if (startY == null || endY == null) return;
      const diff = startY - endY;
      const threshold = 50; // minimal swipe distance to trigger
      const sections = Array.from(container.children) as HTMLElement[];
      if (Math.abs(diff) < threshold) return;

      // Debounce touch events too
      const now = Date.now();
      if (
        isAnimatingRef.current ||
        now - lastScrollTimeRef.current < DEBOUNCE_MS
      ) {
        return;
      }

      lastScrollTimeRef.current = now;
      const currentSection = sections[activeIndex];

      // Check if we're at boundaries of a tall section
      if (currentSection && currentSection.scrollHeight > window.innerHeight) {
        const scrollTop = container.scrollTop;
        const sectionTop = currentSection.offsetTop;
        const sectionBottom = sectionTop + currentSection.scrollHeight;
        const viewportBottom = scrollTop + window.innerHeight;

        const atTop = scrollTop <= sectionTop + 5;
        const atBottom = viewportBottom >= sectionBottom - 5;

        if (diff > 0 && atBottom) {
          // swipe up at bottom -> next section
          const next = Math.min(sections.length - 1, activeIndex + 1);
          if (next !== activeIndex) {
            scrollToIndex(container, sections, next);
          }
        } else if (diff < 0 && atTop) {
          // swipe down at top -> prev section
          const prev = Math.max(0, activeIndex - 1);
          if (prev !== activeIndex) {
            scrollToIndex(container, sections, prev);
          }
        }
        // Otherwise ignore the swipe (was internal scroll)
      } else {
        // Normal section-to-section swiping
        if (diff > 0) {
          // swipe up -> next
          const next = Math.min(sections.length - 1, activeIndex + 1);
          if (next !== activeIndex) {
            scrollToIndex(container, sections, next);
          }
        } else {
          // swipe down -> prev
          const prev = Math.max(0, activeIndex - 1);
          if (prev !== activeIndex) {
            scrollToIndex(container, sections, prev);
          }
        }
      }
    };

    // Add listeners with passive: false so we can preventDefault
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: false });

    // Cleanup
    return () => {
      container.removeEventListener("wheel", onWheel as any);
      container.removeEventListener("touchstart", onTouchStart as any);
      container.removeEventListener("touchmove", onTouchMove as any);
      container.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [activeIndex]);

  // helper to perform the scroll
  const scrollToIndex = (
    container: HTMLDivElement,
    sections: HTMLElement[],
    index: number
  ) => {
    if (index === activeIndex) return;
    const target = sections[index];
    if (!target) return;

    isAnimatingRef.current = true;
    setActiveIndex(index);

    // Custom smooth scroll with longer duration
    const start = container.scrollTop;
    const end = target.offsetTop;
    const distance = end - start;
    const duration = 1200; // milliseconds for the scroll animation
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      container.scrollTop = start + distance * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);

    // unlock after a short delay (matches smooth scroll duration)
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, SCROLL_LOCK_MS);
  };

  return (
    <div
      ref={ref}
      className="h-screen overflow-y-auto relative"
      style={{ scrollBehavior: "auto" }}
      // prevent keyboard scroll on the container
      onKeyDown={(e) => e.preventDefault()}
      tabIndex={-1}
    >
      <Hero containerRef={ref as RefObject<HTMLDivElement>} />
      <Section2 containerRef={ref as RefObject<HTMLDivElement>} />
      <Footer />
    </div>
  );
};

export default Home;
