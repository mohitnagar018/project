import { chromium } from 'playwright';

async function run() {
  const envHeadless = process.env.HEADLESS;
  const envDevtools = process.env.DEVTOOLS;
  const headless = envHeadless === undefined ? true : !(envHeadless === 'false' || envHeadless === '0');
  const devtools = envDevtools === 'true';
  const browser = await chromium.launch({
    headless,
    devtools: devtools || false,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();

  const url = 'https://demoqa.com/text-box';
  console.log('navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => {
    console.warn('goto warning', e && e.message);
  });

  console.log('waiting for form inputs');
  // Wait more robustly for the userName input or any visible text input
  try {
    await page.waitForSelector('#userName', { timeout: 15000 });
  } catch (err) {
    // fallback: wait for any input
    console.warn('#userName not found, waiting for input[type=text]');
    await page.waitForSelector('input[type=text], input[type=email], textarea', { timeout: 15000 });
  }

  const data = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentAddress: '123 Main St, Springfield',
    permanentAddress: '456 Elm St, Springfield'
  };

  await page.fill('#userName', data.name);
  await page.fill('#userEmail', data.email);
  await page.fill('#currentAddress', data.currentAddress);
  await page.fill('#permanentAddress', data.permanentAddress);

  try {
    await Promise.all([
      page.waitForSelector('#output', { timeout: 10000 }),
      page.click('#submit')
    ]);
  } catch (err) {
    console.error('submit/wait failed:', err && err.message);
    const errShot = `screenshots/fill_demoqa-error-${Date.now()}.png`;
    await page.screenshot({ path: errShot, fullPage: true }).catch(()=>{});
    console.log('wrote', errShot);
  }

  const outputText = await page.$eval('#output', el => el.innerText.trim());

  // Try to extract individual lines if present
  const nameLine = await page.$eval('#name', el => el.innerText.trim()).catch(() => null);
  const emailLine = await page.$eval('#email', el => el.innerText.trim()).catch(() => null);
  const currentAddrLine = await page.$eval('#output #currentAddress', el => el.innerText.trim()).catch(() => null);
  const permanentAddrLine = await page.$eval('#output #permanentAddress', el => el.innerText.trim()).catch(() => null);

  const result = { url: page.url(), outputText, fields: { nameLine, emailLine, currentAddrLine, permanentAddrLine } };

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
