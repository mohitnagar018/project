
import {test,expect} from '@playwright/test'

test.describe('Example.com Tests', () => {

  // Before each test in this describe block, navigate to the example domain
test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });

  // Scenario 1: Verify the page title contains "Example Domain"
  test('should have "Example Domain" in the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Example Domain/);
  });

  // Scenario 2: Check that the main heading <h1> is visible
  test('should display the main heading H1', async ({ page }) => {
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText('Example Domain'); // Optional: also verify its text content
  });

  // Scenario 3: Verify that the link "More information..." navigates to iana.org
  test('should navigate to iana.org when clicking "More information..." link', async ({ page }) => {
    const moreInfoLink = page.locator('a', { hasText: 'More information...' });
    await expect(moreInfoLink).toBeVisible(); // Ensure the link is visible before clicking
    await moreInfoLink.click();
    // The actual navigation target is https://www.iana.org/domains/example/
    await expect(page).toHaveURL('https://www.iana.org/domains/example/');
  });

  // Scenario 4: Take a screenshot of the homepage
  test('should take a screenshot of the example.com homepage', async ({ page }) => {
    // This will save a screenshot in the 'test-results' directory by default,
    // or you can specify a path relative to your project root.
    await page.screenshot({ path: 'screenshots/example_homepage.png', fullPage: true });
    // No direct assertion needed for the screenshot itself, but the test will fail
    // if there's an issue taking it (e.g., permissions).
  });

});

// Scenario 5: Add a simple example of filling a form (use a placeholder form URL)
test.describe('Placeholder Form Filling Example', () => {
  // IMPORTANT: This URL is a placeholder. For this test to run successfully,
  // replace 'https://www.your-actual-form-url.com' with a real form URL
  // and update the selectors accordingly.
  const PLACEHOLDER_FORM_URL = 'https://www.example.com/some-form'; // Placeholder URL

  // We will skip this test by default as it uses a non-existent URL and selectors.
  // Remove '.skip' to enable it after configuring with a real form.
  test.skip('should fill and submit a placeholder form', async ({ page }) => {
    console.log(`Navigating to placeholder form URL: ${PLACEHOLDER_FORM_URL}`);
    await page.goto(PLACEHOLDER_FORM_URL);

    // Replace 'input[name="firstName"]', 'input[name="email"]', and 'button[type="submit"]'
    // with actual selectors from your form.
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');

    // Simulate clicking a submit button
    await page.click('button[type="submit"]');

    // Add assertions to verify form submission success, e.g.:
    // await expect(page.locator('.success-message')).toBeVisible();
    // await expect(page).toHaveURL(/success-page/); // Check for navigation to a success page
    console.log('Placeholder form filled and submitted. Add your specific assertions for success.');
  });

  test('Note: The placeholder form filling test is skipped', async () => {
    console.log('--- Note for the Placeholder Form Filling Test ---');
    console.log('The "should fill and submit a placeholder form" test is currently skipped.');
    console.log('To run it, please replace `PLACEHOLDER_FORM_URL` with an actual form URL ');
    console.log('and update the form field selectors (e.g., `input[name="firstName"]`) ');
    console.log('to match the elements on your target form. Then remove `.skip` from the test.');
    console.log('--------------------------------------------------');
  });
});
