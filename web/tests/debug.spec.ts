import { test, expect } from '@playwright/test';

test('debug page load', async ({ page }) => {
  const errors: string[] = [];
  const consoleLogs: string[] = [];

  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });

  await page.goto('/login', { waitUntil: 'networkidle' });

  // Wait a bit for React to render
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

  // Get page content
  const content = await page.content();
  console.log('Page title:', await page.title());
  console.log('Root div content:', await page.locator('#root').innerHTML());
  console.log('All errors:', errors);
  console.log('Console logs:', consoleLogs.slice(0, 10));

  // List all visible elements
  const allElements = await page.locator('body *').count();
  console.log('Total elements:', allElements);
});
