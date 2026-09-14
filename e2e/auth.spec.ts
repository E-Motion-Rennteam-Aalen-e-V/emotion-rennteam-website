import { test, expect } from "@playwright/test";

const CMS_USER = process.env.E2E_CMS_USER ?? "admin";
const CMS_PASSWORD = process.env.E2E_CMS_PASSWORD ?? "password";

test.describe("CMS Authentication", () => {
  test("failed login shows error message", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#username", CMS_USER);
    await page.fill("#password", "wrong-password");
    await page.click('button[type="submit"]');
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("successful login redirects to admin dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#username", CMS_USER);
    await page.fill("#password", CMS_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/);
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });

  test("protected route redirects unauthenticated user to login with next param", async ({ page }) => {
    await page.goto("/admin/collections/news");
    await expect(page).toHaveURL(/\/admin\/login\?next=/);
  });

  test("login with next param redirects to intended page", async ({ page }) => {
    await page.goto("/admin/login?next=%2Fadmin%2Fcollections%2Fnews");
    await page.fill("#username", CMS_USER);
    await page.fill("#password", CMS_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/collections\/news/);
  });

  test("logout clears session and redirects to login", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#username", CMS_USER);
    await page.fill("#password", CMS_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/);

    await page.click('button:has-text("Abmelden"), button:has-text("Logout")');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
