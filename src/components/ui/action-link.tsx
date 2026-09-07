"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowIcon } from "./arrow-icon";

export function ActionLink({ href, children, download = false, primary = false }: {
  href: string; children: React.ReactNode; download?: boolean; primary?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.a href={href} download={download || undefined} tabIndex={0}
      className={`action-link ${primary ? "action-primary" : "action-secondary"}`}
      whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
      <span>{children}</span><ArrowIcon direction={download ? "down" : "diagonal"} />
    </motion.a>
  );
}
