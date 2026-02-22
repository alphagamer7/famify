import { test, expect } from '@playwright/test';

test.describe('Full Famify Flow Test', () => {
  test('Complete user journey - Login → Family Setup → Dashboard', async ({ page }) => {
    // Step 1: Go to login page
    await page.goto('/login');
    console.log('✅ Step 1: Navigated to login page');

    // Step 2: Login with demo credentials
    await page.getByLabel('Email').fill('john@famify-demo.com');
    await page.getByLabel('Password').fill('Demo123!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    console.log('✅ Step 2: Submitted login form');

    // Step 3: Wait for redirect (either family-setup or dashboard)
    try {
      await page.waitForURL(/\/(dashboard|family-setup)/, { timeout: 10000 });
      const url = page.url();
      console.log('✅ Step 3: Redirected to:', url);

      // Step 4: If on family-setup, create family
      if (url.includes('family-setup')) {
        console.log('✅ Step 4: On family setup page, creating family...');

        // Look for create family input
        const familyNameInput = page.getByLabel(/family name/i).first();
        await familyNameInput.fill('The Test Family');

        // Click create button
        await page.getByRole('button', { name: /create family/i }).first().click();

        // Wait for redirect to dashboard
        await page.waitForURL('/dashboard', { timeout: 10000 });
        console.log('✅ Step 4: Family created, redirected to dashboard');
      } else {
        console.log('✅ Step 4: Already on dashboard (family exists)');
      }

      // Step 5: Verify dashboard loads
      await page.waitForTimeout(2000);
      await expect(page.locator('text=/dashboard|planner|feed/i').first()).toBeVisible();
      console.log('✅ Step 5: Dashboard loaded successfully');

      // Take final screenshot
      await page.screenshot({ path: 'full-flow-success.png', fullPage: true });
      console.log('✅ Test Complete! Screenshot saved.');

    } catch (error) {
      console.error('❌ Error during flow:', error);
      await page.screenshot({ path: 'full-flow-error.png', fullPage: true });

      // Get any console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      console.log('Console errors:', errors);
      throw error;
    }
  });

  test('Verify Supabase connection', async ({ page }) => {
    const errors: string[] = [];
    const logs: string[] = [];

    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(`Page error: ${error.message}`);
    });

    await page.goto('/login');
    await page.waitForTimeout(2000);

    // Check for RLS or Supabase errors
    const hasRLSError = errors.some(e => e.includes('infinite recursion') || e.includes('RLS'));
    const hasSupabaseError = errors.some(e => e.includes('supabase') || e.includes('JWT'));

    console.log('All errors:', errors);
    console.log('Has RLS error:', hasRLSError);
    console.log('Has Supabase error:', hasSupabaseError);

    expect(hasRLSError).toBe(false);
    expect(hasSupabaseError).toBe(false);
  });
});
