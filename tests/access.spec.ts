import { test } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Access Code Validation', () => {

  test('Should allow access with valid code', async ({ page }) => {
    const accessPage = new AccessPage(page);

    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

  });

  test('Should show error with invalid code', async ({ page }) => {
    const accessPage = new AccessPage(page);

    await accessPage.navigate();
    await accessPage.enterAccessCode('INVALID123');
    await accessPage.submit();
    await accessPage.expectInvalidCodeError();
  });

});