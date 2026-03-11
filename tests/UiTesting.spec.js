import { test, expect } from '@playwright/test';

// Configuration object for UI validation (easily extensible)
const UI_CONFIG = {
  example: {
    url: 'https://example.com',
    selectors: {
      heading: 'h1',
      link: 'a[href="https://www.iana.org/domains/example"]'
    },
    expected: {
      text: 'Example Domain',
      font: /Helvetica|Arial|sans-serif/,
      fontSize: '44px'
    }
  },
  demoqa: {
    url: 'https://demoqa.com',
    selectors: {
      header: '.main-header',
      card: '.card-body h5',
      nav: '.left-pannel',
      navItems: '.group-header',
      footer: 'footer'
    },
    expected: {
      headerFont: /Open Sans|sans-serif/,
      headerFontSize: '38px',
      footerText: 'ToolsQA'
    }
  },
  theInternet: {
    url: 'https://the-internet.herokuapp.com',
    selectors: {
      heading: 'h1.heading',
      link: 'a[href="/abtest"]',
      navList: '#content ul li',
      footer: '#page-footer'
    },
    expected: {
      headingFont: /Georgia|serif/,
      headingFontSize: '38px',
      footerText: 'Powered by Elemental Selenium'
    }
  }
};

/**
 * Helper: Ensures element is not obscured by other elements (Overlap Check)
 */
async function ensureNotOverlapped(locator, name) {
  const isOverlapped = await locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    return elementAtPoint && !el.contains(elementAtPoint);
  });
  
  expect(isOverlapped, `UI element "${name}" should not be overlapped by another element`).toBeFalsy();
}

/**
 * Helper: Validates element is within the current viewport
 */
async function assertInViewport(locator, name) {
  const isInViewport = await locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
  
  expect(isInViewport, `UI element "${name}" should be visible in viewport`).toBeTruthy();
}

/**
 * Helper: Checks for visual changes on hover
 */
async function validateHover(locator, property = 'color') {
  const before = await locator.evaluate((el, prop) => getComputedStyle(el)[prop], property);
  await locator.hover();
  await locator.page().waitForTimeout(150); // Small wait for transitions
  const after = await locator.evaluate((el, prop) => getComputedStyle(el)[prop], property);
  expect(before, `Hover effect on "${property}" should change`).not.toBe(after);
}

/**
 * Helper: Validates vertical alignment and horizontal stacking
 */
async function assertVerticalAlignment(locators, name) {
  const count = await locators.count();
  expect(count, `At least 2 items required for alignment check in "${name}"`).toBeGreaterThanOrEqual(2);

  for (let i = 0; i < count - 1; i++) {
    const box1 = await locators.nth(i).boundingBox();
    const box2 = await locators.nth(i + 1).boundingBox();

    if (box1 && box2) {
      expect(Math.abs(box1.x - box2.x), `Items ${i} and ${i+1} in "${name}" should align horizontally`).toBeLessThan(5);
      expect(box1.y, `Item ${i} should be above Item ${i+1} in "${name}"`).toBeLessThan(box2.y);
    }
  }
}

test.describe('Advanced UI Validation Suite', () => {

  test('example.com - Full UI Audit', async ({ page }) => {
    const site = UI_CONFIG.example;

    await test.step('Navigation & Screenshot Comparison', async () => {
      await page.goto(site.url);
      // Basic Visual Regression (Requires local baseline or first run)
      // await expect(page).toHaveScreenshot('example-homepage.png');
    });

    await test.step('Validate Heading Layout', async () => {
      const heading = page.locator(site.selectors.heading);
      await expect(heading).toBeVisible();
      await assertInViewport(heading, 'Main Heading');
      await ensureNotOverlapped(heading, 'Main Heading');
      await expect(heading).toHaveText(site.expected.text);
      await expect(heading).toHaveCSS('font-size', site.expected.fontSize);
    });

    await test.step('Validate Interaction', async () => {
      const link = page.locator(site.selectors.link);
      await expect(link).toBeEnabled();
      await validateHover(link);
    });
  });

  test('demoqa.com - Visual Hierarchy Check', async ({ page }) => {
    const site = UI_CONFIG.demoqa;

    await test.step('Navigation', async () => {
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Header Consistency', async () => {
      const header = page.locator(site.selectors.header);
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('font-family', site.expected.headerFont);
      await expect(header).toHaveCSS('font-size', site.expected.headerFontSize);
    });

    await test.step('Card Layout Overlap Check', async () => {
      const elementsCard = page.locator(site.selectors.card).filter({ hasText: 'Elements' });
      await assertInViewport(elementsCard, 'Elements Card');
      await ensureNotOverlapped(elementsCard, 'Elements Card');
      await validateHover(elementsCard, 'backgroundColor');
    });

    await test.step('Navigation Menu Alignment', async () => {
      const items = page.locator(site.selectors.nav).locator(site.selectors.navItems);
      await assertVerticalAlignment(items, 'Navigation Menu Items');
    });
  });

  test('the-internet.herokuapp.com - List & Footer Check', async ({ page }) => {
    const site = UI_CONFIG.theInternet;

    await test.step('Navigation', async () => {
      await page.goto(site.url);
    });

    await test.step('Verify Stacking of Links', async () => {
      const navList = page.locator(site.selectors.navList);
      await assertVerticalAlignment(navList, 'Home Page Links');
      // Ensure the first few links are in view
      await assertInViewport(navList.first(), 'First Link');
    });

    await test.step('Footer Content Validation', async () => {
      const footer = page.locator(site.selectors.footer);
      await expect(footer).toBeVisible();
      await expect(footer).toContainText(site.expected.footerText);
    });
  });

});
