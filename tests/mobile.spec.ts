import { test, expect } from "@playwright/test";
import { networkInterfaces } from "node:os";

test("both Hero actions fit in the first mobile screen with a compact portrait", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["es", "en"]) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    for (const [width, height] of [[320, 480], [375, 560], [390, 600], [390, 664], [430, 740], [768, 700]]) {
      await page.setViewportSize({ width, height });
      await expect.poll(() => page.evaluate(() => window.innerHeight)).toBe(height);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      for (const action of await page.locator(".hero-actions a").all()) {
        await expect(action).toBeInViewport({ ratio: 1 });
        const box = await action.boundingBox();
        const viewport = await page.evaluate(() => ({ height: window.visualViewport?.height ?? window.innerHeight, top: window.visualViewport?.offsetTop ?? 0 }));
        expect(box!.y).toBeGreaterThanOrEqual(viewport.top);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.top + viewport.height);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
      const portrait = await page.locator(".hero-photo-frame").boundingBox();
      const title = await page.locator(".hero-title").boundingBox();
      expect(portrait!.width).toBeLessThanOrEqual(72);
      expect(portrait!.y + portrait!.height).toBeLessThanOrEqual(title!.y);
    }
  }
});

test("touch menu opens, closes and reopens with visible interactive content", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/es");
  const trigger = page.getByRole("button", { name: "Abrir menú" });
  const dialog = page.getByRole("dialog");
  for (let attempt = 0; attempt < 3; attempt++) {
    await trigger.tap();
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.matches(":modal"))).toBe(true);
    await expect(dialog.getByRole("link", { name: "01 Inicio" })).toBeVisible();
    await expect(page.locator(".mobile-menu-panel")).toHaveCSS("opacity", "1");
    await dialog.getByRole("button", { name: "Cerrar menú" }).tap();
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  }
  await trigger.tap();
  await dialog.getByRole("link", { name: "English", exact: true }).tap();
  await expect(page).toHaveURL(/\/en$/);
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).tap();
  await expect(dialog.getByRole("link", { name: "01 Home" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("LAN preview loads interactive mobile navigation", async ({ page }) => {
  const address = Object.values(networkInterfaces()).flat().find((entry) => entry?.family === "IPv4" && !entry.internal)?.address;
  test.skip(!address, "No LAN interface available");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`http://${address}:3000/es`);
  await page.getByRole("button", { name: "Abrir menú" }).tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".mobile-menu-panel")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});
