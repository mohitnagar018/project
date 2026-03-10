import { chromium } from 'playwright';

async function run() {
  const email = process.env.JOTFORM_EMAIL;
  const password = process.env.JOTFORM_PASSWORD;
  if (!email || !password) {
    console.error('Missing JOTFORM_EMAIL or JOTFORM_PASSWORD environment variables');
    process.exit(2);
  }

  const envHeadless = process.env.HEADLESS;
  const headless = envHeadless === undefined ? true : !(envHeadless === 'false' || envHeadless === '0');

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  try {
    // Go to the templates page first, then navigate to login
    const templateUrl = 'https://www.jotform.com/form-templates/demo-test-sample';
    console.log('navigating to template page', templateUrl);
    await page.goto(templateUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Click the login/signup link if present
    try {
      const loginLink = await page.$('a:has-text("Log In")');
      if (loginLink) {
        await loginLink.click();
      } else {
        // fallback: go directly to login page
        await page.goto('https://www.jotform.com/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
    } catch (e) {
      await page.goto('https://www.jotform.com/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    // Wait for common login input selectors
    const emailSelectors = ['#username', '#email', 'input[name="username"]', 'input[name="email"]'];
    const passwordSelectors = ['#password', 'input[name="password"]'];

    let emailSel = null;
    for (const s of emailSelectors) {
      try {
        await page.waitForSelector(s, { timeout: 3000 });
        emailSel = s;
        break;
      } catch (e) {}
    }

    if (!emailSel) {
      console.error('Email input not found on login page');
      const shot = `screenshots/jotform-login-missing-email-${Date.now()}.png`;
      await page.screenshot({ path: shot, fullPage: true }).catch(()=>{});
      console.log('wrote', shot);
      await browser.close();
      process.exit(3);
    }

    let passSel = null;
    for (const s of passwordSelectors) {
      try {
        await page.waitForSelector(s, { timeout: 1000 });
        passSel = s;
        break;
      } catch (e) {}
    }

    if (!passSel) {
      // try a generic input[type=password]
      try {
        await page.waitForSelector('input[type="password"]', { timeout: 2000 });
        passSel = 'input[type="password"]';
      } catch (e) {
        console.error('Password input not found on login page');
        const shot = `screenshots/jotform-login-missing-password-${Date.now()}.png`;
        await page.screenshot({ path: shot, fullPage: true }).catch(()=>{});
        console.log('wrote', shot);
        await browser.close();
        process.exit(4);
      }
    }

    console.log('filling credentials');
    await page.fill(emailSel, email);
    await page.fill(passSel, password);

    // Click submit
    try {
      await Promise.all([
        page.waitForNavigation({ timeout: 15000 }),
        page.click('button:has-text("Log In"), button:has-text("Sign In"), button[type=submit]')
      ]);
    } catch (e) {
      // maybe single-page app update; try click and wait for profile link
      try {
        await page.click('button:has-text("Log In"), button:has-text("Sign In"), button[type=submit]');
      } catch (err) {}
    }

    // Determine success: look for My Forms or /myforms in URL
    const currentUrl = page.url();
    let success = false;
    if (currentUrl.includes('/myforms') || currentUrl.includes('dashboard')) success = true;
    try {
      const profile = await page.$('a:has-text("My Forms"), a[href*="/myforms"], button[aria-label*="account"]');
      if (profile) success = true;
    } catch (e) {}

    const shot = `screenshots/jotform-login-result-${Date.now()}.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(()=>{});

    const message = success ? 'Login appears successful' : 'Login may have failed';
    console.log(JSON.stringify({ url: currentUrl, message, screenshot: shot }, null, 2));

    await browser.close();
    process.exit(success ? 0 : 5);
  } catch (err) {
    console.error('unexpected error', err);
    const shot = `screenshots/jotform-login-error-${Date.now()}.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(()=>{});
    console.log('wrote', shot);
    await browser.close();
    process.exit(6);
  }
}

run();
