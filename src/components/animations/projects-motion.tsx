"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinematicSectionTransition } from "./cinematic-section-transition";

export function ProjectsMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const about = document.querySelector<HTMLElement>(".about-frame");
      const aboutSection = document.querySelector<HTMLElement>("#about");
      const aboutPin = document.querySelector<HTMLElement>(".about-pin");
      const cleanupTransition = about && aboutSection && aboutPin
        ? createCinematicSectionTransition({ incoming: element, outgoing: about, desktop, pin: { trigger: aboutSection, target: aboutPin }, restingTarget: about })
        : undefined;
      gsap.from(element.querySelectorAll("[data-work-char]"), {
        yPercent: 110, opacity: 0, rotate: 5, stagger: 0.045, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: element.querySelector(".work-title"), start: "top 85%", toggleActions: "play none none reverse" },
      });
      element.querySelectorAll("[data-work-reveal]").forEach((item) => {
        gsap.from(item, { y: desktop ? 32 : 18, opacity: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 94%", toggleActions: "play none none reverse" },
        });
      });
      gsap.from(element.querySelector(".project-carousel"), { y: 48, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: element.querySelector(".project-carousel"), start: "top 92%", once: true },
      });
      ScrollTrigger.refresh();
      // Embla owns the track/slide transforms; animate their inner content only.
      gsap.from(element.querySelectorAll(".project-composition"), { y: 32, opacity: 0, filter: "blur(5px)", duration: 0.9, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity,filter",
        scrollTrigger: { trigger: element.querySelector(".carousel-viewport"), start: "top 88%", once: true },
      });
      return () => { cleanupTransition?.(); };
    }, element);
    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    element.addEventListener("toggle", refresh, true);
    return () => {
      element.removeEventListener("toggle", refresh, true);
      cancelAnimationFrame(refreshFrame);
      media.revert();
    };
  }, []);
  return <div ref={root} className="projects-motion">{children}</div>;
}
