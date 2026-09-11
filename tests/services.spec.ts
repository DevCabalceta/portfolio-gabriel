import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("Services presents three localized scopes with functional WhatsApp actions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/es");
  if (page.viewportSize()!.width < 900) {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "05 Servicios" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  } else {
    await page.locator(".desktop-nav").getByRole("link", { name: "Servicios", exact: true }).click();
  }
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator("#services-title")).toHaveAccessibleName("Una web para cada etapa.");
  await expect(page.locator(".service-plan")).toHaveCount(3);
  await expect(page.locator(".service-plan").nth(0)).toContainText("$150");
  await expect(page.locator(".service-plan").nth(1)).toContainText("$300");
  await expect(page.locator(".service-plan").nth(2)).toContainText("Hablemos");
  await expect(page.locator("[data-service-benefit]")).toHaveCount(28);
  await expect(page.locator(".service-plan-recommended")).toContainText("El equilibrio más completo");
  for (const action of await page.locator(".service-cta").all()) {
    await expect(action).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);

  await page.goto("/en#services");
  await expect(page.locator("#services-title")).toHaveAccessibleName("A website for every stage.");
  await expect(page.locator(".service-plan").nth(1)).toContainText("Create my website");
});

test("Services uses the shared depth transition and a sequential reveal", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  const services = page.locator(".services-motion");
  const processFooter = page.locator(".process-footer");
  await expect(services).toHaveAttribute("data-section-transition", "cinematic");
  await page.evaluate(() => {
    const incoming = document.querySelector(".services-motion")!;
    scrollTo({ top: incoming.getBoundingClientRect().top + scrollY - innerHeight * 0.48, behavior: "instant" });
  });
  await expect(processFooter).toHaveCSS("position", "fixed");
  await expect.poll(() => processFooter.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.8);
  await expect.poll(() => processFooter.evaluate((el) => getComputedStyle(el).filter)).not.toBe("none");
  expect(await page.evaluate(() => Boolean(document.elementFromPoint(innerWidth / 2, innerHeight * 0.82)?.closest("#services")))).toBe(true);

  await page.locator(".services-intro").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("[data-services-intro='title']").last().evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
  if (page.viewportSize()!.width < 900) await page.locator(".service-plan").last().scrollIntoViewIfNeeded();
  else await page.locator(".services-plans").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".service-plan").last().getByRole("link").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
});

test("Process closing statement reveals in sequence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  const footer = page.locator(".process-footer");
  await expect(page.locator(".process-motion")).toHaveAttribute("data-motion", "true");
  // Stabilize the destination after the long pinned Process timeline updates
  // its spacer measurements in the development server.
  for (let attempt = 0; attempt < 3; attempt++) {
    await footer.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(120);
  }
  await expect.poll(() => footer.evaluate((el) => el.getBoundingClientRect().top < innerHeight)).toBe(true);
  await expect.poll(() => footer.locator("[data-process-closing='word']").first().evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
  await expect.poll(() => footer.locator("[data-process-closing='detail']").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
  await expect.poll(() => footer.locator("[data-process-closing='cta']").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
});

test("Services remains readable with reduced motion and without JavaScript", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 480 });
  await page.goto("/es#services");
  await expect(page.locator(".services-motion")).not.toHaveAttribute("data-motion");
  await expect(page.locator(".service-plan")).toHaveCount(3);
  for (const plan of await page.locator(".service-plan").all()) {
    await plan.scrollIntoViewIfNeeded();
    await expect(plan).toHaveCSS("opacity", "1");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 744 } });
  try {
    const fallback = await context.newPage();
    await fallback.goto("http://localhost:3000/es#services");
    await expect(fallback.locator(".service-plan")).toHaveCount(3);
    await expect(fallback.locator("[data-service-benefit]")).toHaveCount(28);
    await expect(fallback.locator(".service-cta")).toHaveCount(3);
    expect(await fallback.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});
