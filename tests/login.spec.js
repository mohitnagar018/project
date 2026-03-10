import { test, expect } from '@playwright/test';

test('Login to practice test automation', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  // Fill in the username and password
  await page.fill('#username', 'student');
  await page.fill('#password', 'Password123');

  // Click the submit button
  await page.click('#submit');

  // Verify successful login
  await expect(page).toHaveURL('https://practicetestautomation.com/logged-in-successfully/');
  await expect(page.locator('.post-title')).toHaveText('Logged In Successfully');

  // Take a screenshot of the success page
  await page.screenshot({ path: 'screenshots/login_success.png' });
});
