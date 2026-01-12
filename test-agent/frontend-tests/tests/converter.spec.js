const { test, expect } = require('@playwright/test');

test.describe('Format Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for application to load
    await page.waitForSelector('text=KonvertR', { timeout: 10000 });
  });

  test('@smoke Convert JSON to YAML', async ({ page }) => {
    // Navigate to Transform tab (not Convert)
    await page.click('text=Transform');
    await page.waitForTimeout(500); // Wait for tab to switch
    
    // Ensure Format Conversion section is visible (default active)
    await page.waitForSelector('text=Format Conversion', { timeout: 5000 });
    
    // Select formats
    await page.selectOption('#fromFormat', 'json');
    await page.selectOption('#toFormat', 'yaml');
    
    // Enter JSON input
    const jsonInput = `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`;
    await page.fill('#input', jsonInput);
    
    // Click Convert
    await page.click('button:has-text("Convert")');
    
    // Wait for output
    await page.waitForSelector('#output', { timeout: 5000 });
    
    // Verify output
    const output = await page.textContent('#output');
    expect(output).toBeTruthy();
    expect(output).toContain('name:');
    expect(output).toContain('John');
  });

  test('Convert JSON to XML', async ({ page }) => {
    await page.click('text=Transform');
    await page.waitForTimeout(500);
    await page.waitForSelector('text=Format Conversion', { timeout: 5000 });
    
    await page.selectOption('#fromFormat', 'json');
    await page.selectOption('#toFormat', 'xml');
    
    const jsonInput = '{"name":"John","age":30}';
    await page.fill('#input', jsonInput);
    await page.click('button:has-text("Convert")');
    
    await page.waitForSelector('#output', { timeout: 5000 });
    const output = await page.textContent('#output');
    
    expect(output).toBeTruthy();
    expect(output).toContain('<?xml');
    expect(output).toContain('<data>'); // Actual XML uses <data> not <root>
  });

  test('Error handling - Invalid JSON', async ({ page }) => {
    await page.click('text=Transform');
    await page.waitForTimeout(500);
    await page.waitForSelector('text=Format Conversion', { timeout: 5000 });
    
    await page.selectOption('#fromFormat', 'json');
    await page.selectOption('#toFormat', 'yaml');
    
    await page.fill('#input', '{ invalid json }');
    await page.click('button:has-text("Convert")');
    
    // Should show error
    await page.waitForTimeout(2000);
    const output = await page.textContent('#output');
    expect(output).toContain('Error');
  });
});

