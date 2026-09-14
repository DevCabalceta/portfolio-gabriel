"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinematicSectionTransition } from "./cinematic-section-transition";
import { createCinematicReveal, killCinematicReveal } from "./cinematic-reveal";

export function ServicesMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const processFooter = document.querySelector<HTMLElement>(".process-footer");
      const plans = gsap.utils.toArray<HTMLElement>(".service-plan", element);
      const currencyControl = element.querySelector<HTMLElement>("[data-services-control]");
      const revealTimelines: gsap.core.Timeline[] = [];

      element.dataset.motion = "true";
      const cleanupTransition = processFooter
        ? createCinematicSectionTransition({
          incoming: element,
          outgoing: processFooter,
          desktop,
          pin: { trigger: processFooter, target: processFooter },
          restingTarget: processFooter,
        })
        : undefined;

      const intro = element.querySelector<HTMLElement>(".services-intro");
      if (intro) revealTimelines.push(createCinematicReveal({
        trigger: intro,
        start: "top 82%",
        steps: [
          { targets: intro.querySelector("[data-services-intro='label']")!, from: { opacity: 0, y: 16, filter: "blur(3px)" }, to: { duration: 0.5 } },
          { targets: intro.querySelectorAll("[data-services-intro='title']"), from: { yPercent: 116, rotate: 2.5, opacity: 0 }, to: { duration: 0.86, stagger: 0.1 }, at: 0.1 },
          { targets: intro.querySelector("[data-services-intro='copy']")!, from: { opacity: 0, y: 30, filter: "blur(7px)", clipPath: "inset(0% 0% 100% 0%)" }, to: { duration: 0.72 }, at: 0.42 },
        ],
      }));

      const planSteps = (plan: HTMLElement, delay = 0) => [
        { targets: plan.querySelector("[data-service-line]")!, from: { scaleY: 0 }, to: { duration: 0.72, transformOrigin: "top" }, at: delay },
        { targets: plan.querySelector("[data-service-part='number']")!, from: { opacity: 0, x: -30, filter: "blur(4px)" }, to: { duration: 0.48 }, at: delay + 0.08 },
        { targets: plan.querySelector("[data-service-part='kind']")!, from: { opacity: 0, x: 18 }, to: { duration: 0.42 }, at: delay + 0.15 },
        { targets: plan.querySelector("[data-service-part='title']")!, from: { yPercent: 115, rotate: 2 }, to: { duration: 0.7 }, at: delay + 0.2 },
        { targets: plan.querySelector("[data-service-part='price']")!, from: { opacity: 0, y: 24, filter: "blur(5px)" }, to: { duration: 0.6 }, at: delay + 0.31 },
        { targets: plan.querySelectorAll("[data-service-part='recommended'], [data-service-part='summary'], [data-service-part='benefits-label']"), from: { opacity: 0, y: 18, filter: "blur(3px)" }, to: { duration: 0.5, stagger: 0.07 }, at: delay + 0.42 },
        { targets: plan.querySelectorAll("[data-service-benefit]"), from: { opacity: 0, x: 14, clipPath: "inset(0% 0% 0% 100%)" }, to: { duration: 0.42, stagger: 0.035 }, at: delay + 0.56 },
        { targets: plan.querySelector("[data-service-part='cta']")!, from: { opacity: 0, y: 18, filter: "blur(3px)" }, to: { duration: 0.52 }, at: delay + 0.78 },
      ];

      if (desktop) {
        const container = element.querySelector<HTMLElement>(".services-plans");
        if (container) revealTimelines.push(createCinematicReveal({
          trigger: element.querySelector(".services-pricing") ?? container,
          start: "top 82%",
          steps: [
            ...(currencyControl ? [{ targets: currencyControl, from: { opacity: 0, y: 18, filter: "blur(4px)" }, to: { duration: 0.54 }, at: 0 }] : []),
            ...plans.flatMap((plan, index) => planSteps(plan, 0.12 + index * 0.24)),
          ],
        }));
      } else {
        if (currencyControl) revealTimelines.push(createCinematicReveal({
          trigger: currencyControl,
          start: "top 90%",
          steps: [{ targets: currencyControl, from: { opacity: 0, y: 18, filter: "blur(4px)" }, to: { duration: 0.54 } }],
        }));
        plans.forEach((plan) => revealTimelines.push(createCinematicReveal({
          trigger: plan,
          start: "top 84%",
          steps: planSteps(plan),
        })));
      }

      const outro = element.querySelector<HTMLElement>("[data-services-outro]");
      if (outro) revealTimelines.push(createCinematicReveal({
        trigger: outro,
        start: "top 94%",
        steps: [{ targets: outro.children, from: { opacity: 0, y: 14 }, to: { duration: 0.48, stagger: 0.1 } }],
      }));

      const drift = gsap.timeline({
        scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      drift.to(element.querySelector(".services-coordinate"), { yPercent: -22, ease: "none" }, 0)
        .to(element.querySelector(".services-arc"), { rotate: 24, yPercent: 8, ease: "none" }, 0)
        .to(plans.map((plan) => plan.querySelector(".service-plan-index")), { y: desktop ? -42 : -18, stagger: 0.08, ease: "none" }, 0);

      ScrollTrigger.refresh();
      return () => {
        cleanupTransition?.();
        revealTimelines.forEach(killCinematicReveal);
        drift.scrollTrigger?.kill();
        drift.kill();
        delete element.dataset.motion;
      };
    }, element);

    return () => media.revert();
  }, []);

  return <div ref={root} className="services-motion">{children}</div>;
}
