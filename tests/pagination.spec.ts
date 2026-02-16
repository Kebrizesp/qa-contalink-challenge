import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Single Pagination Test', () => {

  test('Go to invoices, paginate once, and logout', async ({ page }) => {
    const accessPage = new AccessPage(page);

    // Login
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

    // Ir a la página de facturas
    await page.goto('https://candidates-qa.contalink.com/facturas');

    // Esperar a que la tabla cargue
    await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

    // Hacer click en Next → si existe
    const nextBtn = page.locator('button:text("Next →")');
    if (await nextBtn.isVisible()) {
      await expect(nextBtn).toBeEnabled({ timeout: 10000 });
      await nextBtn.click();

      // Esperar a la tabla recargada
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      console.log('Paginación realizada ✅');
    } else {
      console.log('No hay siguiente página ❌');
    }

    // Logout
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
  });

});