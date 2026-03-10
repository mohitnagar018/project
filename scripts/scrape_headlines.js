import { chromium } from 'playwright';

(async () => {
  const envHeadless = process.env.HEADLESS;
  const headless = envHeadless === undefined ? true : !(envHeadless === 'false' || envHeadless === '0');
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });

  const screenshotDir = process.env.SCREENSHOT_DIR || 'screenshots';
  const urlSlug = new URL(page.url()).hostname.replace(/\./g, '_');
  const screenshotPath = `${screenshotDir}/${urlSlug}-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const headlines = await page.evaluate(() => {
    const seen = new Set();
    const results = [];
    const nodes = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]'));
    for (const el of nodes) {
      const text = el.innerText.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        results.push({ tag: el.tagName.toLowerCase(), text });
      }
    }
    return results;
  });

  console.log(JSON.stringify({ url: page.url(), headlines, screenshot: screenshotPath }, null, 2));

  await browser.close();
})();

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
