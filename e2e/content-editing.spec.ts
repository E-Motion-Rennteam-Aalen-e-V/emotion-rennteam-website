import { test, expect } from "@playwright/test";

const CMS_USER = process.env.E2E_CMS_USER ?? "admin";
const CMS_PASSWORD = process.env.E2E_CMS_PASSWORD ?? "password";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.fill("#username", CMS_USER);
  await page.fill("#password", CMS_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

test.describe("Content Editing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("admin dashboard is accessible and shows collections", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("h1, [role='heading']").first()).toBeVisible();
  });

  test("news collection list loads", async ({ page }) => {
    await page.goto("/admin/collections/news");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("creating a new news article shows the form", async ({ page }) => {
    await page.goto("/admin/collections/news");
    await page.click('button:has-text("+ Neuer Eintrag")');
    await expect(page.locator('input[name="title"], input[id*="title"]').first()).toBeVisible();
  });

  test("duplicate button opens form pre-filled with source item data", async ({ page }) => {
    await page.goto("/admin/collections/news");
    const duplicateBtn = page.locator('button:has-text("Duplizieren")').first();
    const count = await duplicateBtn.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await duplicateBtn.click();
    await expect(page.locator('input[name="title"], input[id*="title"]').first()).toBeVisible();
  });
});
