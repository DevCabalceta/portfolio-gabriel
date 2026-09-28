import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/scenes/hero-robot.splinecode*", () => {});
});

test("home exposes localized search and social metadata", async ({ page }) => {
  await page.goto("/es");

  await expect(page).toHaveTitle("Gabriel Cabalceta | Desarrollador web en Costa Rica");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /desarrollador de software y páginas web en Costa Rica/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/es$/);
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute("href", /\/es$/);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", /\/en$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/images\/portfolio-preview\.jpg$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

  const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  const types = structuredData["@graph"].map((entry: { "@type": string }) => entry["@type"]);
  expect(types).toContain("Person");
  expect(types).toContain("WebSite");
  expect(types).toContain("WebPage");
  expect(types.filter((type: string) => type === "Service")).toHaveLength(3);
  expect(structuredData["@graph"].find((entry: { "@type": string }) => entry["@type"] === "Person")).toMatchObject({
    name: "Gabriel Cabalceta",
    alternateName: "DevCabalceta",
    jobTitle: "Full Stack Developer",
  });
});

test("robots and sitemap expose every localized public route", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toMatch(/Allow: \/[\s\S]*Sitemap: .*\/sitemap\.xml/);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const route of ["/es", "/en", "/es/privacy", "/en/privacy", "/es/terms", "/en/terms"]) {
    expect(xml).toContain(route);
  }
  expect(xml).toContain('hreflang="x-default"');
});
