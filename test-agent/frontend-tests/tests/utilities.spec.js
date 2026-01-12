const { test, expect } = require('@playwright/test');

test.describe('Utilities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=KonvertR', { timeout: 10000 });
  });

  test('@smoke Hash Generation - SHA-256', async ({ page }) => {
    await page.click('text=ToolKit');
    await page.waitForTimeout(500);
    
    // Validation & Hashing section should be visible and default active
    await page.waitForSelector('text=Hashing', { timeout: 5000 });
    
    await page.fill('textarea[placeholder*="input"]', 'Hello, World!');
    await page.selectOption('select', 'SHA-256');
    await page.click('button:has-text("Generate")');
    
    await page.waitForTimeout(2000);
    const hash = await page.textContent('textarea[readonly]');
    
    expect(hash).toBeTruthy();
    expect(hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 format
  });

  test('Base64 Encode/Decode', async ({ page }) => {
    // Tab label has space: "Encode / Decode"
    await page.click('text=Encode / Decode');
    await page.waitForTimeout(500);
    
    // Base64 section should be visible after clicking tab
    await page.waitForSelector('text=Base64', { timeout: 5000 });
    
    const input = 'Hello, World!';
    await page.fill('textarea[placeholder*="encode"]', input);
    await page.click('button:has-text("Encode")');
    
    await page.waitForTimeout(2000);
    let encoded = await page.textContent('textarea[readonly]');
    expect(encoded).toBeTruthy();
    
    // Switch to decode
    await page.selectOption('select', 'decode');
    await page.fill('textarea[placeholder*="decode"]', encoded.trim());
    await page.click('button:has-text("Decode")');
    
    await page.waitForTimeout(2000);
    const decoded = await page.textContent('textarea[readonly]');
    expect(decoded).toBe(input);
  });

  test('Schema Validation - Valid JSON', async ({ page }) => {
    await page.click('text=ToolKit');
    await page.waitForTimeout(500);
    
    // Validation & Hashing section should be visible and default active
    await page.waitForSelector('text=Validation', { timeout: 5000 });
    
    await page.selectOption('select', 'json');
    const validJson = '{"name":"John","age":30}';
    await page.fill('textarea[placeholder*="validate"]', validJson);
    await page.click('button:has-text("Validate")');
    
    await page.waitForTimeout(2000);
    const result = await page.textContent('textarea[readonly]');
    expect(result).toContain('Valid');
  });
});

