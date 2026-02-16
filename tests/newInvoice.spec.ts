import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Crear Nueva Factura', () => {

  test('Crear factura y cerrar sesión', async ({ page }) => {
    const accessPage = new AccessPage(page);

    // Login
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

    // Ir a la página de facturas
    await page.goto('https://candidates-qa.contalink.com/facturas');
    await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

    // Click en "Nueva Factura"
    await page.click('button:has-text("Nueva Factura")');

    // Llenar el formulario
    const now = new Date();
    const isoDatetime = now.toISOString().slice(0, 16); // yyyy-mm-ddTHH:MM

    await page.fill('#invoiceNumber', 'NEW-2026212211534');   // Número de factura
    await page.fill('#total', '120.00');           // Total
    await page.fill('#invoiceDate', isoDatetime);  // Fecha
    await page.selectOption('#status', 'Vigente'); // Estado

    // Enviar el formulario
    await page.click('button:has-text("Crear Factura")');

    // Validar que la tabla tenga la nueva factura
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toContainText('NEW-2026212211534');

    console.log('Factura creada ✅');

    // Cerrar sesión
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
  });

});