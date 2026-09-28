import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const baseURL = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

async function verifyViewport(viewport, mobile = false) {
  const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile });
  const errors = [];
  const failedResponses = [];
  const failedRequests = [];
  const externalSplineRequests = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });
  page.on("requestfailed", (request) => failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on("request", (request) => {
    if (/splinetool|unpkg\.com/i.test(request.url()) && !request.url().startsWith(baseURL)) externalSplineRequests.push(request.url());
  });

  await page.goto(`${baseURL}/es`, { waitUntil: "domcontentloaded" });
  if (!mobile) await page.locator(".hero-robot").waitFor({ state: "visible" });

  for (const selector of ["#about", "#work", "#process", "#services", "#faq", "#contact", "#site-footer"]) {
    await page.locator(selector).evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "center" }));
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(250);

  const assetState = await page.evaluate(() => {
    const images = [...document.images];
    return {
      brokenImages: images.filter((image) => image.currentSrc && image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    };
  });

  for (const selector of ["#contact", "#faq", "#services", "#process", "#work", "#about", "#home"]) {
    await page.locator(selector).evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);

  assert.equal(await page.evaluate(() => scrollY), 0);
  assert.equal(assetState.horizontalOverflow <= 0, true, `Horizontal overflow: ${assetState.horizontalOverflow}px`);
  assert.deepEqual(assetState.brokenImages, []);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResponses, []);
  assert.deepEqual(failedRequests, []);
  assert.deepEqual(externalSplineRequests, []);
  if (mobile) assert.equal(await page.locator(".hero-robot").count(), 0);
  await page.close();
}

try {
  await verifyViewport({ width: 1366, height: 768 });
  await verifyViewport({ width: 390, height: 744 }, true);
  const context = await browser.newContext();
  for (const path of ["/es", "/en", "/es/privacy", "/en/privacy", "/es/terms", "/en/terms", "/robots.txt", "/sitemap.xml"]) {
    const response = await context.request.get(`${baseURL}${path}`);
    assert.equal(response.ok(), true, `${path} returned ${response.status()}`);
  }
  await context.close();
  console.log("Production verification passed: full-page round trip, assets, console, local Spline, responsive width and public routes.");
} finally {
  await browser.close();
}
