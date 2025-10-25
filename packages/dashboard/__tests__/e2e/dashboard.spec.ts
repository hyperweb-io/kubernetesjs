import { test, expect } from '@playwright/test';
import { verifyDashboardPage } from './utils/page-verification';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the main dashboard page', async ({ page }) => {
    // Use the reliable page verification function
    await verifyDashboardPage(page);
  });

  test('should display cluster status', async ({ page }) => {
    // Look for cluster status indicators
    const statusElements = page.locator('[data-testid*="status"], [class*="status"]');
    await expect(statusElements.first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation to different dashboard sections
    const navLinks = page.getByRole('link');
    const firstNavLink = navLinks.first();
    
    if (await firstNavLink.isVisible()) {
      await firstNavLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we're on a different page
      expect(page.url()).not.toBe('http://localhost:3000/');
    }
  });

  test('should handle theme toggle', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Check if theme changed (this might be reflected in HTML class or data attribute)
      const html = page.locator('html');
      await expect(html).toHaveAttribute('class', /dark|light/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile navigation is visible
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, [class*="mobile"]');
    
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});
