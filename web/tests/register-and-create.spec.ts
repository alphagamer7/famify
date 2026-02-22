import { test, expect } from '@playwright/test';

test('Register new account and create family', async ({ page }) => {
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

  console.log('========================================');
  console.log('🧪 TEST: Register New Account + Create Family');
  console.log('========================================\n');

  // Step 1: Go to register page
  console.log('📝 Step 1: Going to register page...');
  await page.goto('/register');
  await page.screenshot({ path: 'test-1-register-page.png' });

  // Step 2: Register with unique email
  const timestamp = Date.now();
  const email = `test-${timestamp}@example.com`;
  const password = 'TestPassword123!';
  const name = 'Test User';

  console.log(`📝 Step 2: Registering with email: ${email}`);

  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();

  console.log('⏳ Waiting for registration...');

  // Wait for redirect or error
  await page.waitForTimeout(5000);

  console.log('📍 Current URL after registration:', page.url());
  await page.screenshot({ path: 'test-2-after-register.png' });

  // Step 3: Should be on family-setup or dashboard
  if (page.url().includes('family-setup')) {
    console.log('✅ Step 3: On family setup page (correct!)');

    // Create a family
    const familyName = `Test Family ${timestamp}`;
    console.log(`📝 Step 4: Creating family: ${familyName}`);

    await page.getByLabel('Family Name').fill(familyName);
    await page.screenshot({ path: 'test-3-family-form-filled.png' });

    await page.getByRole('button', { name: 'Create Family' }).click();

    console.log('⏳ Waiting for family creation...');
    await page.waitForTimeout(5000);

    console.log('📍 Current URL after create:', page.url());
    await page.screenshot({ path: 'test-4-after-create.png', fullPage: true });

    // Check if we're on dashboard
    if (page.url().includes('dashboard')) {
      console.log('✅ Step 5: Successfully redirected to dashboard!');
    } else {
      console.log('⚠️ Step 5: Not on dashboard, current URL:', page.url());
    }
  } else {
    console.log('⚠️ Step 3: Not on family-setup page');
    console.log('Current URL:', page.url());
  }

  // Print all logs and errors
  console.log('\n========================================');
  console.log('📋 CONSOLE LOGS:');
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

  // Check for critical errors
  const hasPGError = errors.some(e => e.includes('PGRST116'));
  const hasRecursionError = errors.some(e => e.includes('infinite recursion'));
  const hasCoerceError = errors.some(e => e.includes('Cannot coerce'));

  console.log('\n========================================');
  console.log('🔍 ERROR ANALYSIS:');
  console.log('========================================');
  console.log('PGRST116 error (multiple rows):', hasPGError ? '❌ YES' : '✅ NO');
  console.log('Infinite recursion error:', hasRecursionError ? '❌ YES' : '✅ NO');
  console.log('Cannot coerce error:', hasCoerceError ? '❌ YES' : '✅ NO');

  expect(hasPGError).toBe(false);
  expect(hasRecursionError).toBe(false);
  expect(hasCoerceError).toBe(false);
});
