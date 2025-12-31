import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageStatePath = path.join(__dirname, ".auth", "user.json");

setup("authenticate with email/password", async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("TEST_EMAIL or TEST_PASSWORD env vars are missing");
  }

  // Start at login
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  // Email
  await page.getByLabel(/email/i).fill(email);

  // Password
  await page.getByLabel(/password/i).fill(password);

  // Submit
  await page.getByRole("button", { name: /^sign in$/i }).click();

  // Expect dashboard
  await expect(page).toHaveURL(/dashboard/i, { timeout: 15_000 });
  await expect(page.getByText(/Welcome Back/i)).toBeVisible();

  // Ensure directory exists
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  // Save auth state
  await page.context().storageState({ path: storageStatePath });

  console.log("✅ Playwright auth state saved:", storageStatePath);
});
