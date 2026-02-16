import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Search by Date', () => {

  test.beforeEach(async ({ page }) => {
    const accessPage = new AccessPage(page);

    // Navegar e ingresar código de acceso
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

    // Esperar a que la tabla de facturas sea visible
    await page.goto('https://candidates-qa.contalink.com/facturas');
    await page.locator('table tbody').waitFor({ state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    // Cerrar sesión
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000); // Espera para que aparezca input de login
  });

  test('Search invoices by date range', async ({ page }) => {
    // Ajustar rango a los datos reales que están en la tabla
    const startDateStr = '2026-02-01';
    const endDateStr = '2026-02-15';

    // Llenar los inputs de fecha
    await page.fill('#startDate', startDateStr);
    await page.fill('#endDate', endDateStr);
    await page.click('button:text("Buscar")');

    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();

    const count = await rows.count();
    console.log(`Filas encontradas: ${count}`);
    expect(count).toBeGreaterThan(0);

    // Convertir strings de rango a objetos Date
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Iterar cada fila y validar fecha
    for (let i = 0; i < count; i++) {
      const rowText = await rows.nth(i).textContent();
      if (!rowText) continue;

      // Extraer la fecha de la fila
      // Puede ser DD/MM/YYYY o MM/DD/YYYY según cómo la UI la muestre
      const dateMatch = rowText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (!dateMatch) {
        console.warn('No se pudo parsear fecha de la fila:', rowText);
        continue;
      }

      // Parseo seguro: DD/MM/YYYY
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1; // JS months 0-11
      const year = parseInt(dateMatch[3], 10);

      const rowDate = new Date(year, month, day);

      // Comparación de fechas (Ignoramos horas)
      const isInRange = rowDate.getTime() >= startDate.getTime() &&
        rowDate.getTime() <= endDate.getTime();

      console.log(`Fila ${i + 1}: ${rowDate.toLocaleDateString()} In range? ${isInRange}`);
      expect(isInRange).toBeTruthy();
    }
  });

});