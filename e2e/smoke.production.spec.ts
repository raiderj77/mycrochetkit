import { test, expect } from "@playwright/test";

test.describe("Production Smoke Tests (Read-Only)", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we are hitting the production domain explicitly if not set in config
    await page.goto("/");
  });

  test("Home page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/My Crochet Kit/i);
    await expect(page.getByRole("heading", { name: /Stop losing count/i })).toBeVisible();
  });

  test("Pricing page is visible and shows free/pro tiers", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /Choose Your Plan/i })).toBeVisible();
    await expect(page.getByText(/Free/i)).toBeVisible();
    await expect(page.getByText(/Monthly/i)).toBeVisible();
  });

  test("Login page is reachable", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /Sign In/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
  });

  test("Legal pages are accessible", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /Terms of Service/i })).toBeVisible();
    
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /Privacy Policy/i })).toBeVisible();
  });

  test("No severe console errors on landing", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    
    await page.goto("/");
    // Give it a second to settle
    await page.waitForTimeout(1000);
    
    // Filter out common non-breaking errors
    const severeErrors = errors.filter(err => 
      !err.includes("analytics") && 
      !err.includes("extension") &&
      !err.includes("X-Frame-Options may only be set via an HTTP header")
    );
    expect(severeErrors).toHaveLength(0);
  });
});
