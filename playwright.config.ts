import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH,
      },
    },
  ],
  webServer: process.env.CI
    ? {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          CMS_ADMIN_USER: process.env.E2E_CMS_USER ?? "admin",
          CMS_ADMIN_PASSWORD_HASH: process.env.E2E_CMS_PASSWORD_HASH ?? "",
          CMS_SESSION_SECRET: process.env.E2E_CMS_SECRET ?? "e2e-test-secret-32-chars-minimum!",
          GITHUB_TOKEN: "",
          GITHUB_OWNER: "",
          GITHUB_REPO: "",
          GITHUB_BRANCH: "",
        },
      }
    : undefined,
});
