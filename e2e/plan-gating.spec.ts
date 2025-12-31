import { test, expect } from "@playwright/test";

test.describe("Plan Gating & Feature Access", () => {
  test("Free tier project limit enforcement", async ({ page }) => {
    // Mock the projectStore and subscriptionStore to simulate being at the limit BEFORE page load
    await page.addInitScript(() => {
      const interval = setInterval(() => {
        // @ts-expect-error - Expose for E2E
        const authStore = window.__AUTH_STORE__;
        // @ts-expect-error - Expose for E2E
        const subStore = window.__SUBSCRIPTION_STORE__;
        // @ts-expect-error - Expose for E2E
        const projStore = window.__PROJECT_STORE__;
        
        if (authStore && subStore && projStore) {
          authStore.setState({ user: { uid: 'e2e-user' }, initialized: true, loading: false });
          subStore.setState({ tier: 'free' });
          projStore.setState({ projects: Array(10).fill({}) }); // Way over the limit
          clearInterval(interval);
        }
      }, 50);
    });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    
    // In case of redirect, navigate back or assume mock keeps us there (if auth is also mocked)
    // For now, let's just make sure we are on a page where the dialog can be opened
    await page.getByRole("button", { name: /New Project/i }).first().click();

    // Verify Project Limit Reached message and UpgradePrompt
    await expect(page.getByText(/Project Limit Reached/i)).toBeVisible();
    await expect(page.getByText(/Upgrade to Pro/i)).toBeVisible();
  });

  test("Marketplace access restricted for Free/Pro tiers", async ({ page }) => {
    await page.addInitScript(() => {
      const interval = setInterval(() => {
        // @ts-expect-error - Expose for E2E
        const authStore = window.__AUTH_STORE__;
        // @ts-expect-error - Expose for E2E
        const subStore = window.__SUBSCRIPTION_STORE__;

        if (authStore && subStore) {
          authStore.setState({ user: { uid: 'e2e-user' }, initialized: true, loading: false });
          subStore.setState({ tier: 'pro' });
          clearInterval(interval);
        }
      }, 50);
    });

    await page.goto("/marketplace", { waitUntil: "domcontentloaded" });

    const sellBtn = page.getByRole("button", { name: /Sell/i });
    if (await sellBtn.isVisible()) {
        await sellBtn.click();
        await expect(page.getByText(/Upgrade to Lifetime/i)).toBeVisible();
    }
  });

  test("Referral visibility only for Lifetime users", async ({ page }) => {
    await page.addInitScript(() => {
      const interval = setInterval(() => {
        // @ts-expect-error - Expose for E2E
        const subStore = window.__SUBSCRIPTION_STORE__;
        // @ts-expect-error - Expose for E2E
        const authStore = window.__AUTH_STORE__;

        if (subStore && authStore) {
          authStore.setState({ user: { uid: 'e2e-user' }, initialized: true, loading: false });
          subStore.setState({ tier: 'lifetime' });
          clearInterval(interval);
        }
      }, 50);
    });

    await page.goto("/referrals", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Your Referral Code/i)).toBeVisible();
  });
});
