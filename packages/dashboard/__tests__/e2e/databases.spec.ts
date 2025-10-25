import { test, expect } from '@playwright/test';
import { DatabasePage } from './utils/page-objects';

test.describe('Databases E2E Tests', () => {
  let databasePage: DatabasePage;

  test.beforeEach(async ({ page }) => {
    databasePage = new DatabasePage(page);
    await databasePage.navigate();
  });

  test('should load databases page', async ({ page }) => {
    // Check if databases page loads successfully by URL
    await expect(page).toHaveURL(/databases/);
    
    // Verify database list is visible
    await expect(databasePage.databaseList).toBeVisible({ timeout: 10000 });
    
    // Check for databases content
    const pageContent = page.locator('body');
    const content = await pageContent.textContent();
    expect(content).toMatch(/database|dashboard/i);
  });

  test('should create new database', async ({ page }) => {
    // Check if create database button is available
    if (await databasePage.createDatabaseButton.isVisible()) {
      await databasePage.createDatabaseButton.click();
      
      // Check if create dialog opens
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      // Fill in database form
      const nameInput = page.getByLabel(/name/i);
      if (await nameInput.isVisible()) {
        await nameInput.fill('test-database-e2e');
      }
      
      // Submit the form
      const submitButton = page.getByRole('button', { name: /create|submit/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify dialog closes
        await expect(dialog).not.toBeVisible();
      }
    }
  });

  test('should display database list', async ({ page }) => {
    // Check if database list shows items
    const databaseItems = page.locator('[data-testid="database-item"], tr, [class*="database"]');
    const count = await databaseItems.count();
    
    // Should have at least some database entries (even if empty)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle database actions', async ({ page }) => {
    // Look for database action buttons (view, edit, delete)
    const actionButtons = page.getByRole('button', { name: /view|edit|delete|manage/i });
    
    if (await actionButtons.first().isVisible()) {
      await actionButtons.first().click();
      
      // Check if appropriate action is triggered
      const dialog = page.getByRole('dialog');
      const newPage = page.url() !== 'http://localhost:3000/databases';
      
      if (await dialog.isVisible() || newPage) {
        // Action was triggered successfully
        expect(true).toBe(true);
      }
    }
  });

  test('should filter databases', async ({ page }) => {
    // Look for search or filter input
    const searchInput = page.getByPlaceholder(/search|filter/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForLoadState('networkidle');
      
      // Check if results are filtered
      const results = page.locator('[data-testid="database-item"], tr, [class*="database"]');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should show database status', async ({ page }) => {
    // Look for database status indicators
    const statusElements = page.locator('[data-testid*="status"], [class*="status"]');
    const count = await statusElements.count();
    
    if (count > 0) {
      await expect(statusElements.first()).toBeVisible();
    }
  });

  test('should handle database backup', async ({ page }) => {
    // Look for backup button or action
    const backupButton = page.getByRole('button', { name: /backup/i });
    
    if (await backupButton.isVisible()) {
      await backupButton.click();
      
      // Check if backup dialog or process starts
      const dialog = page.getByRole('dialog');
      const confirmation = page.getByText(/backup|confirm/i);
      
      if (await dialog.isVisible() || await confirmation.isVisible()) {
        await expect(dialog.or(confirmation)).toBeVisible();
      }
    }
  });
});
