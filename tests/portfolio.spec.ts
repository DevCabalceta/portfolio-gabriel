import { expect, test } from "@playwright/test";

test("localized routes, persistence and real contact/download destinations", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Gabriel Cabalceta");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("From logic to experience.")).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("link", { name: "Let's talk about your next project" })).toHaveAttribute("href", "mailto:cabalceta.gabriel.2001@gmail.com");
  await expect(page.getByRole("link", { name: "Visit my GitHub profile" })).toHaveAttribute("href", "https://github.com/DevCabalceta");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download CV" }).click();
  expect((await download).suggestedFilename()).toBe("CV-GabrielCabalceta.pdf");
  const pdf = await request.get("/documents/CV-GabrielCabalceta.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await request.get("/fr")).status()).toBe(404);
  expect(errors).toEqual([]);
});

test("mobile menu keeps keyboard focus inside, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es");
  const trigger = page.getByRole("button", { name: "Abrir menú" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  for (let index = 0; index < 9; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("responsive layouts keep title and actions inside the viewport", async ({ page }) => {
  await page.goto("/es");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const element of await page.locator("[data-hero-line], .action-link").all()) {
      const box = await element.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
  }
});

test("reduced motion leaves the content visible without animated transforms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.locator("[data-hero-line]").first().evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await expect(page.locator(".gallery-track").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator(".gallery-toggle")).not.toBeVisible();
});

test("gallery moves diagonally downwards, pauses and resumes without blocking content", async ({ page }) => {
  await page.goto("/es");
  const track = page.locator(".gallery-track").first();
  await expect(track).toHaveCSS("animation-play-state", "running");
  const tile = page.locator(".gallery-tile").first();
  const before = await tile.boundingBox();
  await expect.poll(async () => (await tile.boundingBox())!.y).toBeGreaterThan(before!.y + 2);
  expect((await tile.boundingBox())!.x).toBeGreaterThan(before!.x);
  await page.getByRole("button", { name: "Pausar galería de fondo" }).click();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Reanudar galería de fondo" }).click();
  await expect(track).toHaveCSS("animation-play-state", "running");
  const masked = await page.locator(".hero-photo-frame").evaluate((element) => getComputedStyle(element).maskImage);
  expect(masked).toContain("linear-gradient");
  await expect(page.getByRole("link", { name: "Hablemos de tu próximo proyecto" })).toBeInViewport({ ratio: 1 });
});

test("desktop Hero fits one viewport without scrolling or clipping its content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["es", "en"]) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    for (const [width, height] of [[1024, 600], [1366, 768], [1440, 900], [1920, 1080], [1920, 720], [2560, 1440], [1280, 500]]) {
      await page.setViewportSize({ width, height });
      await expect.poll(() => page.locator(".hero").evaluate((element) => element.getBoundingClientRect().height)).toBe(height);
      const dimensions = await page.locator(".hero").evaluate((element) => ({ height: element.getBoundingClientRect().height, pageHeight: document.documentElement.scrollHeight, viewport: window.innerHeight }));
      expect(dimensions.height).toBe(dimensions.viewport);
      expect(dimensions.pageHeight).toBeLessThanOrEqual(dimensions.viewport);
      const topLine = await page.locator(".hero-topline").boundingBox();
      const role = await page.locator(".hero-role").boundingBox();
      const actions = await page.locator(".hero-actions").boundingBox();
      const footer = await page.locator(".hero-footer").boundingBox();
      expect(role!.y).toBeGreaterThanOrEqual(topLine!.y + topLine!.height);
      expect(actions!.y + actions!.height).toBeLessThanOrEqual(footer!.y);
      for (const element of await page.locator("[data-hero-line], .hero-description, .action-link, .hero-footer").all()) {
        const box = await element.boundingBox();
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(height + 1);
      }
    }
  }
});

test("the introduction and locale links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/es");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Download CV" })).toBeVisible();
  await expect(page.locator(".gallery-track").first()).toHaveCSS("animation-play-state", "paused");
  await context.close();
});
