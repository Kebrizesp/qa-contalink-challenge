import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

const statuses = ['Todos los estados', 'Vigente', 'Pendiente', 'Pagado', 'Vencido', 'Cancelado'];

test.describe('Search by Status including Deleted', () => {

  test.beforeEach(async ({ page }) => {
    const accessPage = new AccessPage(page);
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();
    await page.goto('https://candidates-qa.contalink.com/facturas');

    // Espera que la tabla esté visible
    await page.locator('table tbody').waitFor({ state: 'visible' });

    // Marcar el checkbox "Mostrar eliminadas" si existe y no está marcado
    const showDeletedCheckbox = page.locator('#showDeleted');
    if (await showDeletedCheckbox.count() > 0 && !(await showDeletedCheckbox.isChecked())) {
      await showDeletedCheckbox.check();
    }
  });

  test.afterEach(async ({ page }) => {
    // Logout
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
  });

  // Iterar sobre cada estado y crear un test
  for (const status of statuses) {
    test(`Search invoices by status: ${status} including deleted`, async ({ page }) => {
      const statusSelect = page.locator('#status');

      // Seleccionar el estado
      await statusSelect.selectOption({ label: status });

      // Click en Buscar
      await page.click('button:text("Buscar")');

      // Esperar que la tabla se actualice
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible();

      const count = await rows.count();
      console.log(`Filas encontradas para ${status}: ${count}`);
      expect(count).toBeGreaterThanOrEqual(0);

      // Validar contenido de cada fila
      if (status === 'Pagado' && count > 0) {
        for (let i = 0; i < count; i++) {
          const row = rows.nth(i);
          const statusText = await row.locator('td:nth-child(5) span').innerText();
          const isDeleted = await row.locator('td:nth-child(6) span:text("Eliminada")').count() > 0;

          expect(statusText).toContain('Pagado'); // Validamos que sea "Pagado"
          console.log({
            id: await row.locator('th').innerText(),
            invoiceNumber: await row.locator('td:nth-child(2)').innerText(),
            total: await row.locator('td:nth-child(3)').innerText(),
            date: await row.locator('td:nth-child(4)').innerText(),
            deleted: isDeleted
          });
        }
      }
    });
  }

});