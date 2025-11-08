import { Page, expect } from '@playwright/test';

/**
 * Wait for the dashboard to be fully loaded
 */
export async function waitForDashboardLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  
  // Wait for main navigation to be visible
  const navigation = page.getByRole('navigation');
  await expect(navigation).toBeVisible({ timeout: 10000 });
  
  // Wait for any loading spinners to disappear
  const loadingSpinners = page.locator('[data-testid="loading"], .loading, [class*="spinner"]');
  await expect(loadingSpinners).toHaveCount(0, { timeout: 5000 });
}

/**
 * Navigate to a specific dashboard section
 */
export async function navigateToSection(page: Page, section: string) {
  await page.goto(`/${section}`);
  await waitForDashboardLoad(page);
}

/**
 * Wait for API calls to complete
 */
export async function waitForApiCalls(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle');
  
  // Wait for any pending API requests to complete
  await page.waitForFunction(() => {
    return window.performance.getEntriesByType('navigation')[0]?.loadEventEnd > 0;
  }, { timeout });
}

/**
 * Take a screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Check if element exists without throwing
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get text content safely
 */
export async function getTextContent(page: Page, selector: string): Promise<string | null> {
  try {
    const element = await page.waitForSelector(selector, { timeout: 5000 });
    return await element.textContent();
  } catch {
    return null;
  }
}

/**
 * Wait for table data to load
 */
export async function waitForTableData(page: Page, tableSelector = 'table') {
  await page.waitForSelector(tableSelector);
  
  // Wait for table rows to appear
  const rows = page.locator(`${tableSelector} tbody tr`);
  await expect(rows).toHaveCount({ min: 1 }, { timeout: 10000 });
}

/**
 * Fill form field safely
 */
export async function fillFormField(
  page: Page, 
  label: string, 
  value: string, 
  fieldType: 'input' | 'select' | 'textarea' = 'input'
) {
  const field = page.getByLabel(label);
  await expect(field).toBeVisible();
  
  if (fieldType === 'select') {
    await field.selectOption(value);
  } else {
    await field.fill(value);
  }
}

/**
 * Click button safely with retry
 */
export async function clickButtonSafely(page: Page, buttonText: string | RegExp, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const button = page.getByRole('button', { name: buttonText });
      await expect(button).toBeVisible();
      await button.click();
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Wait for dialog to appear and be ready
 */
export async function waitForDialog(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.waitForLoadState('networkidle');
  return dialog;
}

/**
 * Close dialog safely
 */
export async function closeDialog(page: Page) {
  const closeButton = page.getByRole('button', { name: /close|cancel|×/i });
  const escapeKey = page.keyboard.press('Escape');
  
  try {
    await closeButton.click();
  } catch {
    await escapeKey;
  }
  
  const dialog = page.getByRole('dialog');
  await expect(dialog).not.toBeVisible();
}
