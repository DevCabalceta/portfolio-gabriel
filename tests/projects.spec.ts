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
  expect(await page.locator(".featured-project").evaluateAll((items) => items.slice(0, 5).map((item) => item.getAttribute("data-project")))).toEqual(["upgrade", "fan-de-maiz", "spotify", "gif-search", "todo"]);
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
  const rows = await page.locator(".featured-project").all();
  for (const [index, row] of rows.entries()) {
    await page.locator(".carousel-dots button").nth(index).click();
    await expect(row.locator(".project-media img")).toBeVisible();
    await expect.poll(() => row.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    if (await row.locator(".project-owner").count()) {
      await expect(row.locator(".project-owner")).toContainText("Colaboración frontend · CEDES Don Bosco");
      await expect(row.locator(".project-ownership")).toHaveText("Colaboré en el desarrollo frontend de este proyecto. Pertenece a CEDES Don Bosco.");
    }
  }
  await expect(page.locator(".project-owner")).toHaveCount(5);
  await expect(page.locator('[data-project="bosconet"] h3')).toHaveText("BoscoNet");
  await expect(page.locator('[data-project="bosconet"] .project-links a')).toHaveAttribute("href", "https://bosconet.cedesdonbosco.ed.cr/v1/");
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
  for (const id of ["upgrade", "todo"]) {
    const start = id === "upgrade" ? 0 : 6;
    await page.locator(".carousel-dots button").nth(id === "upgrade" ? 0 : 4).click();
    const trigger = page.locator(`[data-project="${id}"] .project-gallery-trigger`);
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".gallery-caption")).toContainText(`${start + 1} de 15 · 1/3`);
    await expect(dialog.locator(".gallery-thumbnails")).toHaveCount(0);
    await expect(dialog.locator(".gallery-stage img")).toHaveAttribute("src", new RegExp(`${id}-1`));
    await dialog.getByRole("button", { name: "Imagen siguiente" }).click();
    await expect(dialog.locator(".gallery-caption")).toContainText("2/3");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.locator(".gallery-stage img")).toHaveAttribute("src", new RegExp(`${id}-3`));
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.locator(".gallery-caption")).toContainText("1/3");
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await dialog.getByRole("button", { name: "Cerrar galería" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Imagen siguiente" })).toBeFocused();
    expect(await dialog.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    const imageBox = (await dialog.locator(".gallery-stage img").boundingBox())!;
    const titleBox = (await dialog.locator("h2").boundingBox())!;
    expect(titleBox.y).toBeGreaterThanOrEqual(imageBox.y + imageBox.height);
    expect(imageBox.y).toBeGreaterThanOrEqual(0);
    expect(await dialog.evaluate((element) => getComputedStyle(element, "::backdrop").backdropFilter)).toBe("blur(18px)");
    await expect(dialog.locator(".gallery-arrow").first()).toHaveCSS("border-top-color", await page.locator(".carousel-navigation button").first().evaluate((element) => getComputedStyle(element).borderTopColor));
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
});

test("carousel controls, dots and keyboard loop in both directions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#selected-projects");
  const track = page.locator(".carousel-viewport");
  const carousel = page.locator(".project-carousel");
  const previous = page.getByRole("button", { name: "Proyecto anterior", exact: true });
  const next = page.getByRole("button", { name: "Proyecto siguiente", exact: true });
  await expect(carousel).toHaveAttribute("data-enhanced", "true");
  await expect(previous).toBeEnabled();
  await next.click();
  await expect(carousel).toHaveAttribute("data-selected", "1");
  await expect(previous).toBeEnabled();
  await track.focus();
  const initialY = await page.evaluate(() => scrollY);
  await page.keyboard.press("End");
  await expect(next).toBeEnabled();
  await expect(carousel).toHaveAttribute("data-selected", "10");
  const last = page.locator('[data-project="tesla"]');
  await expect(last).toBeInViewport();
  expect(await page.evaluate(() => scrollY)).toBe(initialY);
  await page.keyboard.press("ArrowRight");
  await expect(carousel).toHaveAttribute("data-selected", "0");
  await page.keyboard.press("ArrowLeft");
  await expect(carousel).toHaveAttribute("data-selected", "10");
  await page.keyboard.press("Home");
  await expect(carousel).toHaveAttribute("data-selected", "0");
  await page.keyboard.press("ArrowRight");
  await expect(carousel).toHaveAttribute("data-selected", "1");
  await page.keyboard.press("ArrowLeft");
  await expect(carousel).toHaveAttribute("data-selected", "0");
  await page.locator(".carousel-dots button").nth(6).click();
  await expect(carousel).toHaveAttribute("data-selected", "6");
  await expect(page.locator(".carousel-dots button").nth(6)).toHaveAttribute("aria-current", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("shared gallery crosses project boundaries and wraps to the first project", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#selected-projects");
  await page.locator(".carousel-dots button").first().click();
  await page.locator('[data-project="upgrade"] .project-gallery-trigger').click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Upgrade! Comunicación y Entretenimiento");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await dialog.getByRole("button", { name: "Imagen siguiente" }).click();
  await expect(dialog).toHaveAccessibleName("Fan de Maíz");
  await expect(dialog.locator(".gallery-stage img")).toHaveAttribute("src", /fan-de-maiz/);
  for (let step = 0; step < 5; step++) await page.keyboard.press("ArrowLeft");
  await expect(dialog).toHaveAccessibleName("BoscoNet");
  await expect(dialog.locator(".project-owner")).toHaveText("Colaboración frontend · CEDES Don Bosco");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("Tesla Landing Page Clone");
  await dialog.getByRole("button", { name: "Imagen siguiente" }).click();
  await expect(dialog).toHaveAccessibleName("Upgrade! Comunicación y Entretenimiento");
  await expect(dialog.locator(".gallery-caption")).toContainText("1 de 15");
  await dialog.getByRole("button", { name: "Imagen anterior" }).click();
  await expect(dialog).toHaveAccessibleName("Tesla Landing Page Clone");
});

test("gallery keeps its caption mounted while only the screenshot changes", async ({ page }) => {
  await page.goto("/es#selected-projects");
  await page.locator(".carousel-dots button").first().evaluate((button: HTMLButtonElement) => button.click());
  await page.locator('[data-project="upgrade"] .project-gallery-trigger').evaluate((link: HTMLAnchorElement) => link.click());
  const dialog = page.getByRole("dialog");
  const caption = await dialog.locator(".gallery-caption").elementHandle();
  expect(caption).not.toBeNull();
  await expect(dialog.locator(".gallery-counter")).toContainText("1/3");
  await dialog.getByRole("button", { name: "Imagen siguiente" }).click();
  await expect(dialog.locator(".gallery-counter")).toContainText("2/3");
  expect(await caption!.evaluate((element) => element.isConnected)).toBe(true);
  await expect(dialog.locator(".gallery-caption")).toHaveCSS("opacity", "1");
  await expect(dialog.locator("h2")).toHaveText("Upgrade! Comunicación y Entretenimiento");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator("h2")).toHaveText("Fan de Maíz");
  expect(await caption!.evaluate((element) => element.isConnected)).toBe(true);
  await expect(dialog.locator(".gallery-counter")).toContainText("4 de 15");
});

test("autoplay continues every three seconds through hover, controls and galleries", async ({ page }) => {
  await page.goto("/es#selected-projects");
  const carousel = page.locator(".project-carousel");
  await expect(carousel).toHaveAttribute("data-enhanced", "true");
  await carousel.scrollIntoViewIfNeeded();
  await page.locator(".carousel-viewport").focus();
  await page.keyboard.press("Home");
  await page.locator('[data-project="upgrade"] .project-gallery-trigger').hover();
  await expect(carousel).toHaveAttribute("data-playing", "true");
  await expect(carousel).toHaveAttribute("data-selected", "1", { timeout: 4000 });
  await expect(page.locator(".carousel-play")).toHaveCount(0);
  await page.getByRole("button", { name: "Proyecto siguiente", exact: true }).click();
  await expect(carousel).toHaveAttribute("data-selected", "2");
  await expect(carousel).toHaveAttribute("data-playing", "true");
  await expect(carousel).toHaveAttribute("data-selected", "3", { timeout: 4000 });
  await page.locator(".carousel-dots button").nth(1).evaluate((button: HTMLButtonElement) => button.click());
  await page.locator('[data-project="fan-de-maiz"] .project-gallery-trigger').focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(carousel).toHaveAttribute("data-playing", "true");
  const behindGallery = await carousel.getAttribute("data-selected");
  await expect(carousel).not.toHaveAttribute("data-selected", behindGallery!, { timeout: 4000 });
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(carousel).toHaveAttribute("data-playing", "false");
});

test("mouse dragging changes cards without accidentally opening a gallery", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Mouse dragging is a desktop interaction");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#selected-projects");
  await expect(page.locator(".project-carousel")).toHaveAttribute("data-enhanced", "true");
  const cover = page.locator('[data-project="fan-de-maiz"] .project-media');
  await cover.scrollIntoViewIfNeeded();
  const box = (await cover.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - box.width * 0.5, box.y + box.height / 2, { steps: 20 });
  await page.mouse.up();
  await expect(page.locator(".project-carousel")).not.toHaveAttribute("data-selected", "0");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("About overlaps the sticky Hero in mobile and desktop", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".chapter-transition")).toHaveAttribute("data-motion");
  await page.evaluate(() => scrollTo({ top: document.querySelector('#about')!.getBoundingClientRect().top + scrollY - innerHeight * 0.5, behavior: 'instant' }));
  await expect(page.locator(".chapter-outgoing")).toHaveCSS("position", "sticky");
  expect(Math.abs((await page.locator(".chapter-outgoing").boundingBox())!.y)).toBeLessThan(2);
  expect(await page.evaluate(() => Boolean(document.elementFromPoint(innerWidth / 2, innerHeight * 0.8)?.closest('#about')))).toBe(true);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator(".chapter-frame")).toHaveCSS("filter", "none");
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
