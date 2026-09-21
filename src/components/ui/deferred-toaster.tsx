"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Toaster = dynamic(() => import("./sileo-toaster").then((module) => module.SileoToaster), { ssr: false });

export function DeferredToaster() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setEnabled(true);
      observer.disconnect();
    }, { rootMargin: "1200px 0px", threshold: 0 });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return enabled ? <Toaster /> : null;
}
