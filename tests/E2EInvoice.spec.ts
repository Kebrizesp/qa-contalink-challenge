import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('E2E Facturas', () => {

  test('Ciclo completo de factura', async ({ page }) => {
    const accessPage = new AccessPage(page);

    // Login
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

    // Ir a la página de facturas
    await page.goto('https://candidates-qa.contalink.com/facturas');
    await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

    // Limpiar filtros si existen
    const limpiarBtn = page.locator('button:has-text("Limpiar Filtros")');
    if (await limpiarBtn.isVisible()) {
      await limpiarBtn.click();
      console.log('Filtros limpiados ✅');
    }

    // Crear nueva factura
    await page.click('button:has-text("Nueva Factura")');

    const now = new Date();
    const invoiceNumber = `NEW-${now.getTime()}`; // Número único
    const total = '120.00';
    const estadoInicial = 'Vigente';
    const isoDatetime = now.toISOString().slice(0, 16); // yyyy-mm-ddTHH:MM

    await page.fill('#invoiceNumber', invoiceNumber);
    await page.fill('#total', total);
    await page.fill('#invoiceDate', isoDatetime);
    await page.selectOption('#status', estadoInicial);
    await page.click('button:has-text("Crear Factura")');

    // Buscar la fila exacta por invoiceNumber
    const invoiceRow = page.locator(`table tbody tr:has-text("${invoiceNumber}")`);
    await expect(invoiceRow).toHaveCount(1);
    await expect(invoiceRow).toContainText(total);
    await expect(invoiceRow).toContainText(estadoInicial);
    console.log(`Factura creada ✅ (${invoiceNumber})`);

    // Editar la factura encontrada
    await invoiceRow.locator('button[title="Editar factura"]').click();

    const totalEditado = '200.00';
    const estadoEditado = 'Pagado';
    await page.fill('#total', totalEditado);
    await page.selectOption('#status', estadoEditado);
    await page.click('button:has-text("Actualizar Factura")');

    await expect(invoiceRow).toContainText(totalEditado);
    await expect(invoiceRow).toContainText(estadoEditado);
    console.log(`Factura editada ✅ (${invoiceNumber})`);

    // Registrar el dialog **antes** de eliminar
    page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    // Click en eliminar factura
    await invoiceRow.locator('button[title="Eliminar factura"]').click();

    // Esperar que la fila se elimine del DOM
    await invoiceRow.waitFor({ state: 'detached', timeout: 15000 });
    console.log(`Factura eliminada ✅ (${invoiceNumber})`);

    // Logout
    await page.click('button:has-text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
    console.log('Sesión cerrada ✅');
  });

});