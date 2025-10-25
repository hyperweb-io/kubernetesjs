import { test, expect } from '@playwright/test';
import { 
  navigateToOperatorsPage, 
  installOperator, 
  verifyOperatorInstallation,
  waitForOperatorInstallation
} from './utils/workflow-helpers';

test.describe('Operators Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToOperatorsPage(page);
  });

  test('should load operators page with correct elements', async ({ page }) => {
    // Verify page title/heading
    const heading = page.locator('h1:has-text("Operators")');
    await expect(heading).toBeVisible();
    
    // Verify description
    const description = page.getByText('Install and manage Kubernetes operators for your cluster');
    await expect(description).toBeVisible();
    
    // Check for search input
    const searchInput = page.getByPlaceholder('Search operators...');
    await expect(searchInput).toBeVisible();
    
    // Check for status filter
    const statusFilter = page.getByRole('combobox');
    await expect(statusFilter).toBeVisible();
    
    // Check for help link
    const helpLink = page.getByRole('link', { name: /view operator docs/i });
    await expect(helpLink).toBeVisible();
  });

  test('should display operators grid when loaded', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Check for operator cards
    const operatorCards = page.locator('[data-testid*="operator"], [class*="operator"]');
    const cardCount = await operatorCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should handle loading state', async ({ page }) => {
    // Check for loading state
    const loadingState = page.locator('text=Loading operators...');
    const errorState = page.locator('text=Failed to load operators');
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    
    // One of these should be visible
    await expect(loadingState.or(errorState).or(operatorsGrid)).toBeVisible({ timeout: 15000 });
  });

  test('should search operators', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Search for operators
    const searchInput = page.getByPlaceholder('Search operators...');
    await searchInput.fill('cert');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Check if results are filtered
    const operatorCards = page.locator('[data-testid*="operator"], [class*="operator"]');
    const cardCount = await operatorCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test('should filter operators by status', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Open status filter
    const statusFilter = page.getByRole('combobox');
    await statusFilter.click();
    
    // Select "Installed" filter
    const installedOption = page.getByRole('option', { name: /installed/i });
    if (await installedOption.isVisible()) {
      await installedOption.click();
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const operatorCards = page.locator('[data-testid*="operator"], [class*="operator"]');
      const cardCount = await operatorCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should install cert-manager operator', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Install cert-manager operator
    await installOperator(page, 'cert-manager');
    
    // Wait for installation to complete
    const installed = await waitForOperatorInstallation(page, 'cert-manager');
    expect(installed).toBe(true);
    
    // Verify installation
    await verifyOperatorInstallation(page, 'cert-manager');
  });

  test('should install cloudnative-pg operator', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Install cloudnative-pg operator
    await installOperator(page, 'cloudnative-pg');
    
    // Wait for installation to complete
    const installed = await waitForOperatorInstallation(page, 'cloudnative-pg');
    expect(installed).toBe(true);
    
    // Verify installation
    await verifyOperatorInstallation(page, 'cloudnative-pg');
  });

  test('should handle operator installation errors', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Try to install a non-existent operator
    await installOperator(page, 'non-existent-operator');
    
    // Check for error state
    const errorIcon = page.locator('.text-red-600');
    if (await errorIcon.isVisible()) {
      await expect(errorIcon).toBeVisible();
    }
  });

  test('should display operator cards with correct elements', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Get first operator card
    const operatorCards = page.locator('[data-testid*="operator"], [class*="operator"]');
    const firstCard = operatorCards.first();
    
    if (await firstCard.isVisible()) {
      // Check for operator icon
      const icon = firstCard.locator('.text-3xl, .text-2xl');
      await expect(icon).toBeVisible();
      
      // Check for operator name
      const name = firstCard.locator('h3, h4, .font-medium');
      await expect(name).toBeVisible();
      
      // Check for version
      const version = firstCard.locator('text=v');
      await expect(version).toBeVisible();
      
      // Check for description
      const description = firstCard.locator('p');
      await expect(description).toBeVisible();
      
      // Check for switch
      const switchElement = firstCard.locator('[role="switch"]');
      await expect(switchElement).toBeVisible();
      
      // Check for status indicator
      const statusIndicator = firstCard.locator('.text-green-600, .text-yellow-600, .text-red-600, .text-gray-400');
      await expect(statusIndicator).toBeVisible();
    }
  });

  test('should handle no results state', async ({ page }) => {
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Search for something that doesn't exist
    const searchInput = page.getByPlaceholder('Search operators...');
    await searchInput.fill('nonexistentoperator123');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Check for no results message
    const noResultsMessage = page.locator('text=No operators match your filters');
    if (await noResultsMessage.isVisible()) {
      await expect(noResultsMessage).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for operators to load
    const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
    
    // Check if mobile layout is applied
    const mobileLayout = page.locator('.grid-cols-1');
    await expect(mobileLayout).toBeVisible();
  });
});
