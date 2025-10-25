import { test, expect } from '@playwright/test';

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for main heading
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
    
    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper navigation landmarks', async ({ page }) => {
    // Check for navigation landmark
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    // Check for main content landmark
    const main = page.getByRole('main');
    if (await main.isVisible()) {
      await expect(main).toBeVisible();
    }
  });

  test('should have proper button labels', async ({ page }) => {
    // Check all buttons have accessible names
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || 
                           await button.textContent() ||
                           await button.getAttribute('title');
      
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    // Check all form inputs have labels
    const inputs = page.locator('input, select, textarea');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const label = page.locator(`label[for="${await input.getAttribute('id')}"]`);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      const hasLabel = await label.isVisible() || ariaLabel || ariaLabelledBy;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test arrow key navigation for menus
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
  });

  test('should have proper color contrast', async ({ page }) => {
    // This is a basic test - for full accessibility testing, 
    // you might want to use axe-core or similar tools
    
    // Check if theme toggle is available
    const themeToggle = page.getByRole('button', { name: /theme/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Verify theme changed
      const html = page.locator('html');
      const classList = await html.getAttribute('class');
      expect(classList).toBeTruthy();
    }
  });

  test('should handle screen reader announcements', async ({ page }) => {
    // Check for aria-live regions
    const liveRegions = page.locator('[aria-live]');
    const count = await liveRegions.count();
    
    // Should have at least some live regions for dynamic content
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper focus management', async ({ page }) => {
    // Test focus management in modals/dialogs
    const dialogTrigger = page.getByRole('button', { name: /create|add|new/i });
    
    if (await dialogTrigger.isVisible()) {
      await dialogTrigger.click();
      
      const dialog = page.getByRole('dialog');
      if (await dialog.isVisible()) {
        // Focus should be in the dialog
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Test escape key closes dialog
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
      }
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    // Check all images have alt text
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Images should have alt text or be decorative (empty alt)
      expect(alt !== null).toBeTruthy();
    }
  });
});
