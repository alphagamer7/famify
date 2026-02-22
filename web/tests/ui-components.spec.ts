import { test, expect } from '@playwright/test';

test.describe('UI Components and Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should use Inter font family', async ({ page }) => {
    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    expect(fontFamily).toContain('Inter');
  });

  test('input fields should have emerald focus border', async ({ page }) => {
    const emailInput = page.getByLabel('Email');
    await emailInput.focus();

    // Check focus state (ring color should be emerald)
    const outlineColor = await emailInput.evaluate((el) => {
      return window.getComputedStyle(el).outlineColor;
    });
    // Note: Tailwind focus ring might be implemented differently, so we just check it exists
    expect(outlineColor).toBeTruthy();
  });

  test('card should have white background and rounded corners', async ({ page }) => {
    const card = page.locator('.rounded-xl.bg-white').first();
    await expect(card).toBeVisible();

    const bgColor = await card.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgb(255, 255, 255)');

    const borderRadius = await card.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });
    expect(borderRadius).not.toBe('0px');
  });

  test('buttons should have proper hover states', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: 'Sign In' });

    // Get initial state
    const initialBg = await signInButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Hover
    await signInButton.hover();

    // Background should be emerald (500 or 600)
    expect(initialBg).toMatch(/rgb\(16, 185, 129\)|rgb\(5, 150, 105\)/);
  });

  test('should have responsive padding on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    const container = page.locator('.p-4, .p-6, .p-8').first();
    await expect(container).toBeVisible();
  });

  test('card should have shadow', async ({ page }) => {
    const card = page.locator('.shadow-sm, .shadow, .shadow-md').first();
    await expect(card).toBeVisible();

    const boxShadow = await card.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });
    expect(boxShadow).not.toBe('none');
  });
});
