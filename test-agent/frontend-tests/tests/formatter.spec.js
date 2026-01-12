const { test, expect } = require('@playwright/test');

test.describe('Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=KonvertR', { timeout: 10000 });
  });

  test('@smoke JSON Formatter - Beautify minified JSON', async ({ page }) => {
    await page.click('text=Beautify');
    await page.waitForTimeout(500);
    
    // Formatters is default active, JSON Formatter section should be visible
    await page.waitForSelector('text=JSON Formatter', { timeout: 5000 });
    
    const minifiedJson = '{"name":"John","age":30,"city":"New York"}';
    await page.fill('textarea[placeholder*="JSON"]', minifiedJson);
    await page.click('button:has-text("Format")');
    
    await page.waitForTimeout(2000);
    const output = await page.textContent('textarea[readonly]');
    
    expect(output).toBeTruthy();
    expect(output).toContain('\n'); // Should be formatted
    expect(output).toContain('  '); // Should have indentation
  });

  test('YAML Formatter', async ({ page }) => {
    await page.click('text=Beautify');
    await page.waitForTimeout(500);
    
    // Formatters is default active, YAML Formatter section should be visible
    await page.waitForSelector('text=YAML Formatter', { timeout: 5000 });
    
    const yamlInput = 'name: John\nage: 30\ncity: New York';
    await page.fill('textarea[placeholder*="YAML"]', yamlInput);
    await page.click('button:has-text("Format")');
    
    await page.waitForTimeout(2000);
    const output = await page.textContent('textarea[readonly]');
    expect(output).toBeTruthy();
  });
});

