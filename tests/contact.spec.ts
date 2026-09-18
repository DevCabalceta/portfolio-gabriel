import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("Contact is reachable after FAQ, translated, and fits the viewport width", async ({ page }) => {
  for (const [locale, title] of [["es", "Hablemos por WhatsApp."], ["en", "Let's talk on WhatsApp."]] as const) {
    await page.goto(`/${locale}#contact`);
    const section = page.locator("#contact");
    await expect(section).toBeVisible();
    await expect(section.locator("h2")).toHaveAccessibleName(title);
    await expect(section.locator(".contact-direct")).toHaveAttribute("href", "https://wa.me/50683442305");
    await expect(section.locator("form")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator("#faq").evaluate((element) => element.compareDocumentPosition(document.querySelector("#contact")!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  }
});

test("Contact form prepares a localized WhatsApp message without submitting it", async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { openedContactUrl?: string }).open = (url) => {
      (window as Window & { openedContactUrl?: string }).openedContactUrl = String(url);
      return null;
    };
  });
  for (const locale of ["es", "en"] as const) {
    await page.goto(`/${locale}#contact`);
    await expect(page.locator(".contact-motion")).toHaveAttribute("data-motion", "true");
    const form = page.locator("#contact form");
    await form.locator("button[type=submit]").click();
    expect(await page.evaluate(() => (window as Window & { openedContactUrl?: string }).openedContactUrl)).toBeUndefined();
    await expect(page.locator("[data-sileo-toast]")).toContainText(locale === "es" ? "Revisa el formulario" : "Check the form");
    await expect(form.locator('[name="name"]')).toHaveAttribute("aria-invalid", "true");
    await expect(form.locator('[name="name"]')).toBeFocused();
    await form.locator('[name="name"]').fill("Ana Solís");
    await expect(form.locator('[name="name"]')).toHaveAttribute("aria-invalid", "false");
    await form.locator('[name="type"]').selectOption({ index: 1 });
    await form.locator('[name="goal"]').fill("Vender en línea");
    await form.locator('[name="details"]').fill("Necesito un catálogo y pagos.");
    await form.locator("button[type=submit]").click();
    const url = await page.evaluate(() => (window as Window & { openedContactUrl?: string }).openedContactUrl);
    expect(url).toBeDefined();
    const parsed = new URL(url!);
    expect(parsed.origin + parsed.pathname).toBe("https://wa.me/50683442305");
    const message = parsed.searchParams.get("text")!;
    expect(message).toContain("Ana Solís");
    expect(message).toContain("Vender en línea");
    expect(message).toContain("Necesito un catálogo y pagos.");
    expect(message).toContain(locale === "es" ? "Me interesa: Landing Page." : "I'm interested in: Landing Page.");
  }
});

test("Contact action arrows move on hover and stay still with reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Hover is checked with a mouse");
  await page.goto("/es#contact");
  const directArrow = page.locator(".contact-direct > svg");
  const submitArrow = page.locator(".contact-submit svg");
  await page.locator(".contact-direct").hover();
  await expect.poll(() => directArrow.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await page.locator(".contact-submit").hover();
  await expect.poll(() => submitArrow.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await submitArrow.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThan(0.001);
});

test("Contact uses the shared section transition and remains readable with reduced motion", async ({ page }) => {
  await page.goto("/es#contact");
  await expect(page.locator(".contact-motion")).toHaveAttribute("data-motion", "true");
  await expect(page.locator("#contact form button[type=submit]")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".contact-motion")).not.toHaveAttribute("data-motion", "true");
  await expect(page.locator("#contact h2")).toBeVisible();
  await expect(page.locator("#contact form button[type=submit]")).toBeVisible();
});

test("Contact keeps the heading and form inside narrow and compact viewports", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Viewport sweep runs once in desktop Chromium");
  for (const size of [{ width: 320, height: 480 }, { width: 900, height: 700 }]) {
    await page.setViewportSize(size);
    await page.goto("/es#contact");
    const heading = (await page.locator("#contact h2").boundingBox())!;
    const submit = (await page.locator("#contact form button[type=submit]").boundingBox())!;
    expect(heading.x).toBeGreaterThanOrEqual(0);
    expect(heading.x + heading.width).toBeLessThanOrEqual(size.width + 1);
    expect(submit.x).toBeGreaterThanOrEqual(0);
    expect(submit.x + submit.width).toBeLessThanOrEqual(size.width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
