import { InterwebClient } from '@kubernetesjs/ops';
import { expect,Page } from '@playwright/test';

import { verifyPageLoadedSuccessfully } from './page-verification';

const interweb = new InterwebClient({
  restEndpoint: 'http://127.0.0.1:8001',
  kubeconfig: '',
  namespace: 'default',
  context: 'default',
});

/**
 * Workflow-specific helper functions for Operator Installation & Database Management
 */

/**
 * Navigate to operators page and verify it loads
 */
export async function navigateToOperatorsPage(page: Page) {
  await page.goto('/admin/operators');
  await verifyPageLoadedSuccessfully(page, /admin\/operators/, /operator|admin/i);
  
  // Wait for the main h1 heading to be visible
  const heading = page.locator('h1:has-text("Operators")');
  await expect(heading).toBeVisible({ timeout: 10000 });
  
  // Wait for either loading state, error state, or operators grid
  const loadingState = page.locator('text=Loading operators...');
  const errorState = page.locator('text=Failed to load operators');
  const operatorsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
  
  // Wait for one of these states to appear
  await expect(loadingState.or(errorState).or(operatorsGrid)).toBeVisible({ timeout: 15000 });
}

/**
 * Install a specific operator
 */
export async function installOperator(page: Page, operatorName: string) {
  console.log(`Installing operator: ${operatorName}`);
  
  
  // Wait for operators grid to be visible
  const operatorsGrid = page.locator('.grid').first();
  await expect(operatorsGrid).toBeVisible({ timeout: 15000 });
  console.log('Operators grid found');
  
  // Find operator card by h3 title
  const operatorCard = page.locator(`h3:has-text("${operatorName}")`).first();
  
  // Assert that operator card exists
  await expect(operatorCard).toBeVisible({ timeout: 10000 });
  console.log(`Found operator card for: ${operatorName}`);
  
  // Find the Switch component - it's in the same card container
  const cardContainer = operatorCard.locator('xpath=ancestor::div[contains(@class, "rounded-lg")]').first();
  const switchElement = cardContainer.locator('button[role="switch"]').first();
  
  // Assert that switch exists
  await expect(switchElement).toBeVisible({ timeout: 5000 });
  console.log('Found switch element');
  
  // Check if already installed
  const isChecked = await switchElement.getAttribute('aria-checked');
  console.log(`Switch checked state: ${isChecked}`);
  
  // Assert that operator is not already installed, then install it
  expect(isChecked).toBe('false');
  console.log('Clicking switch to install...');
  await switchElement.click();
  await page.waitForTimeout(5000);
  console.log('Installation started');
}

/**
 * Verify operator installation status
 */
export async function verifyOperatorInstallation(page: Page, operatorName: string) {
  console.log(`Verifying operator installation: ${operatorName}`);
  
  // Find operator card
  const operatorCard = page.locator(`h3:has-text("${operatorName}")`).first();
  
  // Assert that operator card exists
  await expect(operatorCard).toBeVisible({ timeout: 10000 });
  console.log(`Found operator card for: ${operatorName}`);
  
  // Find the Switch component - it's in the same card container
  const cardContainer = operatorCard.locator('xpath=ancestor::div[contains(@class, "rounded-lg")]').first();
  const switchElement = cardContainer.locator('button[role="switch"]').first();
  
  // Assert that switch exists
  await expect(switchElement).toBeVisible({ timeout: 5000 });
  console.log('Found switch element');
  
  // Check the switch state
  const isChecked = await switchElement.getAttribute('aria-checked');
  expect(isChecked).toBe('true');
  console.log(`Operator ${operatorName} is installed`);
}

export async function verifyOperatorInstalled(operatorName: string) {
  const crds = await interweb.listApiextensionsV1CustomResourceDefinition({query: {}});
  const crdsNames = crds.items.map(crd => crd.metadata?.name ?? '');
  expect(crdsNames.some(crdName => new RegExp(operatorName).test(crdName))).toBe(true);
}

/**
 * Navigate to databases page and create a database
 */
export async function createDatabase(page: Page, databaseName: string) {
  await page.goto('/admin/databases');
  await verifyPageLoadedSuccessfully(page, /admin\/databases/, /database|admin/i);
  
  // Look for create database button
  const createButton = page.getByRole('button', { name: /create.*database|new.*database/i });
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();
  
  // Wait for create database dialog
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: 5000 });
  
  // Fill in other fields using label text to find the container, then the input
  // Storage field
  const storageLabel = page.locator('label:has-text("Storage")');
  const storageInput = storageLabel.locator('xpath=following-sibling::input').first();
  if (await storageInput.isVisible()) {
    await storageInput.fill('1Gi');
  }
  
  // Storage Class field
  const storageClassLabel = page.locator('label:has-text("Storage Class")');
  const storageClassInput = storageClassLabel.locator('xpath=following-sibling::input').first();
  if (await storageClassInput.isVisible()) {
    await storageClassInput.fill('standard');
  }
  
  // App Username field
  const appUsernameLabel = page.locator('label:has-text("App Username")');
  const appUsernameInput = appUsernameLabel.locator('xpath=following-sibling::input').first();
  if (await appUsernameInput.isVisible()) {
    await appUsernameInput.clear();
    await appUsernameInput.fill('appuser');
  }
  
  // App Password field
  const appPasswordLabel = page.locator('label:has-text("App Password")');
  const appPasswordInput = appPasswordLabel.locator('xpath=following-sibling::input').first();
  if (await appPasswordInput.isVisible()) {
    await appPasswordInput.clear();
    await appPasswordInput.fill('appuser123!');
  }
  
  // Superuser Password field
  const superuserPasswordLabel = page.locator('label:has-text("Superuser Password")');
  const superuserPasswordInput = superuserPasswordLabel.locator('xpath=following-sibling::input').first();
  if (await superuserPasswordInput.isVisible()) {
    await superuserPasswordInput.clear();
    await superuserPasswordInput.fill('postgres123!');
  }
  
  // Submit the form
  const submitButton = page.getByRole('button', { name: /create/i });
  await expect(submitButton).toBeVisible({ timeout: 5000 });
  await submitButton.click();
  
  console.log(`Database ${databaseName} creation submitted`);
}

/**
 * Verify database was created successfully
 */
export async function verifyDatabaseCreated(page: Page, databaseName: string) {
  console.log(`Verifying database creation: ${databaseName}`);
  
  // Navigate to databases page
  await page.goto('/admin/databases');
  
  // Look for the database in the table
  // The database name appears in the first column of the table row
  const databaseRow = page.locator(`tr:has-text("${databaseName}")`);
  await expect(databaseRow).toBeVisible({ timeout: 30000 });
  
  // Verify the database name is displayed
  const databaseNameCell = databaseRow.locator('td').first();
  await expect(databaseNameCell).toContainText(databaseName);
  
  console.log(`Database ${databaseName} verified as created`);
}

/**
 * Take comprehensive screenshots of admin dashboard
 */
export async function snapshotAdminDashboard(page: Page) {
  await page.goto('/admin');
  
  // Wait for API calls to complete
  await page.waitForResponse('/api/cluster/status');
  // await page.waitForResponse('/api/operators');
  
  // Take snapshot
  await expect(page).toHaveScreenshot('admin-dashboard.png', {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixelRatio: 0.02
  });
  
  console.log('Admin dashboard snapshot completed');
}

/**
 * Validate infrastructure page
 */
export async function validateInfrastructurePage(page: Page, pagePath: string, pageName: string) {
  await page.goto(pagePath);
  await verifyPageLoadedSuccessfully(page, new RegExp(`i/${pageName}`), pageName);
  
  // Check for main heading (e.g., "Deployments", "Services", "Pods", "ConfigMaps")
  // Use more specific selector to avoid sidebar heading
  const mainHeading = page.locator(`main h2:has-text("${pageName}")`);
  await expect(mainHeading).toBeVisible();
  
  // Check for stats cards (Total, Running, etc.)
  const statsCards = page.locator('div[class*="grid-cols-3"] div[class*="card"]');
  const cardCount = await statsCards.count();
  expect(cardCount).toBeGreaterThan(0);
  
  // Check for main content table
  const contentTable = page.locator('table');
  await expect(contentTable).toBeVisible();
  
  // Check for table headers
  const tableHeaders = page.locator('thead th');
  const headerCount = await tableHeaders.count();
  expect(headerCount).toBeGreaterThan(0);
  
  // Take screenshot
  await page.screenshot({ 
    path: `test-results/screenshots/infrastructure-${pageName}-${Date.now()}.png`,
    fullPage: true 
  });
  
  // Check for content entries in table body
  const contentRows = page.locator('tbody tr');
  const rowCount = await contentRows.count();
  
  return rowCount;
}

/**
 * Check for specific resource in infrastructure pages
 */
export async function checkForResource(page: Page, resourceName: string, pagePath: string) {
  await page.goto(pagePath);
  
  await setNamespaceToAll(page);

  // Look for the specific resource in the table
  const resourceElement = page.locator(`tbody tr:has-text("${resourceName}")`);
  
  // Assert that resource exists
  await expect(resourceElement).toBeVisible({ timeout: 10000 });
  return true;
}

/**
 * Verify cluster status and health
 */
export async function verifyClusterHealth(page: Page) {
  await page.goto('/admin');
  
  // Wait for API calls to complete
  await page.waitForResponse('/api/cluster/status');
  // await page.waitForResponse('/api/operators');
  
  // Verify page title and main heading
  await expect(page).toHaveURL(/admin/);
  const mainHeading = page.locator('h1:has-text("Dashboard")');
  await expect(mainHeading).toBeVisible();
  
  // Check ClusterOverview component - look for the main metrics grid
  const clusterOverview = page.locator('h3:has-text("Cluster Status")').locator('xpath=ancestor::div[contains(@class, "card")]');
  await expect(clusterOverview).toBeVisible();
  
  // Check for the 4 main metrics: Nodes, Pods, Services, Operators
  const metricsGrid = clusterOverview.locator('div[class*="grid-cols-2"]').or(
    clusterOverview.locator('div[class*="grid-cols-4"]')
  );
  await expect(metricsGrid).toBeVisible();
  
  // Verify we have the metric labels within the cluster overview
  // Use more specific selectors to avoid multiple matches
  const nodeLabel = clusterOverview.locator('div.text-sm.text-gray-500:has-text("Nodes")');
  const podLabel = clusterOverview.locator('div.text-sm.text-gray-500:has-text("Pods")');
  const serviceLabel = clusterOverview.locator('div.text-sm.text-gray-500:has-text("Services")');
  const operatorLabel = clusterOverview.locator('div.text-sm.text-gray-500:has-text("Operators")');
  
  await expect(nodeLabel).toBeVisible();
  await expect(podLabel).toBeVisible();
  await expect(serviceLabel).toBeVisible();
  await expect(operatorLabel).toBeVisible();
  
  // Check for StatusIndicator components (green checkmarks or other status icons)
  const statusIndicators = page.locator('svg[class*="text-green-600"], svg[class*="text-red-600"], svg[class*="text-yellow-600"]');
  const statusCount = await statusIndicators.count();
  
  // Should have at least one status indicator (cluster status)
  expect(statusCount).toBeGreaterThan(0);
  
  // Check ResourceSummary component
  const resourceSummary = page.locator('h3:has-text("Resource Summary")').locator('xpath=ancestor::div[contains(@class, "card")]');
  await expect(resourceSummary).toBeVisible();
  
  // Check for resource usage bars (CPU, Memory, Storage)
  const resourceBars = resourceSummary.locator('div[class*="bg-blue-500"], div[class*="bg-green-500"], div[class*="bg-purple-500"]');
  const barCount = await resourceBars.count();
  expect(barCount).toBeGreaterThan(0);
  
  // Check OperatorGrid component
  const operatorGrid = page.locator('h3:has-text("Operators")').locator('xpath=ancestor::div[contains(@class, "card")]');
  await expect(operatorGrid).toBeVisible();
  
  // Check QuickActions component
  const quickActions = page.locator('h3:has-text("Quick Actions")').locator('xpath=ancestor::div[contains(@class, "card")]');
  await expect(quickActions).toBeVisible();
  
  // Check RecentActivity component
  const recentActivity = page.locator('h3:has-text("Recent Activity")').locator('xpath=ancestor::div[contains(@class, "card")]');
  await expect(recentActivity).toBeVisible();
  
  console.log('Cluster health verification completed successfully');
}

/**
 * Wait for operator installation to complete
 */
export async function waitForOperatorInstallation(page: Page, operatorName: string, timeout = 30000) {
  console.log(`Waiting for operator installation: ${operatorName}`);
  
  try {
    // Find operator card
    const operatorCard = page.locator(`h3:has-text("${operatorName}")`).first();
    await expect(operatorCard).toBeVisible({ timeout: 10000 });
    
    // Find the Switch component - it's in the same card container
    const cardContainer = operatorCard.locator('xpath=ancestor::div[contains(@class, "rounded-lg")]').first();
    const switchElement = cardContainer.locator('button[role="switch"]').first();
    
    // Wait for switch to be visible and checked
    await expect(switchElement).toBeVisible({ timeout: 5000 });
    
    // Wait for the switch to be checked (installed)
    await expect(switchElement).toHaveAttribute('aria-checked', 'true', { timeout });
    
    console.log(`Operator ${operatorName} installation completed`);
    return true;
  } catch (error) {
    console.log(`Operator ${operatorName} installation timeout after ${timeout}ms`);
    return false;
  }
}

/**
 * Set namespace to "all" using the namespace switcher
 */
export async function setNamespaceToAll(page: Page) {
  console.log('Setting namespace to "all"');
  
  // Look for the namespace selector - it's a button with role="combobox" that contains "Namespace:" in its parent
  const namespaceSelector = page.locator('[role="combobox"]').filter({ hasText: /default|all/i });
  await expect(namespaceSelector).toBeVisible({ timeout: 10000 });
  console.log('Found namespace selector');
  
  // Click on the namespace selector to open the dropdown
  await namespaceSelector.click();
  console.log('Clicked namespace selector');
  
  // Wait for the dropdown to appear and select "All Namespaces" option
  // The option has value="All Namespaces All" and contains "All Namespaces All" text
  const allNamespacesOption = page.getByRole('option', { name: /all namespaces all/i });
  await expect(allNamespacesOption).toBeVisible({ timeout: 5000 });
  console.log('Found All Namespaces option');
  
  await allNamespacesOption.click();
  console.log('Clicked All Namespaces option');
  
  // Wait for the page to update after namespace change
  await page.waitForLoadState('networkidle');
  
  console.log('Namespace set to "all" successfully');
}

/**
 * Set namespace to a specific namespace using the namespace switcher
 */
export async function setNamespaceTo(page: Page, namespace: string) {
  console.log(`Setting namespace to "${namespace}"`);
  
  // Look for the namespace selector
  const namespaceSelector = page.locator('[role="combobox"]').filter({ hasText: /default|all|cert-manager|cnpg|postgres/i });
  await expect(namespaceSelector).toBeVisible({ timeout: 10000 });
  console.log('Found namespace selector');
  
  // Click on the namespace selector to open the dropdown
  await namespaceSelector.click();
  console.log('Clicked namespace selector');
  
  // Wait for the dropdown to appear and select the specific namespace option
  const namespaceOption = page.getByRole('option', { name: new RegExp(namespace, 'i') });
  await expect(namespaceOption).toBeVisible({ timeout: 5000 });
  console.log(`Found ${namespace} option`);
  
  await namespaceOption.click();
  console.log(`Clicked ${namespace} option`);
  
  // Wait for the page to update after namespace change
  await page.waitForLoadState('networkidle');
  
  console.log(`Namespace set to "${namespace}" successfully`);
}

/**
 * Check if a specific namespace has deployments
 */
export async function checkNamespaceHasDeployments(page: Page, namespace: string) {
  console.log(`Checking if namespace "${namespace}" has deployments`);
  
  // Navigate to deployments page
  await page.goto('/i/deployments');
  await verifyPageLoadedSuccessfully(page, /i\/deployments/, 'deployments');
  
  // Set namespace to the specific namespace
  await setNamespaceTo(page, namespace);
  
  // Wait for the table to load after namespace change
  await page.waitForLoadState('networkidle');
  
  // Check if there are any deployments in the table
  // Since we've set the namespace filter, all visible rows should be from that namespace
  const deploymentRows = page.locator('tbody tr');
  const rowCount = await deploymentRows.count();
  
  console.log(`Found ${rowCount} deployments in namespace "${namespace}"`);
  
  // Use expect to assert that there are deployments in this namespace
  expect(rowCount).toBeGreaterThan(0);
  
  return rowCount > 0;
}

/**
 * Check if a specific namespace has services
 */
export async function checkNamespaceHasServices(page: Page, namespace: string) {
  console.log(`Checking if namespace "${namespace}" has services`);
  
  // Navigate to services page
  await page.goto('/i/services');
  await verifyPageLoadedSuccessfully(page, /i\/services/, 'services');
  
  // Set namespace to the specific namespace
  await setNamespaceTo(page, namespace);
  
  // Wait for the table to load after namespace change
  await page.waitForLoadState('networkidle');
  
  // Check if there are any services in the table
  // Since we've set the namespace filter, all visible rows should be from that namespace
  const serviceRows = page.locator('tbody tr');
  const rowCount = await serviceRows.count();
  
  console.log(`Found ${rowCount} services in namespace "${namespace}"`);
  
  // Use expect to assert that there are services in this namespace
  expect(rowCount).toBeGreaterThan(0);
  
  return rowCount > 0;
}

/**
 * Check if a specific namespace has pods
 */
export async function checkNamespaceHasPods(page: Page, namespace: string) {
  console.log(`Checking if namespace "${namespace}" has pods`);
  
  // Navigate to pods page
  await page.goto('/i/pods');
  await verifyPageLoadedSuccessfully(page, /i\/pods/, 'pods');
  
  // Set namespace to the specific namespace
  await setNamespaceTo(page, namespace);
  
  // Wait for the table to load after namespace change
  await page.waitForLoadState('networkidle');
  
  // Check if there are any pods in the table
  // Since we've set the namespace filter, all visible rows should be from that namespace
  const podRows = page.locator('tbody tr');
  const rowCount = await podRows.count();
  
  console.log(`Found ${rowCount} pods in namespace "${namespace}"`);
  
  // Use expect to assert that there are pods in this namespace
  expect(rowCount).toBeGreaterThan(0);
  
  return rowCount > 0;
}

/**
 * Check if a specific namespace has configMaps
 */
export async function checkNamespaceHasConfigMaps(page: Page, namespace: string) {
  console.log(`Checking if namespace "${namespace}" has configMaps`);
  
  // Navigate to configMaps page
  await page.goto('/i/configmaps');
  await verifyPageLoadedSuccessfully(page, /i\/configmaps/, 'configmaps');
  
  // Set namespace to the specific namespace
  await setNamespaceTo(page, namespace);
  
  // Wait for the table to load after namespace change
  await page.waitForLoadState('networkidle');
  
  // Check if there are any configMaps in the table
  // Since we've set the namespace filter, all visible rows should be from that namespace
  const configMapRows = page.locator('tbody tr');
  const rowCount = await configMapRows.count();
  
  console.log(`Found ${rowCount} configMaps in namespace "${namespace}"`);
  
  // Use expect to assert that there are configMaps in this namespace
  expect(rowCount).toBeGreaterThan(0);
  
  return rowCount > 0;
}

/**
 * Clean up test resources
 */
export async function cleanupTestResources(page: Page, resourceName: string) {
  // Navigate to deployments to clean up
  await page.goto('/i/deployments');
  
  // Look for the test resource
  const resourceRow = page.locator(`tr:has-text("${resourceName}")`);
  
  // Only proceed if resource exists
  if (await resourceRow.isVisible()) {
    // Look for delete button
    const deleteButton = resourceRow.getByRole('button', { name: /delete|remove/i });
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion if dialog appears
      const confirmDialog = page.getByRole('dialog');
      if (await confirmDialog.isVisible()) {
        const confirmButton = page.getByRole('button', { name: /confirm|delete|yes/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
      }
    }
  }
}
