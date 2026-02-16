import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

const statuses = ['Todos los estados', 'Vigente', 'Pendiente', 'Pagado', 'Vencido', 'Cancelado'];

test.describe('Search by Status', () => {

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

  // Iterar sobre cada estado y crear un test
  for (const status of statuses) {
    test(`Search invoices by status: ${status}`, async ({ page }) => {
      const statusSelect = page.locator('#status');

      // Seleccionar el estado
      await statusSelect.selectOption({ label: status });

      // Click en Buscar
      await page.click('button:text("Buscar")');

      // Esperar a que la tabla se actualice
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible();

      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0); // Puede ser 0 si no hay facturas de ese estado

      // Step opcional en el que validamos contenido de cada fila
      if (status !== 'Todos los estados' && count > 0) {
        for (let i = 0; i < count; i++) {
          await expect(rows.nth(i)).toContainText(status);
        }
      }
    });
  }

});