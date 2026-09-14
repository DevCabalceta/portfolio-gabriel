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
  const amounts = page.locator("[data-service-amount]");
  await amounts.nth(0).scrollIntoViewIfNeeded();
  await expect(amounts.nth(0)).toHaveText("$150");
  await amounts.nth(1).scrollIntoViewIfNeeded();
  await expect(amounts.nth(1)).toHaveText("$300");
  await expect(page.locator(".service-plan").nth(2)).toContainText("Hablemos");
  await expect(page.locator("[data-service-benefit]")).toHaveCount(28);
  await expect(page.locator(".service-plan-recommended")).toContainText("El equilibrio más completo");
  await expect(page.getByRole("button", { name: "USD" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "CRC" }).click();
  await expect(page.getByRole("button", { name: "CRC" })).toHaveAttribute("aria-pressed", "true");
  await amounts.nth(0).scrollIntoViewIfNeeded();
  await expect(amounts.nth(0)).toHaveText("₡75.000");
  await amounts.nth(1).scrollIntoViewIfNeeded();
  await expect(amounts.nth(1)).toHaveText("₡150.000");
  await expect(page.locator(".service-plan").nth(2)).toContainText("Hablemos");
  for (const action of await page.locator(".service-cta").all()) {
    await expect(action).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);

  await page.goto("/en#services");
  await expect(page.locator("#services-title")).toHaveAccessibleName("A website for every stage.");
  await expect(page.locator(".service-plan").nth(1)).toContainText("Create my website");
});

test("desktop comparison keeps every benefit and action inside one viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/es#services");
  await page.locator(".services-pricing").evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: "instant" }));
  const layout = await page.evaluate(() => {
    const headerBottom = document.querySelector(".site-header")!.getBoundingClientRect().bottom;
    const plansBox = document.querySelector(".services-plans")!.getBoundingClientRect();
    const plans = [...document.querySelectorAll(".service-plan")].map((plan) => {
      const benefits = [...plan.querySelectorAll("[data-service-benefit]")];
      return {
        top: plan.getBoundingClientRect().top,
        lastBenefitBottom: benefits.at(-1)!.getBoundingClientRect().bottom,
        ctaBottom: plan.querySelector(".service-cta")!.getBoundingClientRect().bottom,
      };
    });
    return {
      headerBottom,
      plans,
      plansTop: plansBox.top,
      plansBottom: plansBox.bottom,
      viewportBottom: innerHeight,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  for (const plan of layout.plans) {
    expect(plan.top).toBeGreaterThanOrEqual(layout.headerBottom);
    expect(plan.lastBenefitBottom).toBeLessThan(layout.viewportBottom);
    expect(plan.ctaBottom).toBeLessThanOrEqual(layout.viewportBottom);
  }
  expect(layout.plansTop - layout.headerBottom).toBeLessThan(100);
  expect(Math.abs(layout.plansBottom - layout.viewportBottom)).toBeLessThanOrEqual(2);
  expect(layout.overflow).toBeLessThanOrEqual(0);
  const benefitSize = Number.parseFloat(await page.locator("[data-service-benefit]").first().evaluate((el) => getComputedStyle(el).fontSize));
  expect(benefitSize).toBeGreaterThanOrEqual(11);
  await expect(page.locator(".service-cta").first()).toHaveCSS("background-color", "rgb(242, 240, 233)");
  await expect(page.locator(".service-cta").first()).toHaveCSS("justify-content", "center");
  expect(Number.parseFloat(await page.locator(".service-cta").first().evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
  await expect(page.locator(".service-cta").first().locator("svg")).toHaveCSS("position", "absolute");
});

test("mobile plans keep their active state without hover", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 744 });
  await page.goto("/es#services");
  const plan = page.locator(".service-plan").first();
  await page.locator(".services-pricing").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
  await expect(plan.locator("h3")).toHaveCSS("color", "rgb(255, 120, 75)");
  await expect(plan.locator(".service-cta")).toHaveCSS("background-color", "rgb(255, 120, 75)");
  const accentWidth = await plan.evaluate((el) => Number.parseFloat(getComputedStyle(el, "::after").width));
  expect(accentWidth).toBeGreaterThan(0);
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
