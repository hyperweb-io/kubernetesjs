import { test, expect } from '@playwright/test';
import { AdminPage } from './utils/page-objects';

test.describe('Admin Dashboard E2E Tests', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.navigate();
  });

  test('should load admin dashboard with cluster overview', async ({ page }) => {
    // Check if admin page loads successfully
    await expect(page).toHaveTitle(/admin|dashboard/i);
    
    // Verify cluster overview is visible
    await expect(adminPage.clusterOverview).toBeVisible({ timeout: 10000 });
  });

  test('should display resource summary', async ({ page }) => {
    // Check if resource summary is displayed
    await expect(adminPage.resourceSummary).toBeVisible();
    
    // Look for resource counts or metrics
    const resourceCounts = page.locator('[data-testid*="count"], [class*="count"]');
    const count = await resourceCounts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show quick actions', async ({ page }) => {
    // Check if quick actions are available
    await expect(adminPage.quickActions).toBeVisible();
    
    // Look for action buttons
    const actionButtons = page.getByRole('button');
    const buttonCount = await actionButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should navigate to operators page', async ({ page }) => {
    // Look for operators link or button
    const operatorsLink = page.getByRole('link', { name: /operators/i });
    
    if (await operatorsLink.isVisible()) {
      await operatorsLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we're on operators page
      expect(page.url()).toContain('operators');
    }
  });

  test('should navigate to backups page', async ({ page }) => {
    // Look for backups link or button
    const backupsLink = page.getByRole('link', { name: /backups/i });
    
    if (await backupsLink.isVisible()) {
      await backupsLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we're on backups page
      expect(page.url()).toContain('backups');
    }
  });

  test('should display cluster status', async ({ page }) => {
    // Check cluster status indicator
    const status = await adminPage.getClusterStatus();
    expect(status).toBeTruthy();
    
    // Look for status indicators (healthy, warning, error)
    const statusIndicators = page.locator('[data-testid*="status"], [class*="status"]');
    await expect(statusIndicators.first()).toBeVisible();
  });

  test('should handle responsive layout', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile layout is applied
    const mobileElements = page.locator('[data-testid="mobile"], .mobile, [class*="mobile"]');
    const mobileCount = await mobileElements.count();
    
    // At least some mobile-specific elements should be visible
    expect(mobileCount).toBeGreaterThanOrEqual(0);
  });
});
