"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero-line]", { yPercent: 110, duration: 1.05, stagger: 0.12, ease: "power4.out" });
      gsap.from("[data-hero-reveal]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.09, delay: 0.35, ease: "power3.out" });
    }, root);
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to("[data-hero-portrait]", {
        yPercent: 7, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, root);
    return () => media.revert();
  }, []);

  return <div ref={root} className="hero-motion">{children}</div>;
}
