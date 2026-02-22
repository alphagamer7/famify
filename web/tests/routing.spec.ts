import { test, expect } from '@playwright/test';

test.describe('Routing and Navigation', () => {
  test('should redirect root path to dashboard (which redirects to login)', async ({ page }) => {
    await page.goto('/');
    // Since we're not authenticated, should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should access login page directly', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should access register page directly', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  test('should show emerald gradient background on auth pages', async ({ page }) => {
    await page.goto('/login');
    const container = page.locator('body > div').first();
    const bgStyle = await container.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    expect(bgStyle).toContain('gradient');
  });
});
