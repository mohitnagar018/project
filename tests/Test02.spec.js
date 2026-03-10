
import { test, expect } from '@playwright/test';

// Define constants for reusability and clarity
const BASE_URL = 'https://eddemo.edvantalabs.com';
const LOGIN_URL = `${BASE_URL}/login/index.php`;
const USERNAME = 'shabrej.ahmad';
const PASSWORD = 'Edvanta#21$';
const EXPECTED_DASHBOARD_PATH = '/my/'; // Part of the URL after successful login
const COURSE_ID = '2';
const EXPECTED_COURSE_URL = `${BASE_URL}/course/view.php?id=${COURSE_ID}`;
const SEARCH_TERM = 'connect +';

test.describe('Moodle Course Navigation and Link Verification', () => {

    test('Full flow: Login, Search, Navigate to Course, and Verify Links', async ({ page }) => {

        // 1. Navigate to the given URL.
        await test.step('Navigate to the login page', async () => {
            await page.goto(LOGIN_URL);
            await expect(page).toHaveURL(LOGIN_URL);
            console.log(`Step 1: Navigated to ${LOGIN_URL}`);
        });

        // 2. Log in using provided credentials.
        await test.step('Perform user login', async () => {
            await page.getByLabel('Username').fill(USERNAME);
            await page.getByLabel('Password').fill(PASSWORD);
            await page.getByRole('button', { name: 'Log in' }).click();
            console.log('Step 2: Entered credentials and clicked Login.');
        });

        // 3. Verify that the login is successful (e.g., by checking dashboard URL).
        await test.step('Verify successful login', async () => {
            // Wait for navigation and check if the URL contains the expected dashboard path.
            await page.waitForURL(`**${EXPECTED_DASHBOARD_PATH}`);
            await expect(page).toHaveURL(new RegExp(EXPECTED_DASHBOARD_PATH));
            console.log(`Step 3: Login successful. Current URL: ${page.url()}`);
        });

        // 4. In "My learning" (dashboard), locate the search box, type "connect +", and press Enter.
        await test.step('Search for "connect +"', async () => {
            // Assuming the search box is present on the dashboard/my learning page.
            const searchInput = page.getByPlaceholder('Search courses');
            await expect(searchInput).toBeVisible();
            await searchInput.fill(SEARCH_TERM);
            await searchInput.press('Enter');
            // Wait for the page to process the search, e.g., by waiting for network to be idle or an element to appear.
            await page.waitForLoadState('domcontentloaded');
            console.log(`Step 4: Searched for "${SEARCH_TERM}".`);
        });

        // 5. Verify that "Connect +" appears in the search results.
        await test.step('Verify "Connect +" text in search results', async () => {
            const connectPlusText = page.getByText(SEARCH_TERM, { exact: true });
            await expect(connectPlusText).toBeVisible();
            console.log(`Step 5: Verified that "${SEARCH_TERM}" text is visible in search results.`);
        });

        // 6. Verify that the Connect + course card is visible.
        await test.step('Verify "Connect +" course card visibility', async () => {
            // A common locator for a course card in Moodle would be a div with class 'coursebox' containing the text.
            const connectPlusCourseCard = page.locator(`.coursebox:has-text("${SEARCH_TERM}")`).first();
            await expect(connectPlusCourseCard).toBeVisible();
            console.log(`Step 6: Verified "${SEARCH_TERM}" course card is visible.`);
        });

        // 7. Click the Connect + course card and verify navigation to the correct page.
        await test.step('Click "Connect +" course card and verify navigation', async () => {
            // Click on the link within the course card that leads to the course page.
            // This assumes the course title itself is a clickable link.
            const courseLink = page.locator(`.coursebox:has-text("${SEARCH_TERM}")`).getByRole('link', { name: SEARCH_TERM }).first();
            await expect(courseLink).toBeVisible(); // Ensure the clickable link is visible
            await courseLink.click();

            // Wait for navigation to the specific course URL.
            await page.waitForURL(EXPECTED_COURSE_URL);
            await expect(page).toHaveURL(EXPECTED_COURSE_URL);
            console.log(`Step 7: Clicked "${SEARCH_TERM}" course card and navigated to ${page.url()}`);
        });

        // 8. Collect all links on the course page and verify that they are clickable.
        await test.step('Collect and verify clickability of links on the course page', async () => {
            await page.waitForLoadState('domcontentloaded'); // Ensure all DOM elements are loaded

            const allLinks = await page.locator('a').all();
            console.log(`Step 8: Found ${allLinks.length} potential links on the course page.`);

            let verifiedLinksCount = 0;
            for (const link of allLinks) {
                const href = await link.getAttribute('href');
                const linkText = await link.textContent();

                // Skip links that are not intended for standard navigation (e.g., mailto, tel, javascript:void(0))
                if (href && (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:'))) {
                    continue;
                }

                // Verify that the link element itself has an href and is visible/enabled
                if (href) {
                    await expect(link, `Link "${linkText || href}" should have a non-empty href`).toHaveAttribute('href', /.+/);
                    await expect(link, `Link "${linkText || href}" should be visible`).toBeVisible();
                    await expect(link, `Link "${linkText || href}" should be enabled`).toBeEnabled();
                    verifiedLinksCount++;
                } else {
                    // console.log(`Skipping <a> tag without href: ${linkText}`);
                }
            }
            console.log(`Step 8: Successfully verified clickability (visibility and enabled state with href) for ${verifiedLinksCount} links.`);
        });
    });
});
