import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL, browserName: "chromium", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", testMatch: ["portfolio.spec.ts", "projects.spec.ts", "process.spec.ts", "services.spec.ts", "faq.spec.ts", "contact.spec.ts", "footer.spec.ts"] },
    { name: "mobile-chromium", testMatch: ["mobile.spec.ts", "projects.spec.ts", "process.spec.ts", "services.spec.ts", "faq.spec.ts", "contact.spec.ts", "footer.spec.ts"], use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", testMatch: ["mobile.spec.ts", "projects.spec.ts", "process.spec.ts", "services.spec.ts", "faq.spec.ts", "contact.spec.ts", "footer.spec.ts"], use: { ...devices["iPhone 13"] } },
  ],
  webServer: { command: "npm run dev", url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
