import { test, expect } from '@playwright/test';

test('verify production deployment', async ({ page }) => {
  // Go to production URL
  await page.goto('https://famify-ten.vercel.app');
  
  // Check page loads
  await expect(page).toHaveTitle(/Famify/);
  console.log('✅ Page loaded with title');
  
  // Check logo is visible
  const logo = page.locator('img[alt="Famify Logo"]').first();
  await expect(logo).toBeVisible();
  console.log('✅ Logo is visible');
  
  // Try demo login
  await page.click('text=Try Demo');
  await page.waitForTimeout(2000);
  
  // Check if we're on dashboard or see error
  const url = page.url();
  console.log('Current URL after demo:', url);
  
  // Take screenshot
  await page.screenshot({ path: 'web/production-check.png', fullPage: true });
  
  // Check for errors in console
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  if (errors.length > 0) {
    console.log('❌ Console errors:', errors);
  } else {
    console.log('✅ No console errors');
  }
});

test('test manual login', async ({ page }) => {
  await page.goto('https://famify-ten.vercel.app');
  
  // Fill in credentials
  await page.fill('input[type="email"]', 'john@famify-demo.com');
  await page.fill('input[type="password"]', 'Demo123!');
  
  // Listen for network responses
  page.on('response', response => {
    if (response.url().includes('supabase')) {
      console.log('Supabase response:', response.status(), response.url());
    }
  });
  
  // Click login
  await page.click('button:has-text("Sign in")');
  
  await page.waitForTimeout(3000);
  
  // Check current URL
  console.log('After login URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'web/login-attempt.png', fullPage: true });
});
