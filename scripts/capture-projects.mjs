// Public entry pages only. Never sign in or submit forms when generating previews.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const sources = [
  ["enrollment", "matricula-en-linea", "https://cedesdonbosco.ed.cr/matricula/"],
  ["expotec", "expotec", "https://cedesdonbosco.ed.cr/expotec/"],
  ["fan-de-maiz", "fan-de-maiz", "https://fandemaiz.com/"],
  ["gif-search", "gif-search-app", "https://gabriel-gifs-app.netlify.app/"],
  ["spotify", "spotify-clone", "https://spotify-clone-silk-chi.vercel.app/"],
  ["intranet", "intranet-institucional", "https://intranet.cedesdonbosco.ed.cr/"],
  ["cdc", "cdc", "https://cedesdonbosco.ed.cr/cdc/"],
  ["bosconet", "bosconet", "https://bosconet.cedesdonbosco.ed.cr/v1/"],
  ["alianza-360", "alianza-360", "https://cedesdonbosco.ed.cr/infoagendas/alianza360/"],
  ["tesla", "tesla-clone", "https://gabriel-tesla-landing.netlify.app/"],
];

const requestedIds = new Set(process.argv.slice(2));
const selectedSources = requestedIds.size
  ? sources.filter(([id]) => requestedIds.has(id))
  : sources;

const missingIds = [...requestedIds].filter((id) => !sources.some(([sourceId]) => sourceId === id));
if (missingIds.length) throw new Error(`Unknown project id(s): ${missingIds.join(", ")}`);

await mkdir("public/images/projects", { recursive: true });
const browser = await chromium.launch();
try {
  const results = await Promise.allSettled(selectedSources.map(async ([id, folder, url]) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    try {
      const response = await page.goto(url, { waitUntil: "load", timeout: 45000 });
      if (!response?.ok()) throw new Error(`${id}: HTTP ${response?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3500);
      await mkdir(`public/images/projects/${folder}`, { recursive: true });
      await page.screenshot({ path: `public/images/projects/${folder}/01.jpg`, type: "jpeg", quality: 85 });
      console.log(`${id}: ${await page.title()} — ${page.url()}`);
    } finally { await page.close(); }
  }));
  for (const result of results) {
    if (result.status === "rejected") { console.error(result.reason); process.exitCode = 1; }
  }
} finally { await browser.close(); }
