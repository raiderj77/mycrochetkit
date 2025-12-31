import { test, expect } from "@playwright/test";

test.describe("Blog & SEO Automation Tests", () => {
  
  test("Blog Index is accessible and has correct title", async ({ page }) => {
    await page.goto("/blog/");
    await expect(page).toHaveTitle(/My Crochet Kit Blog - Expert Guides & Tips/i);
    await expect(page.locator("h1")).toContainText("Latest from the Hook");
  });

  test("Blog Index contains post cards (regression check)", async ({ page }) => {
    await page.goto("/blog/");
    // Even if empty, the list container should exist
    await expect(page.locator("#blog-posts-list")).toBeVisible();
  });

  test("Main App contains Sitemap link (SEO check)", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.content();
    expect(content).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');
  });

  test("Lead Magnet styles are loaded", async ({ page }) => {
    await page.goto("/blog/styles.css");
    const content = await page.content();
    expect(content).toContain('.lead-magnet');
    expect(content).toContain('.social-share-bar');
  });

  test('SEO Pages have only one footer and header', async ({ page }) => {
    const seoPages = [
      '/crochet-abbreviations',
      '/crochet-pricing-guide',
      '/yarn-weight-chart',
      '/hook-size-chart',
      '/terms'
    ];
    
    for (const path of seoPages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      const footers = page.locator('footer');
      await expect(footers, `Page ${path} should have exactly one footer`).toHaveCount(1);
      
      const headers = page.locator('header');
      await expect(headers, `Page ${path} should have exactly one header`).toHaveCount(1);
    }
  });
});
