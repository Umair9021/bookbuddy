"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function LenisScroller() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Add these options for better fixed element support
      wrapper: window,
      content: document.documentElement,
      // Prevent conflicts with fixed elements
      autoResize: true,
      // Add touch inertia for mobile
      touchInertiaMultiplier: 2,
    });

    // Add this to handle fixed elements better
    lenis.on('scroll', (e) => {
      // This helps with fixed positioning
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}