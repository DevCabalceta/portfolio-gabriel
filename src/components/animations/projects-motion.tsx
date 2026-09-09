"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      if (aboutSection && aboutPin) {
        ScrollTrigger.create({
          trigger: aboutSection, pin: aboutPin, pinSpacing: false,
          start: "bottom bottom", endTrigger: element, end: "top top",
          invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 1,
        });
      }
      if (about) {
        gsap.fromTo(about, { scale: 1, opacity: 1, filter: "blur(0px)" }, {
          scale: desktop ? 0.9 : 0.97, opacity: 0.12, filter: `blur(${desktop ? 7 : 4}px)`,
          ease: "none", force3D: false,
          scrollTrigger: {
            trigger: element, start: "top bottom", end: "top top", scrub: 0.35,
            onUpdate: (self) => { about.inert = self.progress >= 0.98; about.dataset.resting = String(self.progress === 0); },
            onRefresh: (self) => { about.inert = self.progress >= 0.98; about.dataset.resting = String(self.progress === 0); },
          },
        });
      }
      gsap.from(element.querySelectorAll("[data-work-char]"), {
        yPercent: 110, opacity: 0, rotate: 5, stagger: 0.045, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: element.querySelector(".work-title"), start: "top 85%", toggleActions: "play none none reverse" },
      });
      element.querySelectorAll("[data-work-reveal]").forEach((item) => {
        gsap.from(item, { y: desktop ? 32 : 18, opacity: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 94%", toggleActions: "play none none reverse" },
        });
      });
      gsap.from(element.querySelector(".project-carousel"), { y: 24, opacity: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: element.querySelector(".project-carousel"), start: "top 92%", once: true },
      });
      ScrollTrigger.refresh();
      return () => { if (about) { about.inert = false; delete about.dataset.resting; } };
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
