import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch();
const baseURL = process.env.PORTFOLIO_PREVIEW_URL ?? "http://localhost:3000";
await mkdir("artifacts", { recursive: true });

for (const [name, viewport] of [
  ["desktop", { width: 1366, height: 768 }],
  ["mobile", { width: 390, height: 844 }],
  ["narrow", { width: 320, height: 568 }],
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
  await page.goto(`${baseURL}/es#site-footer`, { waitUntil: "domcontentloaded" });
  await page.locator("#site-footer").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, document.documentElement.scrollHeight); });
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `artifacts/footer-${name}.png` });
  console.log(name, await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    width: innerWidth,
    height: document.querySelector("#site-footer")?.getBoundingClientRect().height,
    top: document.querySelector("#site-footer")?.getBoundingClientRect().top,
    scrollY,
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight,
  })));
  await page.close();
}

await browser.close();
