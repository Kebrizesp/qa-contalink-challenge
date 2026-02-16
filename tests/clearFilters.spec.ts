import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Search by Invoice Number with Clean Filters', () => {

  test.beforeEach(async ({ page }) => {
    const accessPage = new AccessPage(page);
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();
    await page.goto('https://candidates-qa.contalink.com/facturas');

    // Espera a que la tabla esté visible
    await page.locator('table tbody').waitFor({ state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    // Logout
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
  });

  test('Search invoice by number with pre and post filter cleanup', async ({ page }) => {
    // Limpiar filtros antes de buscar
    const clearFiltersButton = page.locator('button:text("Limpiar Filtros")');
    if (await clearFiltersButton.count() > 0) {
      await clearFiltersButton.click();
    }

    // Numero de Factura
    const invoiceInput = page.locator('#invoiceName');
    await invoiceInput.fill('2026212211534');

    // Click en Buscar
    await page.click('button:text("Buscar")');

    // Esperar a que la tabla se actualice
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();

    const count = await rows.count();
    expect(count).toBeGreaterThan(0); // validar que haya filas
    await expect(rows.first()).toContainText('2026212211534');

    // Limpiar filtros después de la búsqueda
    if (await clearFiltersButton.count() > 0) {
      await clearFiltersButton.click();
    }

    // Opcional: esperar que la tabla se refresque a estado inicial
    await page.waitForTimeout(500);
  });

});