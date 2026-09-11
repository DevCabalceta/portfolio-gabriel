import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 744 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.route("https://prod.spline.design/**/scene.splinecode", (route) => route.abort());
  await page.goto("http://localhost:3000/es", { waitUntil: "networkidle" });
  await page.locator("#services").evaluate((node) => scrollTo({ top: node.getBoundingClientRect().top + scrollY, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `artifacts/services-${viewport.name}.png`, fullPage: false });
  await page.locator(".services-plans").evaluate((node) => scrollTo({ top: node.getBoundingClientRect().top + scrollY - 92, behavior: "instant" }));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `artifacts/services-plans-${viewport.name}.png`, fullPage: false });
  await page.evaluate(() => {
    const incoming = document.querySelector(".services-motion");
    if (incoming) scrollTo({ top: incoming.getBoundingClientRect().top + scrollY - innerHeight * .48, behavior: "instant" });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `artifacts/services-transition-${viewport.name}.png`, fullPage: false });
  await context.close();
}
await browser.close();
