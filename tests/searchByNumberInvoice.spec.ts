import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Search by Invoice Number', () => {

  test.beforeEach(async ({ page }) => {
    const accessPage = new AccessPage(page);
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();
    await page.goto('https://candidates-qa.contalink.com/facturas');

    // Espera a que la tabla esté lista
    await page.locator('table tbody').waitFor({ state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    // Logout simple sin esperar URL ni input inexistente
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000); // espera breve
  });

  test('Search invoice by number', async ({ page }) => {
    // Selector correcto del input
    const invoiceInput = page.locator('#invoiceName'); 
    await invoiceInput.fill('2026212211534');

    await page.click('button:text("Buscar")');

    // Esperar a que la tabla se actualice
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();

    const count = await rows.count();
    expect(count).toBeGreaterThan(0); // Validamos que existan Filas
    await expect(rows.first()).toContainText('2026212211534');
  });

});