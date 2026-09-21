import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let configured = false;
let refreshFrame = 0;

export function setupGsap() {
  if (configured) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: "auto", nullTargetWarn: false });
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
  configured = true;
}

export function scheduleScrollRefresh() {
  setupGsap();
  if (refreshFrame) return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
  });
}

export { gsap, ScrollTrigger };
