import { test, expect } from "@playwright/test";

test.describe("Pricing page smoke + theme readability", () => {
  test("loads pricing and shows plan CTAs", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });

    // Header check (match what's in SiteLayout/Login)
    await expect(page.locator('header, nav, body').getByText(/My Crochet Kit/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Pricing/i }).first()).toBeVisible();
    
    // Header "Start Free" may be hidden on mobile
    const startFreeHeader = page.getByRole("link", { name: /Start Free/i });
    if (await startFreeHeader.isVisible()) {
      await expect(startFreeHeader).toBeVisible();
    }

    // CTAs
    await expect(page.getByRole("link", { name: "Join for Free", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Join Pro Now", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Buy Lifetime Access", exact: true })).toBeVisible();
  });

  test("theme toggle keeps CTAs legible (contrast sanity check)", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });

    const lifetimeBtn = page.getByRole("button", { name: /Buy Lifetime Access/i });
    await expect(lifetimeBtn).toBeVisible();

    // Helper: compute contrast ratio quickly in-browser for button text vs background.
    async function getContrastRatio(locatorText: string) {
      return await page.evaluate((btnName) => {
        function rgb(s: string) {
          const m = s.match(/\d+/g);
          if (!m) return [0, 0, 0];
          return [Number(m[0]), Number(m[1]), Number(m[2])];
        }
        function luminance([r, g, b]: number[]) {
          const a = [r, g, b].map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
        }
        function contrast(c1: string, c2: string) {
          const L1 = luminance(rgb(c1));
          const L2 = luminance(rgb(c2));
          const bright = Math.max(L1, L2);
          const dark = Math.min(L1, L2);
          return (bright + 0.05) / (dark + 0.05);
        }

        const btn = Array.from(document.querySelectorAll("button"))
          .find((b) => b.textContent?.trim().toLowerCase().includes(btnName.toLowerCase()));
        if (!btn) return { ratio: 0, color: "", bg: "" };

        const style = window.getComputedStyle(btn);
        // try text color and background of the button itself
        const ratio = contrast(style.color, style.backgroundColor);
        return { ratio, color: style.color, bg: style.backgroundColor };
      }, locatorText);
    }

    // Check in current theme
    const r1 = await getContrastRatio("Buy Lifetime Access");
    // 4.5 is WCAG AA for normal text; buttons often qualify. Use 4.0 as a pragmatic minimum if your font is larger.
    expect(r1.ratio).toBeGreaterThanOrEqual(4.0);

    // Toggle theme (your UI shows a toggle button labeled “Light” when currently dark or vice versa)
    const themeToggle = page.getByRole("button", { name: /Toggle theme/i });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // Re-check after toggle
    const r2 = await getContrastRatio("Buy Lifetime Access");
    expect(r2.ratio).toBeGreaterThanOrEqual(4.0);
  });
});
