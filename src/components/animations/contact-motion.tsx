"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinematicSectionTransition } from "./cinematic-section-transition";
import { createCinematicReveal, killCinematicReveal } from "./cinematic-reveal";

export function ContactMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const faqMotion = document.querySelector<HTMLElement>(".faq-motion");
      const faq = document.querySelector<HTMLElement>(".faq");
      const cleanupTransition = faqMotion && faq ? createCinematicSectionTransition({
        incoming: element,
        outgoing: faq,
        desktop,
        pin: { trigger: faqMotion, target: faqMotion },
        restingTarget: faq,
      }) : undefined;
      const timelines: gsap.core.Timeline[] = [];
      const intro = element.querySelector<HTMLElement>(".contact-intro");
      const panel = element.querySelector<HTMLElement>(".contact-form-panel");
      if (intro) timelines.push(createCinematicReveal({
        trigger: intro,
        start: "top 86%",
        steps: [
          { targets: intro.querySelector("[data-contact-intro='eyebrow']")!, from: { opacity: 0, x: -22, filter: "blur(3px)" }, to: { duration: 0.5 } },
          { targets: intro.querySelectorAll("[data-contact-intro='title']"), from: { yPercent: 112, rotate: 2, opacity: 0 }, to: { duration: 0.82, stagger: 0.11 }, at: 0.1 },
          { targets: intro.querySelector("[data-contact-intro='description']")!, from: { opacity: 0, y: 25, filter: "blur(5px)" }, to: { duration: 0.65 }, at: 0.47 },
          { targets: intro.querySelector("[data-contact-intro='direct']")!, from: { opacity: 0, y: 20, scaleX: 0.9, transformOrigin: "left" }, to: { duration: 0.65 }, at: 0.6 },
          { targets: intro.querySelector("[data-contact-intro='footer']")!, from: { opacity: 0, y: 15 }, to: { duration: 0.52 }, at: 0.82 },
        ],
      }));
      if (panel) timelines.push(createCinematicReveal({
        trigger: panel,
        start: "top 86%",
        steps: [
          { targets: panel.querySelector("[data-contact-form='eyebrow']")!, from: { opacity: 0, x: 24 }, to: { duration: 0.48 }, at: 0.18 },
          { targets: panel.querySelector("[data-contact-form='title']")!, from: { opacity: 0, y: 32, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)" }, to: { duration: 0.8 }, at: 0.3 },
          { targets: panel.querySelector("[data-contact-form='description']")!, from: { opacity: 0, y: 20 }, to: { duration: 0.58 }, at: 0.48 },
          { targets: panel.querySelectorAll("[data-contact-field]"), from: { opacity: 0, y: 24, filter: "blur(4px)" }, to: { duration: 0.56, stagger: 0.1 }, at: 0.56 },
          { targets: panel.querySelector("[data-contact-form='submit']")!, from: { opacity: 0, y: 18, clipPath: "inset(0% 0% 100% 0%)" }, to: { duration: 0.58 }, at: 0.92 },
          { targets: panel.querySelector("[data-contact-form='note']")!, from: { opacity: 0, y: 12 }, to: { duration: 0.46 }, at: 1.08 },
        ],
      }));
      element.dataset.motion = "true";
      ScrollTrigger.refresh();
      return () => {
        cleanupTransition?.();
        timelines.forEach(killCinematicReveal);
        delete element.dataset.motion;
      };
    }, element);
    return () => media.revert();
  }, []);

  return <div ref={root} className="contact-motion">{children}</div>;
}
