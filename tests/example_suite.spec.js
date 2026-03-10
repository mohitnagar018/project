// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Example Domain Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('https://example.com');
  });

  test('should have the correct title', async ({ page }) => {
    // Expect the title to be "Example Domain".
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test('should have a "Learn more" link', async ({ page }) => {
    // Check for the "Learn more" link.
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    await expect(learnMoreLink).toBeVisible();
    await expect(learnMoreLink).toHaveAttribute('href', 'https://iana.org/domains/example');
  });

  test('should navigate to IANA when clicking "Learn more"', async ({ page }) => {
    // Click the link and wait for navigation.
    await page.getByRole('link', { name: 'Learn more' }).click();
    
    // Expect the URL to contain "iana.org".
    await expect(page).toHaveURL(/.*iana.org.*/);
  });

  test('should capture a screenshot of the home page', async ({ page }) => {
    // Capture a screenshot.
    await page.screenshot({ path: 'screenshots/example_suite_home.png' });
  });

});
