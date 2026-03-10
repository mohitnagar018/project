
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    const USERNAME = 'shabrej.ahmad';
    const PASSWORD = 'Edvanta#21$';
    const LOGIN_PAGE_URL = 'https://eddemo.edvantalabs.com/login/index.php';
    // Regular expression to match the dashboard URL (e.g., /my/ or /my/index.php)
    const DASHBOARD_URL_REGEX = /\/my\//;
    // Regular expression to match the login page URL after logout
    const LOGGED_OUT_URL_REGEX = /\/login\/index\.php/;

    test('should allow a user to log in successfully and verify dashboard access', async ({ page }) => {
        // 1. Navigate to the given URL
        await page.goto(LOGIN_PAGE_URL);
        await expect(page).toHaveURL(LOGIN_PAGE_URL); // Ensure we are on the login page

        // 2. Log in using provided credentials
        // Assuming username and password input fields have IDs 'username' and 'password'
        await page.fill('#username', USERNAME);
        await page.fill('#password', PASSWORD);
        // Assuming the login button has the ID 'loginbtn'
        await page.click('#loginbtn');

        // 3. Verify that the login is successful by checking the dashboard URL
        // Wait for the URL to change to the expected dashboard pattern
        await page.waitForURL(DASHBOARD_URL_REGEX);
        await expect(page).toHaveURL(DASHBOARD_URL_REGEX);
        // Optionally, verify a common element on the dashboard, e.g., a heading with "Dashboard"
        
    });

    test('should allow a logged-in user to log out successfully', async ({ page }) => {
        // Pre-requisite: Log in first to perform the logout action
        await page.goto(LOGIN_PAGE_URL);
        await page.fill('#username', USERNAME);
        await page.fill('#password', PASSWORD);
        await page.click('#loginbtn');

        // Verify pre-requisite login was successful
        await page.waitForURL(DASHBOARD_URL_REGEX);
        await expect(page).toHaveURL(DASHBOARD_URL_REGEX);
       


        // 4. Click on the dropdown icon on the profile and then click on logout
        // Assuming the profile dropdown toggle has the ID 'user-menu-toggle' (common in Moodle)
        await page.click('#user-menu-toggle');
        // Wait for the dropdown menu to become visible and locate the 'Log out' link
        await page.waitForSelector('text="Log out"', { state: 'visible' });
        await page.click('text="Log out"'); // Click the logout link

        // 5. Check whether the logout is successfully done or not
        // Verify by checking if the URL has returned to the login page or a similar logged-out state
        await page.waitForURL(LOGGED_OUT_URL_REGEX);
        await expect(page).toHaveURL(LOGGED_OUT_URL_REGEX);
        // Optionally, verify that the username input field is visible again, confirming a logged-out state
        await expect(page.locator('#username')).toBeVisible();
    });
});
