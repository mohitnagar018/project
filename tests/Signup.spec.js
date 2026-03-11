import { test, expect } from '@playwright/test';

test.describe('Automation Practice Form Tests', () => {

  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    gender: 'Male',
    mobileNumber: '9876543210',
    address: 'New Delhi'
  };

  // Function to fill the form
  async function fillAllFields(page, data) {

    await page.locator('#firstName').fill(data.firstName);
    await page.locator('#lastName').fill(data.lastName);
    await page.locator('#userEmail').fill(data.email);

    // FIXED Gender selector
    await page.getByText(data.gender, { exact: true }).click();

    await page.locator('#userNumber').fill(data.mobileNumber);

    await page.locator('#subjectsInput').fill('Maths');
    await page.keyboard.press('Enter');

    await page.getByText('Sports').click();

    await page.locator('#currentAddress').fill(data.address);

  }

  // Test 1 & 2
  test('Verify successful form submission and confirmation modal', async ({ page }) => {

    await page.goto('https://demoqa.com/automation-practice-form');

    await fillAllFields(page, testData);

    await page.locator('#submit').click();

    // Verify modal appears
    await expect(page.locator('.modal-title')).toHaveText('Thanks for submitting the form');

  });

  // Test 3
  test('Validate behavior when required fields are empty', async ({ page }) => {

    await page.goto('https://demoqa.com/automation-practice-form');

    await page.locator('#submit').click();

    // Check HTML5 validation
    const isValid = await page.locator('#firstName')
      .evaluate(el => el.checkValidity());

    expect(isValid).toBeFalsy();

  });

  // Test 4
  test('Test invalid email format validation', async ({ page }) => {

    await page.goto('https://demoqa.com/automation-practice-form');

    await page.locator('#firstName').fill(testData.firstName);
    await page.locator('#lastName').fill(testData.lastName);

    await page.locator('#userEmail').fill('invalid-email');

    await page.getByText('Male', { exact: true }).click();

    await page.locator('#userNumber').fill(testData.mobileNumber);

    await page.locator('#submit').click();

    const isEmailValid = await page.locator('#userEmail')
      .evaluate(el => el.checkValidity());

    expect(isEmailValid).toBeFalsy();

  });

});