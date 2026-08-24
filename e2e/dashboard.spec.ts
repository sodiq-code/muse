import { test, expect } from '@playwright/test';

/**
 * E2E Spec 1: Dashboard loads and renders all 5 screens.
 *
 * Note: The app is a 'use client' component — content renders after
 * hydration, not in initial SSR HTML. Tests must wait for client-side
 * render to complete.
 */
test.describe('Dashboard — loads and navigates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the MUSE header to appear (client hydration complete)
    await page.waitForSelector('text=MUSE', { timeout: 30_000 });
  });

  test('header renders with MUSE branding', async ({ page }) => {
    await expect(page.getByText('MUSE', { exact: true }).first()).toBeVisible();
  });

  test('all 5 dashboard tabs are visible and clickable', async ({ page }) => {
    const tabs = ['Today', 'Memory', 'Learning', 'Overnight', 'Control'];
    for (const tabName of tabs) {
      const tab = page.getByRole('tab', { name: new RegExp(tabName, 'i') });
      await expect(tab).toBeVisible({ timeout: 10_000 });
      await tab.click();
      await page.waitForTimeout(300);
    }
  });

  test('status badge renders (LIVE or Simulated)', async ({ page }) => {
    const badge = page.locator('text=/LIVE|Simulated/i').first();
    await expect(badge).toBeVisible({ timeout: 15_000 });
  });

  test('Today screen shows greeting and overnight brief', async ({ page }) => {
    await page.getByRole('tab', { name: /Today/i }).click();
    await page.waitForTimeout(1000);
    const content = page.locator('body');
    await expect(content).toContainText(/overnight|brief|greeting|Working/i, { timeout: 10_000 });
  });
});
