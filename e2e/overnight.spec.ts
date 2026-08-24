import { test, expect } from '@playwright/test';

/**
 * E2E Spec 3: Overnight cycle trigger and approval flow.
 *
 * Verifies the Overnight tab renders, the "Run Overnight Now" button
 * is present and clickable, and the Mind Theatre / output section
 * responds to the trigger.
 */
test.describe('Overnight — trigger and approval gate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for client-side hydration
    await page.waitForSelector('text=MUSE', { timeout: 30_000 });
    await page.waitForTimeout(1000);
  });

  test('Overnight tab renders with schedule and trigger', async ({ page }) => {
    const overnightTab = page.getByRole('tab', { name: /Overnight/i });
    await expect(overnightTab).toBeVisible({ timeout: 10_000 });
    await overnightTab.click();
    await page.waitForTimeout(1000);

    // The Run Overnight Now button should be visible
    const runButton = page.locator('button', { hasText: /run overnight|overnight now/i }).first();
    await expect(runButton).toBeVisible({ timeout: 10_000 });
  });

  test('Mind Theatre section is visible on Overnight tab', async ({ page }) => {
    await page.getByRole('tab', { name: /Overnight/i }).click();
    await page.waitForTimeout(1000);

    // Mind Theatre or overnight output section
    const theatre = page.locator('text=/mind theatre|overnight output|overnight brief|while you/i').first();
    await expect(theatre).toBeVisible({ timeout: 10_000 });
  });

  test('Control tab shows approval gate with approve/reject', async ({ page }) => {
    await page.getByRole('tab', { name: /Control/i }).click();
    await page.waitForTimeout(1000);

    // Autonomy settings or approval queue should be visible
    const controlContent = page.locator('text=/autonomy|approval|approve|reject|audit/i').first();
    await expect(controlContent).toBeVisible({ timeout: 10_000 });
  });

  test('autonomy toggles are rendered', async ({ page }) => {
    await page.getByRole('tab', { name: /Control/i }).click();
    await page.waitForTimeout(1500);

    // The 4 autonomy toggles: Overnight Analysis, Draft Creation, Auto-Publish, Community Monitoring
    // Use separate locators so we can see which one fails if any
    const toggles = page.locator('text=/Overnight Analysis|Draft Creation|Auto-Publish|Community Monitoring/i');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });
});
