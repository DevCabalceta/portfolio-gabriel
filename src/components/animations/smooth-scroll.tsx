"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setupGsap } from "./gsap-runtime";

let activeLenis: Lenis | null = null;

export function SmoothScroll() {
  useEffect(() => {
    // Pin spacers are measured after hydration. Re-align a direct section URL
    // once those measurements settle so the browser does not stop chapters early.
    if (!window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target) return;
    let interacted = false;
    let timer: ReturnType<typeof setTimeout>;
    const stop = () => { interacted = true; };
    const align = () => {
      if (interacted) return;
      const header = document.querySelector<HTMLElement>(".site-header");
      const offset = (header?.getBoundingClientRect().height ?? 72) + 12;
      const distance = target.getBoundingClientRect().top - offset;
      if (Math.abs(distance) > 2) window.scrollTo({ top: window.scrollY + distance, behavior: "instant" });
    };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(align, 80); };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("keydown", stop);
    ScrollTrigger.addEventListener("refresh", schedule);
    const initial = setTimeout(align, 250);
    const final = setTimeout(() => {
      align();
      ScrollTrigger.removeEventListener("refresh", schedule);
    }, 1100);
    return () => {
      clearTimeout(initial);
      clearTimeout(final);
      clearTimeout(timer);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
      ScrollTrigger.removeEventListener("refresh", schedule);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let cleanup: (() => void) | undefined;
    const sync = () => {
      cleanup?.();
      cleanup = undefined;
      if (!media.matches) return;
      setupGsap();
      activeLenis?.destroy();
      const lenis = new Lenis({ smoothWheel: true, wheelMultiplier: 1.18, lerp: 0.17, anchors: true, autoRaf: false });
      activeLenis = lenis;
      const onScroll = () => ScrollTrigger.update();
      const tick = (time: number) => lenis.raf(time * 1000);
      const onVisibility = () => {
        if (document.hidden) lenis.stop();
        else {
          lenis.start();
          ScrollTrigger.update();
        }
      };
      lenis.on("scroll", onScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.dataset.lenisActive = "true";
      document.addEventListener("visibilitychange", onVisibility);
      cleanup = () => {
        document.removeEventListener("visibilitychange", onVisibility);
        gsap.ticker.remove(tick);
        lenis.off("scroll", onScroll);
        lenis.destroy();
        if (activeLenis === lenis) activeLenis = null;
        delete document.documentElement.dataset.lenisActive;
      };
    };
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      cleanup?.();
    };
  }, []);
  return null;
}
