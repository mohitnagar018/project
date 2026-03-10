import { test } from '@playwright/test';

test('navigate to google and take screenshot', async ({ page }) => {
  await page.goto('https://www.google.com');
  await page.screenshot({ path: 'google_screenshot.png' });
});
