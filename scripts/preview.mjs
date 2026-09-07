import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
page.on("pageerror", (error) => console.error(error.message));
await page.goto("http://localhost:3000/es");
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.querySelectorAll("[data-hero-reveal]")].every((element) => element.getAttribute("style")?.includes("opacity: 1;")));
await page.screenshot({ path: "artifacts/hero-desktop.png", fullPage: true });
console.log(await page.title());
await page.setViewportSize({ width: 390, height: 600 });
await page.screenshot({ path: "artifacts/hero-mobile.png", fullPage: true });
await page.getByRole("button", { name: "Abrir menú" }).click();
await page.waitForFunction(() => getComputedStyle(document.querySelector(".mobile-menu-panel")).opacity === "1");
await page.screenshot({ path: "artifacts/menu-mobile.png" });
await browser.close();
