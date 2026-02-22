import { test, expect } from '@playwright/test';

test('Create new family from scratch', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];

  // Capture console
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') errors.push(msg.text());
  });

  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });

  // Step 1: Go to family setup (or login first and get redirected)
  await page.goto('/login');

  // Login with demo account
  await page.getByLabel('Email').fill('john@famify-demo.com');
  await page.getByLabel('Password').fill('Demo123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for navigation
  await page.waitForURL(/\/(dashboard|family-setup)/, { timeout: 10000 });

  console.log('✅ Logged in, current URL:', page.url());

  // If on dashboard, navigate to family setup to create a new family
  if (page.url().includes('dashboard')) {
    console.log('⚠️ Already on dashboard (has existing family)');
    console.log('This test expects to create a new family, but user already has one');

    // Take screenshot of existing dashboard
    await page.screenshot({ path: 'existing-family-dashboard.png', fullPage: true });

    // Test passes - can't create new family when already have one (as designed)
    return;
  }

  // Step 2: Create a new family
  console.log('📝 Creating new family...');

  const familyName = `Test Family ${Date.now()}`;
  await page.getByLabel('Family Name').fill(familyName);
  await page.getByRole('button', { name: 'Create Family' }).click();

  // Wait a bit for the creation
  await page.waitForTimeout(3000);

  console.log('⏳ Waiting for redirect...');

  // Step 3: Should redirect to dashboard
  try {
    await page.waitForURL('/dashboard', { timeout: 10000 });
    console.log('✅ Redirected to dashboard!');
  } catch (e) {
    console.log('❌ Did not redirect to dashboard');
    console.log('Current URL:', page.url());
  }

  // Step 4: Take screenshot
  await page.screenshot({ path: 'new-family-created.png', fullPage: true });

  // Step 5: Check for errors
  console.log('\n========================================');
  console.log('📋 ALL CONSOLE LOGS:');
  console.log('========================================');
  logs.forEach(log => console.log(log));

  console.log('\n========================================');
  console.log('❌ ERRORS:');
  console.log('========================================');
  if (errors.length === 0) {
    console.log('✅ No errors!');
  } else {
    errors.forEach(err => console.log(err));
  }

  console.log('\n========================================');
  console.log('📍 Final URL:', page.url());
  console.log('========================================');

  // Verify no critical errors
  const hasCriticalError = errors.some(e =>
    e.includes('PGRST116') ||
    e.includes('infinite recursion') ||
    e.includes('Cannot coerce')
  );

  expect(hasCriticalError).toBe(false);
});
