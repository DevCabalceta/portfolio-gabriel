// Temporary public-site screenshots. Replace these with Gabriel's project media.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const sources = [
  ["astro", "https://astro.build/"],
  ["nextjs", "https://nextjs.org/"],
  ["tailwind", "https://tailwindcss.com/"],
  ["motion", "https://motion.dev/"],
  ["gsap", "https://gsap.com/"],
  ["threejs", "https://threejs.org/"],
];
await mkdir("public/images/gallery", { recursive: true });
const browser = await chromium.launch();
for (let offset = 0; offset < sources.length; offset += 3) {
  const results = await Promise.allSettled(sources.slice(offset, offset + 3).map(async ([name, url]) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2500);
      const screenshot = await page.screenshot({ type: "jpeg", quality: 85 });
      await sharp(screenshot)
        .webp({ quality: 82, effort: 5, smartSubsample: true })
        .toFile(`public/images/gallery/${name}.webp`);
      console.log(`${name}: ${await page.title()} (${url})`);
    } finally {
      await page.close();
    }
  }));
  for (const result of results) if (result.status === "rejected") console.error(result.reason);
}
await browser.close();
