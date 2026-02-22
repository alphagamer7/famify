import { test } from '@playwright/test';

test('Check console output after login', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];

  // Capture all console messages
  page.on('console', msg => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });

  // Login
  await page.goto('/login');
  await page.getByLabel('Email').fill('john@famify-demo.com');
  await page.getByLabel('Password').fill('Demo123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for redirect and data to load
  await page.waitForURL(/\/(dashboard|family-setup)/, { timeout: 10000 });
  await page.waitForTimeout(3000); // Give time for data fetching

  // Print all console output
  console.log('\n========================================');
  console.log('📋 CONSOLE OUTPUT AFTER LOGIN:');
  console.log('========================================\n');

  logs.forEach(log => console.log(log));

  console.log('\n========================================');
  console.log('❌ ERRORS DETECTED:');
  console.log('========================================\n');

  if (errors.length === 0) {
    console.log('✅ No errors detected');
  } else {
    errors.forEach(err => console.log(err));
  }

  console.log('\n========================================');
  console.log('📍 Current URL:', page.url());
  console.log('========================================\n');

  // Take screenshot
  await page.screenshot({ path: 'console-check.png', fullPage: true });
});
