import { test, expect } from '@playwright/test';
import { AccessPage } from '../pages/AccessPage';

test.describe('Editar Factura', () => {

  test('Editar una factura y cerrar sesión', async ({ page }) => {
    const accessPage = new AccessPage(page);

    // Login
    await accessPage.navigate();
    await accessPage.enterAccessCode('UXTY789@!!1');
    await accessPage.submit();

    // Ir a la página de facturas
    await page.goto('https://candidates-qa.contalink.com/facturas');

    // Esperar a que la tabla cargue
    await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

    // Click en el botón "Editar factura" de la primera fila
    const editBtn = page.locator('button[title="Editar factura"]').first();
    await editBtn.click();

    // Esperar a que aparezca el formulario
    const form = page.locator('h3:text("Editar Factura")');
    await expect(form).toBeVisible();

    // Rellenar campos del formulario
    await page.fill('#invoiceNumber', 'FAC-EDIT-2026212211534');
    await page.fill('#total', '100.00');

    // Ajustar fecha a la actual (ejemplo)
    const now = new Date();
    const iso = now.toISOString().slice(0,16); // "YYYY-MM-DDTHH:MM"
    await page.fill('#invoiceDate', iso);

    // Seleccionar estado
    await page.selectOption('#status', { label: 'Vencido' });

    // Click en "Actualizar Factura"
    await page.click('button:has-text("Actualizar Factura")');

    // Esperar tabla visible de nuevo
    await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

    console.log('Factura actualizada ✅');

    // Cerrar sesión
    await page.click('button:text("Cerrar Sesión")');
    await page.waitForTimeout(1000);
  });

});