import { test, expect } from '@playwright/test';

/**
 * E2E Spec 1: Dashboard loads and renders all 5 screens.
 *
 * Verifies the app boots, the header renders, the LIVE/Simulated badge
 * appears, and all 5 dashboard tabs are navigable.
 */
test.describe('Dashboard — loads and navigates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header renders with MUSE branding', async ({ page }) => {
    await expect(page.locator('h1, [role="heading"]').first()).toContainText(/MUSE/i, { timeout: 15_000 });
  });

  test('all 5 dashboard tabs are visible and clickable', async ({ page }) => {
    const tabs = ['Today', 'Memory', 'Learning', 'Overnight', 'Control'];
    for (const tabName of tabs) {
      const tab = page.getByRole('tab', { name: new RegExp(tabName, 'i') });
      await expect(tab).toBeVisible({ timeout: 10_000 });
      await tab.click();
      await page.waitForTimeout(500);
    }
  });

  test('status badge renders (LIVE or Simulated)', async ({ page }) => {
    // The header shows either a green "LIVE" or amber "Simulated" badge
    const badge = page.locator('text=/LIVE|Simulated/i').first();
    await expect(badge).toBeVisible({ timeout: 15_000 });
  });

  test('Today screen shows greeting and overnight brief', async ({ page }) => {
    await page.getByRole('tab', { name: /Today/i }).click();
    await page.waitForTimeout(1000);
    // Greeting or overnight brief section should appear
    const content = page.locator('body');
    await expect(content).toContainText(/overnight|brief|greeting|Working/i, { timeout: 10_000 });
  });
});
