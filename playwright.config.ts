import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "docker-compose up --build --wait",
    url: "http://localhost:3000/healthz",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    stdout: "pipe",
    stderr: "pipe",
  },
  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "playwright/junit.xml" }],
  ],
});