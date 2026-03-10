
import { test, expect } from '@playwright/test';

// Group tests specific to example.com homepage functionality
test.describe('Example.com Homepage Functionality', () => {

  // Navigate to example.com before each test in this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });

  // Scenario 1: Verify the page title contains "Example Domain"
  test('should have the title "Example Domain"', async ({ page }) => {
    await expect(page).toHaveTitle(/Example Domain/);
  });

  // Scenario 2: Check that the main heading <h1> is visible
  test('should display the main heading "Example Domain"', async ({ page }) => {
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText('Example Domain'); // Also verifies the text content
  });

  // Scenario 3: Verify that the link "More information..." navigates to iana.org
  test('should navigate to iana.org when "More information..." link is clicked', async ({ page }) => {
    const moreInfoLink = page.locator('a', { hasText: 'More information...' });

    await expect(moreInfoLink).toBeVisible(); // Ensure the link is present before clicking

    await moreInfoLink.click();

    // The link specifically navigates to 'https://www.iana.org/domains/example'
    await expect(page).toHaveURL('https://www.iana.org/domains/example');
  });

  // Scenario 4: Take a screenshot of the homepage
  test('should take a screenshot of the homepage', async ({ page }) => {
    // The screenshot will be saved in the project's root or 'test-results' folder by default.
    // You can specify a custom path, e.g., 'path: 'screenshots/example-homepage.png''
    await page.screenshot({ path: 'example-homepage.png', fullPage: true });

    // In a real test, you might add assertions here to verify the screenshot file exists
    // or compare it against a baseline snapshot for visual regression testing.
    // For this example, the action of taking the screenshot is sufficient.
  });

});

// Scenario 5: Add a simple example of filling a form
// This test is placed in a separate describe block as it uses a different URL for demonstration,
// fulfilling the "use a placeholder form URL" requirement because example.com does not have forms.
test.describe('Form Filling Demonstration', () => {

  test('should demonstrate filling a form using Google search as an example', async ({ page }) => {
    // Navigate to a page that contains a form (Google search page in this case).
    await page.goto('https://www.google.com');

    // Locate the search input field by its name attribute ('q' for query) and fill it with text.
    const searchInput = page.locator('[name="q"]');
    await searchInput.fill('Playwright automated testing');

    // Simulate pressing the 'Enter' key to submit the search form.
    await searchInput.press('Enter');

    // Verify that the URL reflects the search query after submission, indicating successful form submission.
    await expect(page).toHaveURL(/search\?q=Playwright\+automated\+testing/);

    // Optionally, verify that some expected element on the results page is visible.
    await expect(page.locator('#search')).toBeVisible();
  });

});
