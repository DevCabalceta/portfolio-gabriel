import { chromium } from "playwright";
import fs from "node:fs/promises";

const baseURL = process.env.PERF_BASE_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send("Performance.enable");

await page.addInitScript(() => {
  window.__perf = { long: [], cls: 0, lcp: 0 };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__perf.long.push({ start: entry.startTime, duration: entry.duration });
    }
  }).observe({ type: "longtask", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__perf.cls += entry.value;
    }
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    window.__perf.lcp = entries.at(-1)?.startTime ?? window.__perf.lcp;
  }).observe({ type: "largest-contentful-paint", buffered: true });
});

const started = performance.now();
await page.goto(`${baseURL}/es`, { waitUntil: "networkidle" });
await page.waitForTimeout(7000);
const loadMs = Math.round(performance.now() - started);
const initialPerf = await page.evaluate(() => ({
  cls: window.__perf.cls,
  lcp: window.__perf.lcp,
  longTasks: window.__perf.long.length,
  scripts: (() => {
    const entries = performance.getEntriesByType("resource").filter((entry) => entry.initiatorType === "script");
    return {
      count: entries.length,
      transfer: entries.reduce((sum, entry) => sum + entry.transferSize, 0),
      decoded: entries.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
    };
  })(),
}));
const longBeforeScroll = initialPerf.longTasks;

const frame = await page.evaluate(async () => {
  const duration = 5000;
  const max = document.documentElement.scrollHeight - innerHeight;
  const frames = [];
  let previous = performance.now();
  const start = previous;
  await new Promise((resolve) => {
    const tick = (now) => {
      frames.push(now - previous);
      previous = now;
      const progress = Math.min((now - start) / duration, 1);
      scrollTo(0, max * progress);
      if (progress < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
  const sorted = frames.slice(1).sort((a, b) => a - b);
  return {
    count: sorted.length,
    avg: sorted.reduce((sum, value) => sum + value, 0) / Math.max(sorted.length, 1),
    p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
    over20: sorted.filter((value) => value > 20).length,
    over50: sorted.filter((value) => value > 50).length,
  };
});
await page.waitForTimeout(500);

const data = await page.evaluate(() => {
  const resources = performance.getEntriesByType("resource");
  const summarize = (entries) => ({
    count: entries.length,
    transfer: entries.reduce((sum, entry) => sum + entry.transferSize, 0),
    decoded: entries.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
  });
  const scripts = resources.filter((entry) => entry.initiatorType === "script");
  const images = resources.filter((entry) => entry.initiatorType === "img");
  const spline = resources.filter((entry) => /spline|\.wasm/i.test(entry.name));
  return {
    perf: window.__perf,
    resources: summarize(resources),
    scripts: summarize(scripts),
    images: summarize(images),
    spline: spline.map((entry) => ({ name: entry.name, transfer: entry.transferSize, decoded: entry.decodedBodySize, duration: entry.duration })),
    largestScripts: scripts.map((entry) => ({ name: entry.name.split("/").at(-1), transfer: entry.transferSize, decoded: entry.decodedBodySize })).sort((a, b) => b.decoded - a.decoded).slice(0, 10),
    dom: document.getElementsByTagName("*").length,
    height: document.documentElement.scrollHeight,
  };
});
const metrics = await cdp.send("Performance.getMetrics");
const wanted = new Set(["TaskDuration", "ScriptDuration", "LayoutDuration", "RecalcStyleDuration", "JSHeapUsedSize", "Nodes", "LayoutCount", "RecalcStyleCount"]);
const cdpMetrics = Object.fromEntries(metrics.metrics.filter((metric) => wanted.has(metric.name)).map((metric) => [metric.name, metric.value]));
const result = { loadMs, initialPerf, ...data, frame, cdp: cdpMetrics, newLongTasks: data.perf.long.length - longBeforeScroll };
await fs.writeFile("artifacts/perf-final.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
