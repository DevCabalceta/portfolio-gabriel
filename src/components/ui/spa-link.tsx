"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type SpaLinkProps = ComponentProps<typeof Link> & { rememberReturn?: boolean };

const returnKey = "portfolio:return";

export function SpaLink({ rememberReturn = false, onClick, ...props }: SpaLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        if (rememberReturn && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          sessionStorage.setItem(returnKey, `${window.location.pathname}${window.location.search}${window.location.hash}`);
        }
        onClick?.(event);
      }}
    />
  );
}

export const spaReturnKey = returnKey;
