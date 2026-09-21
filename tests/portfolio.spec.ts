import { expect, test } from "@playwright/test";

// Layout/navigation checks hold the external 3D download; the real scene is verified separately.
test.beforeEach(async ({ page }) => {
  await page.route("https://prod.spline.design/**/scene.splinecode", () => {});
});

test("localized routes, persistence and real contact/download destinations", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Gabriel Cabalceta");
  await page.evaluate(() => ((window as Window & { __spaDocument?: string }).__spaDocument = "preserved"));
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.evaluate(() => (window as Window & { __spaDocument?: string }).__spaDocument)).toBe("preserved");
  await expect(page.getByText("From logic to experience.")).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("link", { name: "Let's talk about your next project" })).toHaveAttribute("href", "#services");
  await expect(page.locator(".desktop-nav").getByRole("link", { name: "My CV", exact: true })).toHaveAttribute("target", "_blank");
  await expect(page.locator(".desktop-nav").getByRole("link", { name: "My CV", exact: true })).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByRole("link", { name: "Visit my GitHub profile" })).toHaveAttribute("href", "https://github.com/DevCabalceta");
  const download = page.waitForEvent("download");
  await page.locator(".hero-actions").getByRole("link", { name: "Download CV", exact: true }).click();
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
  await expect(dialog.getByRole("link", { name: /Mi CV/ })).toHaveAttribute("target", "_blank");
  await expect(dialog.getByRole("link", { name: /Mi CV/ })).toHaveAttribute("rel", "noopener noreferrer");
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
  const masked = await page.locator(".profile-photo-frame").evaluate((element) => getComputedStyle(element).maskImage);
  expect(masked).toContain("linear-gradient");
  await expect(page.getByRole("link", { name: "Hablemos de tu próximo proyecto" })).toBeInViewport({ ratio: 1 });
});

test("desktop Hero retains one viewport above the next chapter without clipping", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["es", "en"]) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    for (const [width, height] of [[1024, 600], [1366, 768], [1440, 900], [1920, 1080], [1920, 720], [2560, 1440], [1280, 500]]) {
      await page.setViewportSize({ width, height });
      await expect.poll(() => page.locator(".hero").evaluate((element) => element.getBoundingClientRect().height)).toBe(height);
      const dimensions = await page.locator(".hero").evaluate((element) => ({ height: element.getBoundingClientRect().height, pageHeight: document.documentElement.scrollHeight, viewport: window.innerHeight }));
      expect(dimensions.height).toBe(dimensions.viewport);
      expect(dimensions.pageHeight).toBeGreaterThan(dimensions.viewport);
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
  await expect(page.locator("#about-title")).toHaveAccessibleName("Behind the code.");
  await expect(page.locator("#work-title")).toHaveAccessibleName("Code in action.");
  const archivedProject = page.locator('[data-project="tesla"]');
  await archivedProject.scrollIntoViewIfNeeded();
  await expect(archivedProject).toBeInViewport();
  await expect(archivedProject.locator(".project-links a")).toHaveAttribute("href", "https://gabriel-tesla-landing.netlify.app/");
  await expect(archivedProject.locator(".project-gallery-trigger")).toHaveAttribute("href", "/images/projects/tesla.jpg");
  expect(await page.locator(".chapter-outgoing").evaluate((element) => getComputedStyle(element).position)).toBe("relative");
  await context.close();
});

test("scroll transition blurs, shrinks and fades the Hero, reveals About and reverses", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/es");
  await expect(page.locator(".chapter-transition")).toHaveAttribute("data-motion", "desktop");
  const frame = page.locator(".chapter-frame");
  await expect(page.locator(".floating-actions")).not.toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: "instant" }));
  await expect.poll(() => frame.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeLessThan(0.7);
  const scale = await frame.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
  expect(scale).toBeLessThan(1);
  expect(await frame.evaluate((element) => parseFloat(getComputedStyle(element).filter.slice(5)))).toBeGreaterThan(0);
  await expect(page.locator(".site-header")).toHaveCSS("position", "fixed");
  await expect(page.locator(".site-header")).toBeInViewport({ ratio: 1 });
  expect(scale).toBeGreaterThan(0.83);
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("about")!.offsetTop, behavior: "instant" }));
  await expect(page.locator(".chapter-outgoing")).toHaveAttribute("inert", "");
  await expect(page.locator(".floating-actions")).toBeVisible();
  await expect(page.locator(".floating-actions").getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/50683442305\?text=/);
  await expect(page.locator(".floating-actions a").first()).toHaveAttribute("href", "https://github.com/DevCabalceta");
  await expect(page.locator("[data-about-char]").last()).toHaveCSS("opacity", "1");
  await expect(page.locator("#about-title")).toBeInViewport({ ratio: 1 });
  await page.getByRole("button", { name: "Volver al inicio" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(frame).toHaveCSS("opacity", "1");
  await expect(page.locator(".chapter-outgoing")).not.toHaveAttribute("inert", "");
});

test("About navigation works with reduced motion and reveals real profile content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/en#about$/);
  await expect(page.locator("#about-title")).toBeInViewport({ ratio: 1 });
  await expect(page.locator("#about")).toContainText("Web platforms · internal systems · digital products");
  await expect(page.locator("#about")).not.toContainText("Cedes Don Bosco");
  await expect(page.locator(".technology-item")).toHaveCount(23);
  await expect(page.locator(".chapter-transition")).not.toHaveAttribute("data-motion");
  await expect(page.locator(".chapter-frame")).toHaveCSS("transform", "none");
});

test("every WhatsApp action shares the localized portfolio preview", async ({ page }) => {
  const portfolioOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-gabriel-lemon.vercel.app").replace(/\/$/, "");
  for (const locale of ["es", "en"] as const) {
    await page.goto(`/${locale}`);
    const actions = page.locator('a[href^="https://wa.me/50683442305"]');
    await expect(actions).toHaveCount(9);
    const hrefs = await actions.evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      expect(url.searchParams.get("text")).toContain(`${portfolioOrigin}/${locale}`);
    }
  }
});

test("About keeps a compact editorial composition on ultra-wide screens", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1200 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es#about");
  await expect(page.locator("#about-title")).toBeVisible();
  const layout = await page.locator("#about").evaluate((section) => {
    const frame = section.querySelector<HTMLElement>(".about-frame")!;
    const narrative = section.querySelector<HTMLElement>(".about-narrative")!;
    const facts = section.querySelector<HTMLElement>(".about-facts")!;
    const technologyGrid = section.querySelector<HTMLElement>(".technology-grid")!;
    return {
      frameWidth: frame.getBoundingClientRect().width,
      narrativeWidth: narrative.getBoundingClientRect().width,
      factsWidth: facts.getBoundingClientRect().width,
      gridColumns: getComputedStyle(technologyGrid).gridTemplateColumns.split(" ").length,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
    };
  });
  expect(layout.frameWidth).toBeLessThanOrEqual(2200);
  expect(layout.narrativeWidth).toBeGreaterThanOrEqual(800);
  expect(layout.factsWidth).toBeLessThanOrEqual(1900);
  expect(layout.gridColumns).toBe(12);
  expect(layout.documentWidth).toBe(layout.viewportWidth);
});
