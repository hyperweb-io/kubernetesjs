import { expect,Page } from '@playwright/test';

/**
 * Page verification utilities for more reliable e2e testing
 * These functions avoid using .toHaveTitle() which can be unreliable
 */

/**
 * Verify page loads correctly by URL and content
 */
export async function verifyPageLoad(page: Page, expectedUrl: string | RegExp, expectedContent?: string | RegExp) {
  // Verify URL
  if (typeof expectedUrl === 'string') {
    await expect(page).toHaveURL(expectedUrl);
  } else {
    await expect(page).toHaveURL(expectedUrl);
  }
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Check for expected content if provided
  if (expectedContent) {
    const pageContent = page.locator('body');
    const content = await pageContent.textContent();
    expect(content).toMatch(expectedContent);
  }
  
  // Check for basic page elements
  const body = page.locator('body');
  await expect(body).toBeVisible();
}

/**
 * Get the first visible heading with specific text (handles multiple headings)
 */
export async function getFirstVisibleHeading(page: Page, text: string | RegExp) {
  const headings = page.locator(`h1, h2, h3, h4, h5, h6`);
  const count = await headings.count();
  
  for (let i = 0; i < count; i++) {
    const heading = headings.nth(i);
    const headingText = await heading.textContent();
    
    if (headingText && headingText.match(text)) {
      if (await heading.isVisible()) {
        return heading;
      }
    }
  }
  
  return null;
}

/**
 * Verify dashboard page loads
 */
export async function verifyDashboardPage(page: Page) {
  await verifyPageLoad(page, /\/$/, /dashboard|interweb/i);
  
  // Check for main navigation
  const navigation = page.getByRole('navigation');
  await expect(navigation).toBeVisible();
}

/**
 * Verify admin page loads
 */
export async function verifyAdminPage(page: Page, subPath?: string) {
  const urlPattern = subPath ? new RegExp(`admin/${subPath}`) : /admin/;
  await verifyPageLoad(page, urlPattern, /admin|dashboard/i);
  
  // For operators page, check for specific heading
  if (subPath === 'operators') {
    const heading = page.locator('h1:has-text("Operators")');
    await expect(heading).toBeVisible({ timeout: 10000 });
  }
}

/**
 * Verify infrastructure page loads
 */
export async function verifyInfrastructurePage(page: Page, resourceType: string) {
  const urlPattern = new RegExp(`i/${resourceType}`);
  await verifyPageLoad(page, urlPattern, new RegExp(`${resourceType}|infrastructure`, 'i'));
}

/**
 * Wait for page content to be visible
 */
export async function waitForPageContent(page: Page, selector: string, timeout = 10000) {
  const element = page.locator(selector);
  await expect(element.first()).toBeVisible({ timeout });
}

/**
 * Check if page has expected content without throwing
 */
export async function hasPageContent(page: Page, contentPattern: string | RegExp): Promise<boolean> {
  try {
    const pageContent = page.locator('body');
    const content = await pageContent.textContent();
    return content?.match(contentPattern) !== null;
  } catch {
    return false;
  }
}

/**
 * Verify page is not in error state
 */
export async function verifyPageNotInError(page: Page) {
  // Check for common error indicators
  const errorSelectors = [
    '[data-testid*="error"]',
    '[class*="error"]',
    'text="Error"',
    'text="404"',
    'text="500"',
    'text="Not Found"'
  ];
  
  for (const selector of errorSelectors) {
    const errorElement = page.locator(selector);
    if (await errorElement.isVisible()) {
      throw new Error(`Page appears to be in error state. Found error element: ${selector}`);
    }
  }
  
  // Check that body is visible and has content
  const body = page.locator('body');
  await expect(body).toBeVisible();
  
  const content = await body.textContent();
  expect(content).toBeTruthy();
  expect(content?.length).toBeGreaterThan(0);
}

/**
 * Wait for API calls to complete
 */
export async function waitForApiCalls(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle');
  
  // Wait for any pending API requests to complete
  await page.waitForFunction(() => {
    const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationEntry?.loadEventEnd > 0;
  }, { timeout });
}

/**
 * Verify page has loaded successfully with all checks
 */
export async function verifyPageLoadedSuccessfully(page: Page, expectedUrl: string | RegExp, expectedContent?: string | RegExp) {
  await verifyPageLoad(page, expectedUrl, expectedContent);
  await verifyPageNotInError(page);
  await waitForApiCalls(page);
}
