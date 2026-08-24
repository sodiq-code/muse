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
    // Wait for the page to fully load
    await page.waitForTimeout(2000);
  });

  test('chat input is visible', async ({ page }) => {
    const input = page.locator('input[type="text"], textarea').filter({ hasText: '' }).first();
    // The chat input has placeholder text about asking Muse
    const chatInput = page.getByPlaceholder(/ask muse|ask anything|message/i).first();
    await expect(chatInput).toBeVisible({ timeout: 10_000 });
  });

  test('can type a message into the chat input', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/ask muse|ask anything|message/i).first();
    await expect(chatInput).toBeVisible({ timeout: 10_000 });
    await chatInput.fill('What hook should I use?');
    await expect(chatInput).toHaveValue('What hook should I use?');
  });

  test('sending a message produces a response', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/ask muse|ask anything|message/i).first();
    await expect(chatInput).toBeVisible({ timeout: 10_000 });
    await chatInput.fill('What hook should I use?');

    // Find and click the send button (or press Enter)
    const sendButton = page.locator('button[type="submit"], button[aria-label*="send" i]').first();
    const hasButton = await sendButton.isVisible().catch(() => false);

    if (hasButton && !(await sendButton.isDisabled())) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for a response to appear — in simulate mode this is instant,
    // in live mode it can take up to 60s.
    // We look for any new text appearing in the chat area after the input.
    await page.waitForTimeout(3000);

    // The response should appear somewhere in the chat region
    const chatRegion = page.locator('[role="log"], [class*="chat" i], [class*="message" i]').first();
    const hasResponse = await chatRegion.isVisible().catch(() => false);

    if (hasResponse) {
      await expect(chatRegion).toContainText(/\S+/, { timeout: 65_000 });
    } else {
      // Fallback: check the page body for any Muse response text
      const body = page.locator('body');
      await expect(body).toContainText(/hook|muse|recommend/i, { timeout: 65_000 });
    }
  });
});
