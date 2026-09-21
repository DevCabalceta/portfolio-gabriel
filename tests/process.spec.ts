import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("Process navigation reveals seven chapters with a localized contact", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/es");
  if (page.viewportSize()!.width < 900) {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "04 Proceso" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  } else {
    await page.locator(".desktop-nav").getByRole("link", { name: "Proceso", exact: true }).click();
  }
  await expect(page).toHaveURL(/#process$/);
  await expect(page.locator("#process-title")).toHaveAccessibleName("Tu idea. Paso a paso.");
  await expect(page.locator("[data-process-title]").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".process-step")).toHaveCount(7);
  await expect(page.locator(".site-header")).toBeInViewport({ ratio: 1 });
  await expect(page.locator("#process .service-options, #process select")).toHaveCount(0);
  await expect(page.locator(".process-contact")).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
  await expect(page.locator(".process-contact")).toHaveText(/Iniciar una conversación/);
  await page.goto("/en#process");
  await expect(page.locator("#process-title")).toHaveAccessibleName("Your idea. Step by step.");
  await expect(page.locator(".process-contact")).toHaveText(/Start a conversation/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("timeline draws on scroll and revealed content stays readable on return", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  await expect(page.locator(".process-motion")).toHaveAttribute("data-motion", "true");
  const steps = page.locator(".process-step");
  if (page.viewportSize()!.width >= 900) {
    const progress = page.locator(".process-progress");
    const scale = () => progress.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await scale()).toBe(0);
    await page.locator("#process").evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + innerHeight * 3, behavior: "instant" }));
    await expect.poll(scale).toBeGreaterThan(0.4);
    expect(await scale()).toBeLessThan(0.65);
    await expect.poll(() => steps.nth(3).locator("h3").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);
    await expect.poll(() => steps.first().evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.1);
    await expect(page.locator(".process-stage")).toHaveCSS("position", "sticky");
    await expect(page.locator(".process-intro")).toHaveCSS("opacity", "1");
    await expect(page.locator(".process-intro")).toHaveCSS("transform", "none");
    await page.locator(".process-footer").scrollIntoViewIfNeeded();
    await expect.poll(scale).toBeGreaterThan(0.99);
    await expect.poll(() => steps.last().locator("h3").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);
    await page.locator("#process").evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: "instant" }));
    await expect.poll(scale).toBeLessThan(0.01);
    await expect.poll(() => steps.first().evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);
  } else {
    await expect(page.locator(".process-motion")).toHaveAttribute("data-layout", "timeline");
    await expect(page.locator(".process-stage")).toHaveCSS("position", "relative");
    await expect(page.locator(".process-timeline-track")).toBeVisible();
    const progress = page.locator(".process-timeline-progress");
    const scale = () => progress.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d);
    await steps.nth(3).scrollIntoViewIfNeeded();
    await expect.poll(scale).toBeGreaterThan(0.25);
    await expect.poll(() => steps.nth(3).locator("h3").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);
    const completedNode = steps.nth(3).locator(".process-step-number");
    await expect(completedNode).toHaveClass(/is-complete/);
    await expect(completedNode).toHaveCSS("background-color", "rgb(255, 120, 75)");
    await expect(completedNode).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect.poll(() => completedNode.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");
    await page.locator("#process").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
    await expect(completedNode).not.toHaveClass(/is-complete/);
    await steps.nth(3).scrollIntoViewIfNeeded();
    await expect(completedNode).toHaveClass(/is-complete/);
    const storyHeight = await page.locator(".process-story").evaluate((el) => el.getBoundingClientRect().height);
    expect(storyHeight).toBeLessThan(page.viewportSize()!.height * 6);
    await page.locator(".process-footer").scrollIntoViewIfNeeded();
    await expect.poll(scale).toBeGreaterThan(0.99);
    await expect.poll(() => steps.last().locator("h3").evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);
  }
  await page.getByRole("button", { name: "Volver al inicio" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator(".chapter-frame")).toHaveCSS("filter", "none");
});

test("Process rises above Work with the shared cinematic depth transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  const process = page.locator(".process-motion");
  const work = page.locator(".work");
  await expect(process).toHaveAttribute("data-section-transition", "cinematic");
  await page.evaluate(() => {
    const incoming = document.querySelector(".process-motion")!;
    scrollTo({ top: incoming.getBoundingClientRect().top + scrollY - innerHeight * 0.48, behavior: "instant" });
  });
  await expect(page.locator(".projects-motion")).toHaveCSS("position", "fixed");
  await expect.poll(() => work.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.8);
  await expect.poll(() => work.evaluate((el) => getComputedStyle(el).filter)).not.toBe("none");
  expect(await page.evaluate(() => Boolean(document.elementFromPoint(innerWidth / 2, innerHeight * 0.8)?.closest("#process")))).toBe(true);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(work).toHaveCSS("filter", "none");
  await expect(work).toHaveCSS("opacity", "1");
});

test("Process remains readable at small sizes with reduced motion and without JavaScript", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({width:320,height:480});
  await page.goto("/es#process");
  await expect(page.locator(".process-motion")).not.toHaveAttribute("data-motion");
  for (const step of await page.locator(".process-step").all()) {
    await step.scrollIntoViewIfNeeded();
    await expect(step).toHaveCSS("opacity", "1");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: {width:390,height:744} });
  try {
    const fallback = await context.newPage();
    await fallback.goto("http://localhost:3000/es#process");
    await expect(fallback.locator(".process-step")).toHaveCount(7);
    await expect(fallback.locator("#process .service-options, #process select")).toHaveCount(0);
    await expect(fallback.locator(".process-contact")).toBeVisible();
    await expect(fallback.locator(".process-contact")).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
    await expect(fallback.locator("[data-process-title]").last()).toHaveCSS("opacity", "1");
  } finally { await context.close(); }
});
