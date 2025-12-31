import { test, expect } from "@playwright/test";

test("no severe console errors on key pages", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  const pages = ["/", "/pricing", "/dashboard"];
  for (const p of pages) {
    await page.goto(p, { waitUntil: "domcontentloaded" });
  }

  // Allow known benign errors by filtering if needed.
  // Sometimes external scripts like Stripe or Analytics throw non-critical CSP or framing errors.
  const filteredErrors = errors.filter(e => 
    !e.includes('Stripe') && 
    !e.includes('Firebase') && 
    !e.includes('chrome-extension') &&
    !e.includes('favicon.ico')
  );

  expect(filteredErrors, `Console/page errors found:\n${filteredErrors.join("\n")}`).toHaveLength(0);
});
