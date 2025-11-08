import { Page, expect } from '@playwright/test';
import { verifyPageLoadedSuccessfully } from './page-verification';

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
 * Deployment configuration interface
 */
export interface DeploymentConfig {
  image: string;
  replicas: number;
  port: number;
  labels?: Record<string, string>;
  env?: Record<string, string>;
}

/**
 * Create a new deployment using YAML editor
 */
export async function createDeployment(page: Page, name: string, config: DeploymentConfig) {
  console.log(`Creating deployment: ${name}`);
  
  // Look for create deployment button
  const createButton = page.getByRole('button', { name: /create.*deployment|new.*deployment/i });
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();
  
  // Wait for create deployment dialog
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: 5000 });
  
  // Wait for YAML editor to be visible
  const yamlEditor = page.locator('.monaco-editor').or(page.locator('[data-testid="yaml-editor"]')).or(page.locator('textarea'));
  await expect(yamlEditor).toBeVisible({ timeout: 10000 });
  
  // Generate YAML content with the provided name and config
  const yamlContent = generateDeploymentYAML(name, config);
  
  // Clear existing content and fill with new YAML
  await yamlEditor.click();
  
  // Try multiple methods to clear and fill the content
  try {
    // Method 1: Use fill() which should clear and set the content
    await yamlEditor.fill(yamlContent);
    console.log('Used fill() method successfully');
  } catch (error) {
    console.log('Fill method failed, trying keyboard method');
    try {
      // Method 2: Select all and replace
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type(yamlContent);
      console.log('Used keyboard method successfully');
    } catch (error2) {
      console.log('Keyboard method failed, trying triple click method');
      // Method 3: Triple click to select all
      await yamlEditor.click({ clickCount: 3 });
      await page.keyboard.press('Delete');
      await page.keyboard.type(yamlContent);
      console.log('Used triple click method successfully');
    }
  }
  
  // Submit the form
  const submitButton = page.getByRole('button', { name: /continue|create|submit/i });
  await expect(submitButton).toBeVisible({ timeout: 5000 });
  await submitButton.click();
  
  // Wait for deployment to be created
  await page.waitForLoadState('networkidle');
  
  console.log(`Deployment ${name} creation submitted`);
}

/**
 * Generate YAML content for deployment
 */
function generateDeploymentYAML(name: string, config: DeploymentConfig): string {
  const labels = config.labels || { app: name };
  const labelsYAML = Object.entries(labels)
    .map(([key, value]) => `    ${key}: ${value}`)
    .join('\n');
  
  const envVars = config.env || {};
  const envYAML = Object.keys(envVars).length > 0 
    ? Object.entries(envVars)
        .map(([key, value]) => `        - name: ${key}\n          value: ${value}`)
        .join('\n')
    : '';
  
  const envSection = envYAML ? `\n        env:\n${envYAML}` : '';
  
  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
  labels:
${labelsYAML}
spec:
  replicas: ${config.replicas}
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
      - name: ${name}-container
        image: ${config.image}
        ports:
        - containerPort: ${config.port}
        resources:
          limits:
            cpu: "100m"
            memory: "128Mi"
          requests:
            cpu: "50m"
            memory: "64Mi"${envSection}`;
}

/**
 * Verify deployment was created successfully
 */
export async function verifyDeploymentCreated(page: Page, name: string, namespace: string) {
  console.log(`Verifying deployment creation: ${name}`);
  
  // Navigate to deployments page
  await page.goto('/i/deployments');
  await setNamespaceTo(page, namespace);
  
  // Look for the deployment in the table
  const deploymentRow = page.locator(`tbody tr:has-text("${name}")`);
  await expect(deploymentRow).toBeVisible({ timeout: 30000 });
  
  // Verify the deployment name is displayed
  const deploymentNameCell = deploymentRow.locator('td').first();
  await expect(deploymentNameCell).toContainText(name);
  
  // Verify deployment status (should be Running or similar)
  const statusCell = deploymentRow.locator('td').nth(2); // Assuming status is in 3rd column
  await expect(statusCell).toBeVisible();
  
  console.log(`Deployment ${name} verified as created`);
}

/**
 * Test interactive buttons and UI controls for a deployment
 */
export async function testDeploymentUI(page: Page, name: string) {
  console.log(`Testing UI controls for deployment: ${name}`);
  
  // Find the deployment row
  const deploymentRow = page.locator(`tbody tr:has-text("${name}")`);
  await expect(deploymentRow).toBeVisible();
  
  // Test view deployment button
  const viewButton = deploymentRow.getByRole('button', { name: /view/i });
  await expect(viewButton).toBeVisible();
  await viewButton.click();
  console.log('Clicked view deployment button');
  
  // Wait for view dialog or page to load
  await page.waitForTimeout(2000);
  
  // Close the view dialog - use more specific selector to avoid strict mode violation
  const closeButton = page.locator('[role="dialog"]').getByRole('button', { name: /close/i }).first();
  await expect(closeButton).toBeVisible();
  await closeButton.click();
  console.log('Closed view dialog');
  
  // Test scale deployment button
  const scaleButton = deploymentRow.getByRole('button', { name: /scale/i });
  await expect(scaleButton).toBeVisible();
  await scaleButton.click();
  console.log('Clicked scale deployment button');
  
  // Wait for scale dialog
  const scaleDialog = page.getByRole('dialog');
  await expect(scaleDialog).toBeVisible();
  
  // Cancel the scale operation
  const scaleCancelButton = scaleDialog.getByRole('button', { name: /cancel/i });
  await expect(scaleCancelButton).toBeVisible();
  await scaleCancelButton.click();
  console.log('Cancelled scale operation');
  
  // Test edit deployment button
  const editButton = deploymentRow.getByRole('button', { name: /edit/i });
  await expect(editButton).toBeVisible();
  await editButton.click();
  console.log('Clicked edit deployment button');
  
  // Wait for edit dialog
  const editDialog = page.getByRole('dialog');
  await expect(editDialog).toBeVisible();
  
  // Cancel the edit operation
  const editCancelButton = editDialog.getByRole('button', { name: /cancel/i });
  await expect(editCancelButton).toBeVisible();
  await editCancelButton.click();
  console.log('Cancelled edit operation');
  
  console.log(`UI controls tested for deployment: ${name}`);
}

/**
 * Delete a deployment
 */
export async function deleteDeployment(page: Page, name: string, namespace: string) {
  console.log(`Deleting deployment: ${name}`);
  
  // Navigate to deployments page
  await page.goto('/i/deployments');
  await setNamespaceTo(page, namespace);
  
  // Find the deployment row
  const deploymentRow = page.locator(`tbody tr:has-text("${name}")`);
  await expect(deploymentRow).toBeVisible();
  
  // Look for delete button - it's the last button in the Actions cell (no text, just an icon)
  const deleteButton = deploymentRow.locator('button').last();
  await expect(deleteButton).toBeVisible({ timeout: 5000 });
  await deleteButton.click();
  
  // Confirm deletion if dialog appears
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible({ timeout: 5000 });
  
  const confirmButton = confirmDialog.getByRole('button', { name: /delete/i });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
  
  // Wait for deletion to complete
  await page.waitForLoadState('networkidle');
  
  console.log(`Deployment ${name} deletion submitted`);
}

/**
 * Verify deployment was deleted
 */
export async function verifyDeploymentDeleted(page: Page, name: string, namespace: string) {
  console.log(`Verifying deployment deletion: ${name}`);
  
  // Navigate to deployments page
  await page.goto('/i/deployments');
  await setNamespaceTo(page, namespace);
  
  // Wait for the deployment to be removed from the table
  const deploymentRow = page.locator(`tbody tr:has-text("${name}")`);
  await expect(deploymentRow).not.toBeVisible({ timeout: 30000 });
  
  console.log(`Deployment ${name} verified as deleted`);
}

/**
 * Check if a deployment exists
 */
export async function deploymentExists(page: Page, name: string, namespace: string): Promise<boolean> {
  await page.goto('/i/deployments');
  await setNamespaceTo(page, namespace);
  
  const deploymentRow = page.locator(`tbody tr:has-text("${name}")`);
  return await deploymentRow.isVisible();
}

/**
 * Check if pods exist for a deployment
 */
export async function checkDeploymentPods(page: Page, name: string, namespace: string, expectedCount?: number): Promise<{ exists: boolean; count: number }> {
  await page.goto('/i/pods');
  await setNamespaceTo(page, namespace);
  
  const podRows = page.locator(`tbody tr:has-text("${name}")`);
  const count = await podRows.count();
  const exists = count > 0;
  
  if (expectedCount !== undefined) {
    expect(count).toBe(expectedCount);
  }
  
  console.log(`Found ${count} pods for deployment ${name}`);
  return { exists, count };
}

/**
 * Get deployment status
 */
export async function getDeploymentStatus(page: Page, name: string, namespace: string): Promise<string | null> {
  await page.goto('/i/deployments');
  await setNamespaceTo(page, namespace);
  
  const deploymentRow = page.locator(`tbody tr:has-text("${name}")`);
  if (await deploymentRow.isVisible()) {
    const statusCell = deploymentRow.locator('td').nth(2); // Assuming status is in 3rd column
    return await statusCell.textContent();
  }
  
  return null;
}
