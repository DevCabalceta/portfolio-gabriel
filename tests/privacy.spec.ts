import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("privacy notice is localized, complete and connected to official sources", async ({ page }) => {
  for (const locale of ["es", "en"] as const) {
    await page.goto(`/${locale}/privacy`);
    const main = page.locator("#privacy-content");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toHaveAccessibleName(locale === "es" ? "Tus datos. Con claridad." : "Your data. Clearly explained.");
    await expect(main.locator(".legal-section")).toHaveCount(8);
    await expect(page).toHaveTitle(locale === "es" ? "Aviso de privacidad — Gabriel Cabalceta" : "Privacy notice — Gabriel Cabalceta");
    await expect(page.locator("a[href*='pgrweb.go.cr']")).toHaveAttribute("target", "_blank");
    await expect(page.locator("a[href='https://www.prodhab.go.cr/']")).toHaveAttribute("target", "_blank");
    await expect(page.locator(".legal-header .language-switch a").nth(locale === "es" ? 1 : 0)).toHaveAttribute("href", locale === "es" ? "/en/privacy" : "/es/privacy");
    await expect(page.locator(".legal-primary-action")).toHaveAttribute("href", "mailto:cabalceta.gabriel.2001@gmail.com");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("privacy link opens from the footer and Go back restores the portfolio", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#site-footer");
  await page.evaluate(() => ((window as Window & { __spaDocument?: string }).__spaDocument = "preserved"));
  await page.locator("#site-footer").getByRole("link", { name: "Aviso de privacidad" }).click();
  await expect(page).toHaveURL(/\/es\/privacy$/);
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
  await page.locator(".legal-header").getByRole("link", { name: "Volver" }).click();
  await expect(page).toHaveURL(/\/es#site-footer$/);
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
});

test("direct privacy visits keep a working fallback back link", async ({ page }) => {
  await page.goto("/en/privacy");
  await expect(page.locator(".legal-header").getByRole("link", { name: "Go back" })).toHaveAttribute("href", "/en#site-footer");
});

test("language changes use client navigation and preserve the legal route", async ({ page }) => {
  await page.goto("/es/privacy");
  await page.evaluate(() => ((window as Window & { __spaDocument?: string }).__spaDocument = "preserved"));
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/privacy$/);
  await expect(page.locator("#privacy-title")).toHaveAccessibleName("Your data. Clearly explained.");
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
});

test("privacy notice remains readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/privacy");
  await expect(page.locator("#privacy-title")).toBeVisible();
  await expect(page.locator(".legal-header .back-link")).toBeVisible();
  await expect(page.locator(".legal-header .language-switch")).toBeVisible();
  await expect(page.locator(".legal-index a")).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
