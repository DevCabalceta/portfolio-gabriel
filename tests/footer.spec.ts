import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("Footer closes Contact in both languages with confirmed destinations", async ({ page }) => {
  for (const locale of ["es", "en"] as const) {
    await page.goto(`/${locale}#site-footer`);
    const footer = page.locator("#site-footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator("h2")).toHaveAccessibleName("Gabriel Cabalceta.");
    await expect(footer.locator(".site-footer-email")).toHaveAttribute("href", "mailto:cabalceta.gabriel.2001@gmail.com");
    await expect(footer.locator(".site-footer-column")).toHaveCount(4);
    await expect(footer.locator("#footer-services-title + a")).toHaveCount(1);
    await expect(footer.locator("[aria-labelledby='footer-services-title'] a")).toHaveCount(3);
    await expect(footer.locator("[aria-labelledby='footer-social-title'] a").nth(0)).toHaveAttribute("href", "https://www.linkedin.com/in/devcabalceta/");
    await expect(footer.locator("[aria-labelledby='footer-social-title'] a").nth(1)).toHaveAttribute("href", "https://github.com/DevCabalceta");
    await expect(footer.locator("[aria-labelledby='footer-social-title'] a").nth(2)).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
    await expect(footer.locator("[aria-labelledby='footer-social-title'] a").nth(3)).toHaveAttribute("href", "/documents/CV-GabrielCabalceta.pdf");
    await expect(footer.locator(".site-footer-back")).toHaveCount(0);
    await expect(footer.locator(".site-footer-legal p")).toContainText(locale === "es" ? "Todos los derechos reservados." : "All rights reserved.");
    await expect(footer.locator(".site-footer-legal nav a").nth(0)).toHaveAttribute("href", `/${locale}/privacy`);
    await expect(footer.locator(".site-footer-legal nav a").nth(1)).toHaveAttribute("href", `/${locale}/terms`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("Footer uses the shared transition and remains legible with reduced motion", async ({ page }) => {
  await page.goto("/es#site-footer");
  await expect(page.locator(".site-footer-motion")).toHaveAttribute("data-section-transition", "cinematic");
  await expect(page.locator(".site-footer-motion")).toHaveAttribute("data-motion", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".site-footer-motion")).not.toHaveAttribute("data-motion", "true");
  await expect(page.locator("#site-footer h2")).toBeVisible();
  await expect(page.locator(".site-footer-column a").last()).toBeVisible();
});

test("Footer fits compact desktop and narrow phones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Viewport sweep runs once in desktop Chromium");
  for (const size of [{ width: 1366, height: 768 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(size);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es#site-footer");
    const footer = page.locator("#site-footer");
    const heading = (await footer.locator("h2").boundingBox())!;
    expect(heading.x).toBeGreaterThanOrEqual(0);
    expect(heading.x + heading.width).toBeLessThanOrEqual(size.width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (size.width === 1366) {
      expect(await footer.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThanOrEqual(size.height + 2);
    }
  }
});
