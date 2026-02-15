import { test, expect } from '@playwright/test';

test('Smoke - Homepage loads correctly', async ({ page }) => {
  await page.goto('https://candidates-qa.contalink.com/');

  // Esta linea valida  que la página carga correctamente
  await expect(page).toHaveURL(/contalink/);
});