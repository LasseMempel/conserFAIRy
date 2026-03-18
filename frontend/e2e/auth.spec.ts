import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

const testEmail = `e2e-${uuidv4()}@example.com`;
const testPassword = 'password123';
const testFirstName = 'End';
const testLastName = 'Toend';
const testInitials = 'ET';

// Helper: fill the login form and submit
async function fillLoginForm(page: import('@playwright/test').Page, email: string, password: string) {
  await expect(page.locator('input[aria-label="E-Mail"]')).toBeVisible();
  await page.locator('input[aria-label="E-Mail"]').fill(email);
  await page.locator('input[aria-label="Passwort"]').first().fill(password);
  await page.getByRole('button', { name: 'Einloggen' }).click();
}

// ---------------------------------------------------------------------------
// Registration flow
// ---------------------------------------------------------------------------

test('can navigate to register page from login', async ({ page }) => {
  await page.goto('/#/login');
  await expect(page.locator('input[aria-label="E-Mail"]')).toBeVisible();

  // Click the register link at the bottom of the login card
  await page.getByRole('link', { name: 'Registrieren' }).click();
  await expect(page).toHaveURL('/#/register');
});

test('can register a new account', async ({ page }) => {
  await page.goto('/#/register');

  // Wait for register form to be ready
  await expect(page.locator('input[aria-label="Vorname"]')).toBeVisible();

  // Fill in the registration form
  await page.locator('input[aria-label="Vorname"]').fill(testFirstName);
  await page.locator('input[aria-label="Nachname"]').fill(testLastName);
  await page.locator('input[aria-label="E-Mail"]').fill(testEmail);
  await page.locator('input[aria-label="Passwort"]').first().fill(testPassword);
  await page.locator('input[aria-label="Passwort bestätigen"]').fill(testPassword);
  await page.getByLabel('Ich akzeptiere die Nutzungsbedingungen').click();

  // Submit
  await page.getByRole('button', { name: 'Registrieren' }).click();

  // After successful registration, redirected to login page
  await expect(page).toHaveURL('/#/login');
});

// ---------------------------------------------------------------------------
// Login flow
// ---------------------------------------------------------------------------

test('can log in with valid credentials', async ({ page }) => {
  await page.goto('/#/login');
  await fillLoginForm(page, testEmail, testPassword);

  // Should redirect to /
  await expect(page).toHaveURL('/#/');

  // User initials should now appear in the header
  await expect(page.getByRole('button', { name: testInitials })).toBeVisible();
});

test('redirects to original page after login', async ({ page }) => {
  // Simulate being redirected to login from /voc
  await page.goto('/#/login?redirect=%2Fvoc');
  await fillLoginForm(page, testEmail, testPassword);

  // Should redirect to /voc, not /
  await expect(page).toHaveURL('/#/voc');
});

// ---------------------------------------------------------------------------
// Authenticated state
// ---------------------------------------------------------------------------

test('shows full name in user dropdown after login', async ({ page }) => {
  await page.goto('/#/login');
  await fillLoginForm(page, testEmail, testPassword);
  await expect(page).toHaveURL('/#/');

  // Open the user dropdown
  await page.getByRole('button', { name: testInitials }).click();

  // Full name should be visible in the dropdown
  await expect(page.getByText(`${testFirstName} ${testLastName}`)).toBeVisible();
});

// ---------------------------------------------------------------------------
// Logout flow
// ---------------------------------------------------------------------------

test('can log out', async ({ page }) => {
  await page.goto('/#/login');
  await fillLoginForm(page, testEmail, testPassword);
  await expect(page).toHaveURL('/#/');

  // Open dropdown and click logout
  await page.getByRole('button', { name: testInitials }).click();
  await page.getByRole('button', { name: 'Ausloggen' }).click();

  // Login link should be visible again
  await expect(page.getByRole('link', { name: 'Einloggen' })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Login failure
// ---------------------------------------------------------------------------

test('shows error on invalid credentials', async ({ page }) => {
  await page.goto('/#/login');
  await fillLoginForm(page, testEmail, 'wrongpassword');

  // Should stay on /#/login
  await expect(page).toHaveURL('/#/login');

  // Error notification should appear
  await expect(page.getByText('Invalid email or password')).toBeVisible();
});