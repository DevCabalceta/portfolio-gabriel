// Public entry pages only. Never sign in or submit forms when generating previews.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const sources = [
  ["enrollment", "https://cedesdonbosco.ed.cr/matricula/"],
  ["expotec", "https://cedesdonbosco.ed.cr/expotec/"],
  ["fan-de-maiz", "https://fandemaiz.com/"],
  ["gif-search", "https://gabriel-gifs-app.netlify.app/"],
  ["spotify", "https://spotify-clone-silk-chi.vercel.app/"],
  ["intranet", "https://intranet.cedesdonbosco.ed.cr/"],
  ["cdc", "https://cedesdonbosco.ed.cr/cdc/"],
  ["bosnet", "https://bosconet.cedesdonbosco.ed.cr/v1/"],
  ["tesla", "https://gabriel-tesla-landing.netlify.app/"],
];
await mkdir("public/images/projects", { recursive: true });
const browser = await chromium.launch();
try {
  const results = await Promise.allSettled(sources.map(async ([id, url]) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    try {
      const response = await page.goto(url, { waitUntil: "load", timeout: 45000 });
      if (!response?.ok()) throw new Error(`${id}: HTTP ${response?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3500);
      await page.screenshot({ path: `public/images/projects/${id}.jpg`, type: "jpeg", quality: 85 });
      console.log(`${id}: ${await page.title()} — ${page.url()}`);
    } finally { await page.close(); }
  }));
  for (const result of results) {
    if (result.status === "rejected") { console.error(result.reason); process.exitCode = 1; }
  }
} finally { await browser.close(); }
