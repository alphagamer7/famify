import { test, expect } from '@playwright/test';

test('Simple login and page check', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // Login
  await page.goto('/login');
  await page.getByLabel('Email').fill('john@famify-demo.com');
  await page.getByLabel('Password').fill('Demo123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for redirect
  await page.waitForURL(/\/(dashboard|family-setup)/, { timeout: 10000 });

  const url = page.url();
  console.log('📍 Current URL:', url);
  console.log('❌ Page errors:', errors);

  // Take screenshot
  await page.screenshot({ path: 'simple-check.png', fullPage: true });

  // Get page HTML
  const bodyText = await page.locator('body').innerText();
  console.log('📄 Page content preview:', bodyText.substring(0, 500));

  // Check for specific errors
  const hasInfiniteRecursion = errors.some(e => e.includes('infinite recursion'));
  const hasRLSError = errors.some(e => e.includes('RLS') || e.includes('policy'));

  console.log('🔍 Has infinite recursion:', hasInfiniteRecursion);
  console.log('🔍 Has RLS error:', hasRLSError);

  expect(hasInfiniteRecursion).toBe(false);
  expect(hasRLSError).toBe(false);
});
