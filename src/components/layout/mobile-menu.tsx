"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitch } from "./language-switch";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export function MobileMenu({ locale, copy, links, onClose, trigger }: {
  locale: Locale;
  copy: Dictionary["nav"];
  links: { href: string; label: string; target?: "_blank" }[];
  onClose: () => void;
  trigger: RefObject<HTMLButtonElement | null>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pendingAnchor = useRef<string | null>(null);
  const reducedMotion = useReducedMotion();

  // Mount the native modal before animating its contents. Its lifecycle must
  // follow this component, including AnimatePresence's exit, not the parent.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const triggerElement = trigger.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = element.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    element.addEventListener("keydown", trapFocus);

    return () => {
      element.close();
      element.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus({ preventScroll: true });
      const anchor = pendingAnchor.current;
      if (anchor) {
        // Navigate after the modal has released focus and the scroll lock.
        requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(anchor);
          if (!target) return;
          window.history.pushState(null, "", anchor);
          target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        });
      }
    };
  }, [trigger]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [onClose]);

  return (
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label={copy.label}
      onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <motion.div className="mobile-menu-panel"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mobile-menu-top">
          <span className="wordmark" aria-hidden="true">gc<span>✳</span></span>
          <button type="button" className="menu-close" onClick={onClose} aria-label={copy.close}><span /><span /></button>
        </div>
        <nav aria-label={copy.label}>
          <p className="micro-label mobile-menu-label">{copy.menu}</p>
          {links.map((link, index) => (
            <motion.a key={link.href} href={link.href} target={link.target} rel={link.target ? "noopener noreferrer" : undefined} onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
              if (link.href.startsWith("#")) {
                event.preventDefault();
                pendingAnchor.current = link.href;
              }
              onClose();
            }}
              initial={reducedMotion ? false : { y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.08 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}>
              <span className="micro-label">0{index + 1}</span>{link.label}<ArrowIcon />
            </motion.a>
          ))}
        </nav>
        <div className="mobile-menu-bottom">
          <LanguageSwitch locale={locale} label={copy.language} />
          <span className="micro-label">Gabriel Cabalceta © 2026</span>
        </div>
      </motion.div>
    </dialog>
  );
}
