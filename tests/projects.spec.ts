import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("Work navigation opens a complete, localized project selection", async ({ page }) => {
  await page.goto("/es");
  if (page.viewportSize()!.width < 900) {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "03 Proyectos" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  } else {
    await page.locator(".desktop-nav").getByRole("link", { name: "Proyectos", exact: true }).click();
  }
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work-title")).toHaveAccessibleName("Código en acción.");
  await expect(page.locator("[data-work-char]").last()).toHaveCSS("opacity", "1");
  await expect(page.locator("#work-title")).toBeInViewport({ ratio: 1 });
  await expect(page.locator(".site-header")).toBeInViewport({ ratio: 1 });
  await expect(page.locator(".floating-actions")).toBeVisible();
  await expect(page.locator("#work [data-project]")).toHaveCount(11);
  await expect(page.locator(".featured-project")).toHaveCount(11);
  await expect(page.locator(".project-index, .project-row")).toHaveCount(0);
  expect(await page.locator(".featured-project").evaluateAll((items) => items.slice(0, 5).map((item) => item.getAttribute("data-project")))).toEqual(["fan-de-maiz", "gif-search", "upgrade", "todo", "spotify"]);
  const feature = page.locator('[data-project="fan-de-maiz"]');
  await feature.scrollIntoViewIfNeeded();
  await expect(feature.locator(".project-links a")).toHaveAttribute("href", "https://fandemaiz.com/");
  await expect.poll(() => feature.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Volver al inicio" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator(".about-frame")).toHaveCSS("opacity", "1");
  await page.goto("/en#work");
  await expect(page.locator("#work-title")).toHaveAccessibleName("Code in action.");
  await expect(page.locator(".work-introduction")).toContainText("Platforms that solve problems");
});

test("all carousel cards retain images, ownership and real destinations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#work");
  const spotify = page.locator('[data-project="spotify"]');
  await expect(spotify.locator(".project-technologies")).toHaveText("Astro");
  await expect(spotify.locator(".project-links a")).toHaveAttribute("href", "https://spotify-clone-silk-chi.vercel.app/");
  const upgrade = page.locator('[data-project="upgrade"]');
  await expect(upgrade.locator(".project-status")).toHaveText("En desarrollo");
  await expect(upgrade.locator(".project-links a")).toHaveCount(0);
  await expect(page.locator('[data-project="todo"] .project-status')).toHaveText("En desarrollo");
  await expect(page.locator('[data-project="todo"] .project-links a')).toHaveCount(0);
  for (const row of await page.locator(".featured-project").all()) {
    await row.scrollIntoViewIfNeeded();
    await expect(row.locator(".project-media img")).toBeVisible();
    await expect.poll(() => row.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    if (await row.locator(".project-owner").count()) {
      await expect(row.locator(".project-owner")).toContainText("Colaboración · CEDES Don Bosco");
      await expect(row.locator(".project-ownership")).toHaveText("Colaboré en este proyecto. Pertenece a CEDES Don Bosco.");
    }
  }
  await expect(page.locator(".project-owner")).toHaveCount(5);
  await expect(page.locator('[data-project="bosnet"] h3')).toHaveText("BosNet");
  await expect(page.locator('[data-project="bosnet"] .project-links a')).toHaveAttribute("href", "https://bosconet.cedesdonbosco.ed.cr/v1/");
  await expect(page.locator("[data-work-char]").first()).toHaveCSS("transform", "none");
  await expect(page.locator(".about-frame")).toHaveCSS("filter", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("About fades and blurs only during the transition into Work", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".chapter-transition")).toHaveAttribute("data-motion");
  const about = page.locator(".about-frame");
  const aboutHeight = await page.locator("#about").evaluate((element) => element.getBoundingClientRect().height);
  await expect(page.locator("[data-work-char]").first()).toHaveCSS("opacity", "0");
  await expect(about).toHaveCSS("opacity", "1");
  await page.evaluate(() => window.scrollTo({ top: document.querySelector(".projects-motion")!.getBoundingClientRect().top + scrollY - innerHeight * 0.3, behavior: "instant" }));
  await expect.poll(() => about.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeLessThan(0.7);
  await expect.poll(() => about.evaluate((element) => parseFloat(getComputedStyle(element).filter.slice(5)))).toBeGreaterThan(0);
  await expect(page.locator(".about-pin")).toHaveCSS("position", "fixed");
  expect(Math.abs(await page.locator("#about").evaluate((element) => element.getBoundingClientRect().height) - aboutHeight)).toBeLessThan(2);
  expect(await page.evaluate(() => document.elementFromPoint(innerWidth / 2, innerHeight * 0.7)?.closest("#work") !== null)).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(about).toHaveCSS("opacity", "1");
  await expect(page.locator(".chapter-frame")).toHaveCSS("filter", "none");
});

test("carousel stays in one row and screenshot galleries support keyboard and touch", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#selected-projects");
  const cards = page.locator(".featured-project");
  const boxes = await cards.evaluateAll((items) => items.map((item) => ({ x: item.getBoundingClientRect().x, y: item.getBoundingClientRect().y })));
  if (page.viewportSize()!.width >= 1100) {
    expect(boxes[0].y).toBe(boxes[1].y);
    expect(boxes[1].y).toBe(boxes[2].y);
    expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
  }
  expect(boxes.every((box) => box.y === boxes[0].y)).toBe(true);
  expect(boxes[10].x).toBeGreaterThan(page.viewportSize()!.width);
  for (const id of ["upgrade", "todo"]) {
    const trigger = page.locator(`[data-project="${id}"] .project-gallery-trigger`);
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".gallery-caption")).toContainText("1 de 3");
    await expect(dialog.locator(".gallery-stage img")).toHaveAttribute("src", new RegExp(`${id}-1`));
    await dialog.getByRole("button", { name: "Imagen siguiente" }).click();
    await expect(dialog.locator(".gallery-caption")).toContainText("2 de 3");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.locator(".gallery-stage img")).toHaveAttribute("src", new RegExp(`${id}-3`));
    await dialog.locator(".gallery-thumbnails button").first().click();
    await expect(dialog.locator(".gallery-caption")).toContainText("1 de 3");
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await dialog.getByRole("button", { name: "Cerrar galería" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.locator(".gallery-thumbnails button").last()).toBeFocused();
    expect(await dialog.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
});

test("carousel controls and keyboard reach both ends without vertical scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#selected-projects");
  const track = page.locator("#project-track");
  const previous = page.getByRole("button", { name: "Proyecto anterior", exact: true });
  const next = page.getByRole("button", { name: "Proyecto siguiente", exact: true });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await track.focus();
  const initialY = await page.evaluate(() => scrollY);
  await page.keyboard.press("End");
  await expect(next).toBeDisabled();
  await expect(page.locator(".carousel-position")).toContainText("11 / 11");
  const last = page.locator('[data-project="tesla"]');
  await expect(last).toBeInViewport();
  expect(await page.evaluate(() => scrollY)).toBe(initialY);
  await page.keyboard.press("Home");
  await expect(previous).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(previous).toBeEnabled();
  await page.keyboard.press("ArrowLeft");
  await expect(previous).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("About remains visible when scrolling back after passing the pin and resizing", async ({ page }) => {
  if (page.viewportSize()!.width >= 900) await page.setViewportSize({ width: 1900, height: 900 });
  await page.goto("/es");
  await expect(page.locator(".chapter-transition")).toHaveAttribute("data-motion");
  for (let pass = 0; pass < 2; pass++) {
    await page.locator(".work-footer").scrollIntoViewIfNeeded();
    const size = page.viewportSize()!;
    await page.setViewportSize({ width: size.width, height: size.height - 12 });
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    // Reverse gradually through the pin boundary, as with wheel/touch scrolling.
    const destination = await page.locator("#about").evaluate((element) => element.getBoundingClientRect().top + scrollY - 80);
    while (await page.evaluate(() => scrollY) > destination + 1) {
      await page.evaluate((end) => scrollTo({ top: Math.max(end, scrollY - 180), behavior: "instant" }), destination);
      await page.waitForTimeout(40);
    }
    await expect(page.locator(".about-frame")).toHaveCSS("opacity", "1");
    await expect(page.locator(".about-frame")).toHaveCSS("filter", "none");
    await expect(page.locator(".about-pin")).not.toHaveCSS("position", "fixed");
    await expect(page.locator("[data-about-char]").last()).toHaveCSS("opacity", "1");
    await expect(page.locator(".about-title")).toBeInViewport({ ratio: 1 });
    expect(await page.locator(".about-frame").evaluate((element: HTMLElement) => element.inert)).toBe(false);
    const titlePainted = await page.locator(".about-title").evaluate((element) => {
      const box = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(box.left + 20, box.top + 30));
    });
    expect(titlePainted).toBe(true);
    await page.locator(".about-lead").scrollIntoViewIfNeeded();
    await expect(page.locator(".about-lead")).toHaveCSS("opacity", "1");
  }
});
