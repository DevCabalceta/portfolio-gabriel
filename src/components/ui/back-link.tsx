"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { spaReturnKey } from "./spa-link";

export function BackLink({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  const router = useRouter();

  const goBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();

    try {
      const rememberedReturn = sessionStorage.getItem(spaReturnKey);
      if (rememberedReturn) {
        sessionStorage.removeItem(spaReturnKey);
        router.back();
        return;
      }
      if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {
      // Continue with the localized portfolio fallback.
    }
    router.push(href);
  };

  return (
    <a className={`back-link ${className}`.trim()} href={href} onClick={goBack}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10H4m0 0 5-5m-5 5 5 5" /></svg>
      <span>{label}</span>
    </a>
  );
}
