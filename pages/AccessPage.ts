import { Page, expect } from '@playwright/test';

export class AccessPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://candidates-qa.contalink.com/');
    }

    async enterAccessCode(code: string) {
        await this.page.fill('input[placeholder="Código de acceso"]', code);
    }

    async submit() {
        await this.page.click('text=Validar Código');
    }

    async expectInvalidCodeError() {
        const errorBox = this.page.locator('div.bg-red-100');
        await expect(errorBox).toContainText(/no es válido/i);
    }
}