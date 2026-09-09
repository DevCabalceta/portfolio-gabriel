import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
  await page.goto("http://localhost:3000/es#work");
  await page.evaluate(() => document.fonts.ready);
  for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 664 }]]) {
    await page.setViewportSize(viewport);
    await page.goto("http://localhost:3000/es#work");
    await page.evaluate(() => document.fonts.ready);
    await page.locator("#work").evaluate((element) => element.scrollIntoView());
    await page.locator('.floating-actions[data-visible="true"]').waitFor();
    await page.screenshot({ path: `artifacts/work-${name}.png` });
    const feature = page.locator('.featured-project[data-project="fan-de-maiz"]');
    await feature.scrollIntoViewIfNeeded();
    await feature.locator("img").evaluate((image) => image.decode());
    const cropStyle = ".site-header, .floating-actions { visibility: hidden !important; }";
    await feature.screenshot({ path: `artifacts/project-${name}.png`, style: cropStyle });
    await page.locator(".project-carousel").screenshot({ path: `artifacts/project-carousel-${name}.png`, style: cropStyle });
    await page.locator(".carousel-viewport").focus();
    await page.keyboard.press("End");
    await expect(page.locator(".project-carousel")).toHaveAttribute("data-selected", "10");
    await expect(page.locator(".carousel-position")).toContainText("11 / 11");
    // Capture the viewport without locator.screenshot's automatic scrolling:
    // scrolling the carousel wrapper into view can reset native scroll-snap.
    await page.screenshot({ path: `artifacts/project-carousel-end-${name}.png`, style: cropStyle });
    await page.locator(".carousel-dots button").first().click();
    await page.locator('[data-project="upgrade"] .project-gallery-trigger').click();
    await page.getByRole("dialog").locator(".gallery-stage img").evaluate((image) => image.decode());
    await page.screenshot({ path: `artifacts/project-gallery-${name}.png` });
    await page.getByRole("button", { name: "Cerrar galería" }).click();
  }
} finally { await browser.close(); }
