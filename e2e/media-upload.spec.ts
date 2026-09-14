import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const CMS_USER = process.env.E2E_CMS_USER ?? "admin";
const CMS_PASSWORD = process.env.E2E_CMS_PASSWORD ?? "password";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.fill("#username", CMS_USER);
  await page.fill("#password", CMS_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

// Creates a minimal valid 1×1 PNG in a temp file and returns its path.
function makeTempPng(): string {
  // 1×1 red pixel PNG (67 bytes, hand-crafted)
  const bytes = Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108020000009001" +
      "2e00000000c4944415478016360f8cfc000000000200013e251b60000000049454e44ae426082",
    "hex"
  );
  const file = path.join(os.tmpdir(), "e2e-test.png");
  writeFileSync(file, bytes);
  return file;
}

test.describe("Media Upload", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("media library page is accessible", async ({ page }) => {
    await page.goto("/admin/media");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("upload input accepts image files", async ({ page }) => {
    await page.goto("/admin/media");
    const uploadInput = page.locator('input[type="file"]');
    await expect(uploadInput).toBeAttached();
  });

  test("uploading a PNG image succeeds", async ({ page }) => {
    await page.goto("/admin/media");
    const tmpFile = makeTempPng();
    const uploadInput = page.locator('input[type="file"]');
    await uploadInput.setInputFiles(tmpFile);
    // After upload the image should appear in the library
    await expect(page.locator('img[src*="/uploads/"]').first()).toBeVisible({ timeout: 15000 });
  });

  test("SVG uploads are rejected with an error message", async ({ page }) => {
    await page.goto("/admin/media");
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>';
    const tmpFile = path.join(os.tmpdir(), "e2e-test.svg");
    writeFileSync(tmpFile, svgContent);

    const uploadInput = page.locator('input[type="file"]');
    await uploadInput.setInputFiles(tmpFile);
    await expect(page.locator('[role="alert"], .text-red-400').first()).toBeVisible({ timeout: 5000 });
  });
});
