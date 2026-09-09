import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL: "http://localhost:3000", browserName: "chromium", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", testMatch: ["portfolio.spec.ts", "projects.spec.ts"] },
    { name: "mobile-chromium", testMatch: ["mobile.spec.ts", "projects.spec.ts"], use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", testMatch: ["mobile.spec.ts", "projects.spec.ts"], use: { ...devices["iPhone 13"] } },
  ],
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
