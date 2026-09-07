"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ChapterTransition({ id, previous, children }: { id: string; previous: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const outgoing = element.querySelector<HTMLElement>(".chapter-outgoing");
    const frame = element.querySelector<HTMLElement>(".chapter-frame");
    const incoming = element.querySelector<HTMLElement>("[data-chapter-incoming]");
    if (!outgoing || !frame || !incoming) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      element.dataset.motion = desktop ? "desktop" : "mobile";
      const updateFrame = (self: ScrollTrigger) => {
        outgoing.inert = self.progress >= 0.98;
        element.dataset.resting = String(self.scroll() <= Math.max(0, self.start));
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: incoming,
          // Mobile browser chrome can make 100svh shorter than the current
          // viewport. A negative start would blur the Hero before any scroll.
          start: () => Math.max(0, incoming.getBoundingClientRect().top + window.scrollY - window.innerHeight),
          end: "top top",
          scrub: desktop ? 0.5 : 0.25,
          invalidateOnRefresh: true,
          onUpdate: updateFrame,
          onRefresh: updateFrame,
        },
      });
      timeline.fromTo(frame,
        { scale: 1, opacity: 1, filter: "blur(0px)" },
        { scale: desktop ? 0.84 : 0.96, opacity: 0.08, filter: `blur(${desktop ? 9 : 5}px)`, force3D: false, ease: "none", duration: 1 }, 0);

      // Reveal at the title itself, so the letters animate while they are readable.
      gsap.from(incoming.querySelectorAll("[data-about-char]"), {
        yPercent: 110, rotate: 7, opacity: 0, duration: 0.85, stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: { trigger: incoming.querySelector(".about-title"), start: "top 82%", toggleActions: "play none none reverse" },
      });
      incoming.querySelectorAll("[data-about-reveal]").forEach((item) => {
        gsap.from(item, {
          y: desktop ? 32 : 20, opacity: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });

      return () => {
        delete element.dataset.motion;
        element.dataset.resting = "true";
        outgoing.inert = false;
      };
    }, element);

    return () => media.revert();
  }, []);

  return (
    <div ref={root} id={id} className="chapter-transition" data-resting="true" tabIndex={-1}>
      <div className="chapter-outgoing"><div className="chapter-frame">{previous}</div></div>
      {children}
    </div>
  );
}
