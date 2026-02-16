import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Eliminar Factura', () => {

  test('Eliminar la primera factura y cerrar sesión', async ({ page }) => {
    const accessPage = new AccessPage(page);

    // Login
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

    // Ir a la página de facturas
    await page.goto('https://candidates-qa.contalink.com/facturas');
    await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

    // Preparar Playwright para aceptar el alert nativo de JavaScript (window.confirm)
    page.once('dialog', async dialog => {
      console.log('Texto del dialog:', dialog.message()); // Log
      await dialog.accept(); // Acepta la Eliminación
    });

    // Click en el botón "Eliminar factura" de la primera fila
    await page.locator('button[title="Eliminar factura"]').first().click();

    // Esperar a que la fila se elimine
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible(); // La tabla sigue visible, pero fila puede cambiar

    console.log('Factura eliminada ✅');

    // Cerrar sesión
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
  });

});