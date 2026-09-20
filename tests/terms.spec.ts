import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("terms page is localized, complete and connected to its legal references", async ({ page }) => {
  for (const locale of ["es", "en"] as const) {
    await page.goto(`/${locale}/terms`);
    const main = page.locator("#terms-content");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toHaveAccessibleName(locale === "es" ? "Acuerdos. Sin sorpresas." : "Clear terms. No surprises.");
    await expect(main.locator(".legal-section")).toHaveCount(11);
    await expect(page).toHaveTitle(locale === "es" ? "Términos y condiciones — Gabriel Cabalceta" : "Terms and conditions — Gabriel Cabalceta");
    await expect(page.locator("a[href*='nValor2=26481']")).toHaveAttribute("target", "_blank");
    await expect(page.locator("a[href*='nValor2=3396']")).toHaveAttribute("target", "_blank");
    await expect(page.locator(".legal-contact-actions").getByRole("link", { name: locale === "es" ? "Consultar aviso de privacidad" : "Read the privacy notice" })).toHaveAttribute("href", `/${locale}/privacy`);
    await expect(page.locator(".legal-header .language-switch a").nth(locale === "es" ? 1 : 0)).toHaveAttribute("href", locale === "es" ? "/en/terms" : "/es/terms");
    await expect(page.locator(".legal-primary-action")).toHaveAttribute("href", "mailto:cabalceta.gabriel.2001@gmail.com");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("terms link uses SPA navigation and Go back restores the footer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#site-footer");
  await page.evaluate(() => ((window as Window & { __spaDocument?: string }).__spaDocument = "preserved"));
  await page.locator("#site-footer").getByRole("link", { name: "Términos y condiciones" }).click();
  await expect(page).toHaveURL(/\/es\/terms$/);
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
  await page.locator(".legal-header").getByRole("link", { name: "Volver" }).click();
  await expect(page).toHaveURL(/\/es#site-footer$/);
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
});

test("terms language switch keeps the legal route and document", async ({ page }) => {
  await page.goto("/es/terms");
  await page.evaluate(() => ((window as Window & { __spaDocument?: string }).__spaDocument = "preserved"));
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/terms$/);
  await expect(page.locator("#terms-title")).toHaveAccessibleName("Clear terms. No surprises.");
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
});

test("terms remain readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/terms");
  await expect(page.locator("#terms-title")).toBeVisible();
  await expect(page.locator(".legal-header .back-link")).toBeVisible();
  await expect(page.locator(".legal-header .language-switch")).toBeVisible();
  await expect(page.locator(".legal-index a")).toHaveCount(11);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
