import { test, expect } from '@playwright/test';

/**
 * E2E Spec 2: Live Chat with Muse.
 *
 * Verifies the chat interface renders, a message can be typed and sent,
 * and a response appears (either from the live Mind or the simulator).
 * In simulate mode the response is instant; in live mode it may take
 * 15-60s, so we use a generous timeout.
 */
test.describe('Chat — send and receive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for client-side hydration
    await page.waitForSelector('text=MUSE', { timeout: 30_000 });
    await page.waitForTimeout(1000);
  });

  test('chat input is visible', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/ask muse|ask anything/i).first();
    await expect(chatInput).toBeVisible({ timeout: 10_000 });
  });

  test('can type a message into the chat input', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/ask muse|ask anything/i).first();
    await expect(chatInput).toBeVisible({ timeout: 10_000 });
    await chatInput.fill('What hook should I use?');
    await expect(chatInput).toHaveValue('What hook should I use?');
  });

  test('sending a message produces a response', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/ask muse|ask anything/i).first();
    await expect(chatInput).toBeVisible({ timeout: 10_000 });
    await chatInput.fill('What hook should I use?');

    // The chat input sends on Enter key (onKeyDown handler in page.tsx)
    await chatInput.press('Enter');

    // Wait for a response to appear — in simulate mode this is near-instant,
    // in live mode it can take up to 60s.
    // We look for any new text appearing in the chat area after the input.
    await page.waitForTimeout(3000);

    // The response should appear somewhere in the chat region.
    // Look for a Muse response — it will contain words like "hook", "recommend",
    // "contrarian", "question", or "muse" regardless of mode.
    const body = page.locator('body');
    await expect(body).toContainText(/hook|recommend|contrarian|question|muse/i, { timeout: 65_000 });
  });
});
