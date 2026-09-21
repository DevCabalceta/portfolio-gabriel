"use client";

import { Toaster } from "sileo";
import "sileo/styles.css";

export function SileoToaster() {
  return <>
    <span data-sileo-ready hidden />
    <Toaster position="top-center" offset={{ top: 84 }} options={{ fill: "#211e1b", roundness: 12 }} />
  </>;
}
