const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('File Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=KonvertR', { timeout: 10000 });
  });

  test('@smoke File Upload and Conversion', async ({ page }) => {
    await page.click('text=File Tools');
    await page.waitForTimeout(500);
    
    // File Operations is default active sidebar item
    await page.waitForSelector('text=File Operations', { timeout: 5000 });
    
    // Upload file
    const filePath = path.join(__dirname, '../../test-samples/minimal.json');
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Select target format
    await page.selectOption('#file-to-format', 'yaml');
    
    // Click Convert
    await page.click('button:has-text("Convert")');
    
    // Wait for conversion
    await page.waitForSelector('text=Converted Content', { timeout: 10000 });
    
    // Verify converted content exists
    const content = await page.textContent('textarea[readonly]');
    expect(content).toBeTruthy();
  });

  test('Compare & Diff - Side-by-side comparison', async ({ page }) => {
    await page.click('text=File Tools');
    await page.waitForTimeout(500);
    
    // Click on Compare & Diff sidebar item
    await page.click('text=Compare & Diff');
    await page.waitForTimeout(500);
    await page.waitForSelector('text=Compare & Diff', { timeout: 5000 });
    
    // Paste content in Input 1
    const json1 = '{"name":"John","age":30}';
    await page.fill('textarea:has-text("Input 1")', json1);
    
    // Paste content in Input 2
    const json2 = '{"name":"Jane","age":25}';
    await page.fill('textarea:has-text("Input 2")', json2);
    
    // Click Compare
    await page.click('button:has-text("Compare")');
    
    // Wait for side-by-side view
    await page.waitForSelector('.diff-container', { timeout: 10000 });
    
    // Verify side-by-side view appears
    const diffContainer = await page.locator('.diff-container');
    await expect(diffContainer).toBeVisible();
    
    // Verify red highlighting on differences
    const diffLines = await page.locator('.bg-red-100').count();
    expect(diffLines).toBeGreaterThan(0);
  });
});

