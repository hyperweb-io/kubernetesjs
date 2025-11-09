import {Page } from '@playwright/test';

/**
 * Base page object for common dashboard functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  get navigation() {
    return this.page.getByRole('navigation');
  }

  get themeToggle() {
    return this.page.getByRole('button', { name: /theme|dark|light/i });
  }

  get mobileMenu() {
    return this.page.locator('[data-testid="mobile-menu"], .mobile-menu');
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.navigation.waitFor({ state: 'visible', timeout: 10000 });
  }

  async toggleTheme() {
    if (await this.themeToggle.isVisible()) {
      await this.themeToggle.click();
    }
  }

  async openMobileMenu() {
    if (await this.mobileMenu.isVisible()) {
      await this.mobileMenu.click();
    }
  }
}

/**
 * Deployments page object
 */
export class DeploymentsPage extends BasePage {
  get createButton() {
    return this.page.getByRole('button', { name: /create|new|add/i });
  }

  get deploymentsTable() {
    return this.page.locator('[data-testid="deployments-table"], table');
  }

  get searchInput() {
    return this.page.getByPlaceholder(/search|filter/i);
  }

  get deploymentRows() {
    return this.deploymentsTable.locator('tbody tr');
  }

  async navigate() {
    await this.page.goto('/i/deployments');
    await this.waitForLoad();
  }

  async createDeployment(name: string) {
    await this.createButton.click();
    const dialog = await this.page.waitForSelector('[role="dialog"]');
    
    // Fill deployment form
    await this.page.getByLabel(/name/i).fill(name);
    await this.page.getByRole('button', { name: /create|submit/i }).click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async searchDeployments(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async getDeploymentCount(): Promise<number> {
    return await this.deploymentRows.count();
  }
}

/**
 * Namespace switcher page object
 */
export class NamespaceSwitcher extends BasePage {
  get namespaceSelector() {
    return this.page.getByRole('combobox', { name: /namespace/i });
  }

  get namespaceButton() {
    return this.page.getByRole('button', { name: /namespace/i });
  }

  get namespaceOptions() {
    return this.page.getByRole('option');
  }

  async selectNamespace(namespace: string) {
    if (await this.namespaceSelector.isVisible()) {
      await this.namespaceSelector.click();
      await this.namespaceOptions.filter({ hasText: namespace }).click();
    } else if (await this.namespaceButton.isVisible()) {
      await this.namespaceButton.click();
      await this.page.getByText(namespace).click();
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentNamespace(): Promise<string | null> {
    const selector = await this.namespaceSelector.isVisible();
    const button = await this.namespaceButton.isVisible();
    
    if (selector) {
      return await this.namespaceSelector.inputValue();
    } else if (button) {
      return await this.namespaceButton.textContent();
    }
    
    return null;
  }
}

/**
 * Admin page object
 */
export class AdminPage extends BasePage {
  get clusterOverview() {
    return this.page.locator('[data-testid="cluster-overview"]');
  }

  get resourceSummary() {
    return this.page.locator('[data-testid="resource-summary"]');
  }

  get quickActions() {
    return this.page.locator('[data-testid="quick-actions"]');
  }

  async navigate() {
    await this.page.goto('/admin');
    await this.waitForLoad();
  }

  async getClusterStatus() {
    const statusElement = this.page.locator('[data-testid*="status"], [class*="status"]').first();
    return await statusElement.textContent();
  }
}

/**
 * Database page object
 */
export class DatabasePage extends BasePage {
  get createDatabaseButton() {
    return this.page.getByRole('button', { name: /create.*database|new.*database/i });
  }

  get databaseList() {
    return this.page.locator('[data-testid="database-list"], table');
  }

  async navigate() {
    await this.page.goto('/databases');
    await this.waitForLoad();
  }

  async createDatabase(name: string) {
    await this.createDatabaseButton.click();
    const dialog = await this.page.waitForSelector('[role="dialog"]');
    
    await this.page.getByLabel(/name/i).fill(name);
    await this.page.getByRole('button', { name: /create|submit/i }).click();
    
    await this.page.waitForLoadState('networkidle');
  }
}
