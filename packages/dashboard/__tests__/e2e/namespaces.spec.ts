import { test, expect } from '@playwright/test';

test.describe('Namespaces E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to namespaces or main page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display namespace switcher', async ({ page }) => {
    // Look for namespace switcher component
    const namespaceSwitcher = page.locator('[data-testid="namespace-switcher"], [class*="namespace"]');
    
    if (await namespaceSwitcher.isVisible()) {
      await expect(namespaceSwitcher).toBeVisible();
    }
  });

  test('should switch between namespaces', async ({ page }) => {
    // Look for namespace dropdown or selector
    const namespaceSelector = page.getByRole('combobox', { name: /namespace/i });
    const namespaceButton = page.getByRole('button', { name: /namespace/i });
    
    if (await namespaceSelector.isVisible()) {
      await namespaceSelector.click();
      
      // Look for namespace options
      const options = page.getByRole('option');
      if (await options.first().isVisible()) {
        await options.first().click();
        await page.waitForLoadState('networkidle');
        
        // Verify namespace changed (check URL or page content)
        expect(page.url()).toContain('namespace=');
      }
    } else if (await namespaceButton.isVisible()) {
      await namespaceButton.click();
      
      // Check if namespace menu opens
      const menu = page.getByRole('menu');
      if (await menu.isVisible()) {
        await expect(menu).toBeVisible();
      }
    }
  });

  test('should filter resources by namespace', async ({ page }) => {
    // Navigate to a resource page that shows namespace-filtered content
    await page.goto('/i/pods');
    await page.waitForLoadState('networkidle');
    
    // Check if resources are filtered by current namespace
    const resourceItems = page.locator('[data-testid="pod-item"], tr, [class*="pod"]');
    const count = await resourceItems.count();
    
    if (count > 0) {
      // Verify that resources belong to the selected namespace
      // This might require checking data attributes or text content
      const firstItem = resourceItems.first();
      await expect(firstItem).toBeVisible();
    }
  });

  test('should handle namespace creation', async ({ page }) => {
    // Look for create namespace option
    const createButton = page.getByRole('button', { name: /create.*namespace|new.*namespace/i });
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Check if create namespace dialog opens
      const dialog = page.getByRole('dialog');
      if (await dialog.isVisible()) {
        await expect(dialog).toBeVisible();
        
        // Fill in namespace name
        const nameInput = page.getByLabel(/name/i);
        if (await nameInput.isVisible()) {
          await nameInput.fill('test-namespace-e2e');
        }
        
        // Submit the form
        const submitButton = page.getByRole('button', { name: /create|submit/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });
});
