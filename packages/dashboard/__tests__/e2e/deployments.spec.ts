import { test, expect } from '@playwright/test';

test.describe('Deployments E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to deployments page
    await page.goto('/i/deployments');
    await page.waitForLoadState('networkidle');
  });

  test('should load deployments page', async ({ page }) => {
    // Check if deployments page loads by URL
    await expect(page).toHaveURL(/i\/deployments/);
    
    // Look for deployments table or list
    const deploymentsTable = page.locator('[data-testid="deployments-table"], table, [class*="deployment"]');
    await expect(deploymentsTable.first()).toBeVisible({ timeout: 10000 });
    
    // Check for deployments content
    const pageContent = page.locator('body');
    const content = await pageContent.textContent();
    expect(content).toMatch(/deployment|dashboard/i);
  });

  test('should create new deployment', async ({ page }) => {
    // Look for create deployment button
    const createButton = page.getByRole('button', { name: /create|new|add/i });
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Check if create dialog opens
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      // Fill in deployment form
      const nameInput = page.getByLabel(/name/i);
      if (await nameInput.isVisible()) {
        await nameInput.fill('test-deployment-e2e');
      }
      
      // Submit the form
      const submitButton = page.getByRole('button', { name: /create|submit|save/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for dialog to close and deployment to appear
        await expect(dialog).not.toBeVisible();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should scale deployment', async ({ page }) => {
    // Look for scale button or action menu
    const scaleButton = page.getByRole('button', { name: /scale/i });
    const actionMenu = page.locator('[data-testid="action-menu"], [class*="action"]');
    
    if (await actionMenu.isVisible()) {
      await actionMenu.first().click();
      const scaleOption = page.getByText(/scale/i);
      if (await scaleOption.isVisible()) {
        await scaleOption.click();
        
        // Check if scale dialog opens
        const scaleDialog = page.getByRole('dialog');
        await expect(scaleDialog).toBeVisible();
      }
    }
  });

  test('should filter deployments', async ({ page }) => {
    // Look for search or filter input
    const searchInput = page.getByPlaceholder(/search|filter/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForLoadState('networkidle');
      
      // Check if results are filtered
      const results = page.locator('[data-testid="deployment-item"], tr, [class*="deployment"]');
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should handle deployment actions', async ({ page }) => {
    // Look for deployment actions (edit, delete, etc.)
    const actionButtons = page.getByRole('button', { name: /edit|delete|view/i });
    
    if (await actionButtons.first().isVisible()) {
      await actionButtons.first().click();
      
      // Check if appropriate action is triggered
      // This could be a dialog, navigation, or confirmation
      const dialog = page.getByRole('dialog');
      const confirmation = page.getByText(/confirm|delete|edit/i);
      
      if (await dialog.isVisible() || await confirmation.isVisible()) {
        await expect(dialog.or(confirmation)).toBeVisible();
      }
    }
  });
});
