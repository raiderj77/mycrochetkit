import { test, expect } from "@playwright/test";

test.describe("Dashboard smoke (requires auth if gated)", () => {
  test("dashboard loads or redirects to auth", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    // Either we see the dashboard content...
    const dashboardHeader = page.getByRole("heading", { name: /Welcome Back/i });
    // ...or we get redirected to a login/start page.
    // Adjust the selectors below if your auth route differs.
    const startFreeLink = page.getByRole("link", { name: /Start Free/i });
    const loginLike = page.getByRole("textbox").first(); // generic fallback

    await expect(dashboardHeader.or(startFreeLink).or(loginLike)).toBeVisible();
  });

  test("sidebar has core nav items (if authenticated)", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    // If not logged in, skip assertions that require auth
    const isAuthed = await page.getByRole("heading", { name: /Welcome Back/i }).isVisible().catch(() => false);
    test.skip(!isAuthed, "Not authenticated; skipping authed dashboard nav checks.");

    await expect(page.getByRole("link", { name: /Home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Projects/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Patterns/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Calculator/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Finished/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Community/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Marketplace/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Glossary/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Blog/i })).toBeVisible();

    await expect(page.getByRole("button", { name: /New Project/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Start New Project/i })).toBeVisible();
  });
});
