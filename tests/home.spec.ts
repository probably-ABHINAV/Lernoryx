import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  // Check for some text that is definitely on the homepage
  await expect(page.getByText(/The Operating System for/i)).toBeVisible();
});
