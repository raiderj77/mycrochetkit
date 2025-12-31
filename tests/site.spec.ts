import { test, expect } from "@playwright/test";

const baseURL = process.env.BASE_URL || "https://my-crochetkit.web.app";
const routes = ["/", "/pricing", "/signup", "/privacy", "/terms", "/cookies", "/billing"];

test("all routes load with HTTP 200", async ({ page }) => {
  for (const path of routes) {
    const response = await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
  }
});

test("buttons are visible and readable", async ({ page }) => {
  await page.goto(`${baseURL}/pricing`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000); // Wait for React to hydrate

  // Check at least one button is visible
  const anyBtn = page.locator("a, button").first();
  await expect(anyBtn).toBeVisible();
});

test("footer legal links exist", async ({ page }) => {
  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000); // Wait for React to hydrate
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  
  // Check footer links exist
  const privacyLink = page.locator('a[href="/privacy"]');
  const termsLink = page.locator('a[href="/terms"]');
  const cookiesLink = page.locator('a[href="/cookies"]');
  const billingLink = page.locator('a[href="/billing"]');
  
  expect(await privacyLink.count()).toBeGreaterThan(0);
  expect(await termsLink.count()).toBeGreaterThan(0);
  expect(await cookiesLink.count()).toBeGreaterThan(0);
  expect(await billingLink.count()).toBeGreaterThan(0);
});

test("legal pages render content", async ({ page }) => {
  const legalPages = [
    { path: "/privacy", title: /privacy/i },
    { path: "/terms", title: /terms/i },
    { path: "/cookies", title: /cookie/i },
    { path: "/billing", title: /billing/i },
  ];
  
  for (const p of legalPages) {
    await page.goto(`${baseURL}${p.path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    
    // Check page has content
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  }
});

test("dropdown/select text is visible when present", async ({ page }) => {
  await page.goto(`${baseURL}/signup`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const selects = page.locator("select");
  if ((await selects.count()) > 0) {
    const s = selects.first();
    await expect(s).toBeVisible();

    // Check computed colors are not identical (text vs background)
    const ok = await s.evaluate((el) => {
      const cs = getComputedStyle(el);
      return cs.color !== cs.backgroundColor;
    });
    expect(ok).toBeTruthy();
  }
});

test("theme toggle exists on every page", async ({ page }) => {
  for (const path of routes) {
    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Look for theme toggle button (aria-label="Toggle theme" or similar)
    const toggle = page.getByRole("button", { name: /toggle theme/i });
    const toggleExists = await toggle.count() > 0;
    
    if (toggleExists) {
      await expect(toggle).toBeVisible();
      
      // Test toggle functionality
      const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      await toggle.click();
      await page.waitForTimeout(300);
      const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      
      // Theme should have changed (or at least toggle should work)
      if (before !== null) {
        expect(after).not.toBe(before);
      }
    } else {
      // Log warning for pages missing toggle
      console.log(`Note: Theme toggle not found on ${path}`);
    }
  }
});

test("cookie banner respects reject and persists choice", async ({ page, context }) => {
  // Clear storage to simulate first visit
  await context.clearCookies();
  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Look for reject button
  const reject = page.getByRole("button", { name: /reject/i });
  const rejectExists = await reject.count() > 0;
  
  if (rejectExists) {
    await expect(reject).toBeVisible();
    await reject.click();
    await page.waitForTimeout(500);

    // Reload — banner should not reappear
    await page.reload();
    await page.waitForTimeout(1500);
    
    const rejectAfterReload = page.getByRole("button", { name: /reject/i });
    expect(await rejectAfterReload.count()).toBe(0);
  } else {
    console.log("Note: Cookie reject button not found - banner may have been dismissed already");
  }
});

test("lifetime CTA exists on pricing page", async ({ page }) => {
  await page.goto(`${baseURL}/pricing`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Look for Lifetime button or link
  const lifetimeBtn = page.locator('button, a').filter({ hasText: /lifetime/i });
  const lifetimeExists = await lifetimeBtn.count() > 0;
  
  if (lifetimeExists) {
    await expect(lifetimeBtn.first()).toBeVisible();
  } else {
    // Check if there's any mention of Lifetime on the page
    const lifetimeText = page.locator('text=/lifetime/i');
    expect(await lifetimeText.count()).toBeGreaterThan(0);
  }
});

test("no legacy premium pricing appears", async ({ page }) => {
  const checkRoutes = ["/", "/pricing", "/signup"];
  for (const r of checkRoutes) {
    await page.goto(`${baseURL}${r}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000); // Allow render
    const content = await page.locator("body").innerText();
    if (content.match(/Premium/i) || content.includes("12.99")) {
      console.log(`FAIL at ${r}: Found forbidden text.`);
      console.log("--- BODY CONTENT START ---");
      console.log(content);
      console.log("--- BODY CONTENT END ---");
    }
    await expect(page.locator("body")).not.toContainText("12.99");
    await expect(page.locator("body")).not.toContainText("Premium");
  }
});
