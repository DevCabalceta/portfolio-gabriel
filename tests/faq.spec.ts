import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
  await page.route("**/api/exchange-rate", (route) => route.fulfill({ json: { rate: 449.49, date: "2026-09-16" } }));
});

test("FAQ follows Services, stays readable and opens one answer at a time", async ({ page }) => {
  await page.goto("/es#faq");
  await expect(page.locator("#faq-title")).toHaveAccessibleName("Hablemos claro.");
  await expect.poll(() => page.locator("#faq").evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(110);
  await expect(page.locator(".faq-item")).toHaveCount(6);
  const questions = page.locator(".faq-question");
  await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
  await questions.nth(1).click();
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(questions.first()).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#faq-answer-1")).toContainText("precios de referencia");
  await expect(page.locator(".faq-contact")).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  if (page.viewportSize()!.width >= 900) {
    await page.locator(".faq-layout").evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY + 60, behavior: "instant" }));
    const initialTop = await page.locator(".faq-intro").evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate(() => scrollTo({ top: scrollY + 180, behavior: "instant" }));
    const endTop = await page.locator(".faq-intro").evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(endTop - initialTop)).toBeLessThan(4);
  }
});

test("FAQ is localized and its transition uses the shared chapter system", async ({ page }) => {
  await page.goto("/en#faq");
  await expect(page.locator("#faq-title")).toHaveAccessibleName("Let's talk clearly.");
  await expect.poll(() => page.locator("#faq").evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(110);
  await expect(page.locator(".faq-item")).toHaveCount(6);
  await expect(page.locator(".faq-motion")).toHaveAttribute("data-section-transition", "cinematic");
});
