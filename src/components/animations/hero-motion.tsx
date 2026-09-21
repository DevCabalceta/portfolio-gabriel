"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, setupGsap } from "./gsap-runtime";

export function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupGsap();
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero-line]", { yPercent: 110, duration: 1.05, stagger: 0.12, ease: "power4.out" });
      gsap.from("[data-hero-reveal]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.09, delay: 0.35, ease: "power3.out" });
    }, root);
    return () => media.revert();
  }, []);

  return <div ref={root} className="hero-motion">{children}</div>;
}
