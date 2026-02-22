import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display Famify branding', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Famify' })).toBeVisible();
    await expect(page.getByText('Manage your family, together')).toBeVisible();
  });

  test('should display Create Account heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  test('should have all required input fields', async ({ page }) => {
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
  });

  test('should have Create Account button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Create Account' });
    await expect(button).toBeVisible();

    // Check emerald background
    const bgColor = await button.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgb(16, 185, 129)');
  });

  test('should have Sign In link', async ({ page }) => {
    await expect(page.getByText('Already have an account?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should navigate to login page when Sign In is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should fill in all form fields', async ({ page }) => {
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');

    await expect(page.getByLabel('Name')).toHaveValue('Test User');
    await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
  });
});
