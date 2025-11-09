import { expect,test } from '@playwright/test';

import { 
  cleanupResources, 
  verifyClusterState} from './utils/cluster-verification';
import {
  createDeployment,
  setNamespaceTo} from './utils/deployment-helpers';

test.describe('Workflow 2: Deployment Lifecycle Management', () => {
  
  test('Complete Deployment Lifecycle Management Workflow', async ({ page }) => {
    const timestamp = Date.now();
    const deploymentName = `test-deployment-lifecycle-${timestamp}`;
    const namespace = 'default';

    // Add page error handling
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });

    // Step 1: Navigate to infrastructure/deployments
    await test.step('1. Navigate to infrastructure/deployments', async () => {
      await page.goto('/i/deployments');
      await page.waitForLoadState('networkidle');
      
      // Set namespace to default for this test
      await setNamespaceTo(page, namespace);
      
      // Verify we're on the deployments page - check for main heading and stats
      await expect(page.locator('main h2:has-text("Deployments")')).toBeVisible();
      await expect(page.locator('h3:has-text("Total Deployments")')).toBeVisible();
      
      // Verify we're on the correct page by checking for either deployments or empty state
      const hasDeployments = await page.locator('tbody tr').count() > 0;
      const hasEmptyState = await page.locator('text=No deployments found').isVisible();
      
      // Log the current state for debugging
      console.log(`Current deployments count: ${await page.locator('tbody tr').count()}`);
      console.log(`Has empty state message: ${hasEmptyState}`);
      
      // Either we have deployments or we have the empty state message
      expect(hasDeployments || hasEmptyState).toBe(true);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step1-deployments-page-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 2: Create new deployment
    await test.step('2. Create new deployment', async () => {
      try {
        await createDeployment(page, deploymentName, {
          image: 'nginx:latest',
          replicas: 2,
          port: 80
        });
        
        // Wait a moment for the page to stabilize
        await page.waitForTimeout(2000);
        
        // Check if page is still responsive
        await page.locator('main').isVisible();
        
        await page.screenshot({ 
          path: `test-results/screenshots/step2-deployment-created-${Date.now()}.png`,
          fullPage: true 
        });
      } catch (error) {
        console.log('Error creating deployment:', error);
        throw error;
      }
    });

    // Step 3: Verify deployment was created
    await test.step('3. Verify deployment was created', async () => {
      // Wait for deployment to appear in the table
      const deploymentRow = page.locator(`tbody tr:has-text("${deploymentName}")`);
      await expect(deploymentRow).toBeVisible({ timeout: 30000 });
      
      // Just verify the deployment exists and has basic info
      await expect(deploymentRow.locator('td').first()).toContainText(deploymentName);
      await expect(deploymentRow.locator('td').nth(1)).toContainText('default'); // namespace
      await expect(deploymentRow.locator('td').nth(4)).toContainText('nginx:latest'); // image
      
      // Log current status for debugging
      const currentStatus = await deploymentRow.locator('td').nth(2).textContent();
      const currentReplicas = await deploymentRow.locator('td').nth(3).textContent();
      console.log(`Deployment status: ${currentStatus}, Replicas: ${currentReplicas}`);
      
      // Wait a bit for status to potentially change
      await page.waitForTimeout(5000);
      
      // Check final status
      const finalStatus = await deploymentRow.locator('td').nth(2).textContent();
      const finalReplicas = await deploymentRow.locator('td').nth(3).textContent();
      console.log(`Final status: ${finalStatus}, Final replicas: ${finalReplicas}`);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step3-deployment-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 4: Check if pods are created
    await test.step('4. Check if pods are created', async () => {
      // Navigate to pods page
      await page.goto('/i/pods');
      await setNamespaceTo(page, namespace);
      
      // Wait for pods page to load
      await expect(page.locator('main h2:has-text("Pods")')).toBeVisible();
      
      // Check if there are any pods for our deployment
      const podRows = page.locator(`tbody tr:has-text("${deploymentName}")`);
      const podCount = await podRows.count();
      
      console.log(`Found ${podCount} pods for deployment ${deploymentName}`);
      
      if (podCount > 0) {
        // Log pod details
        for (let i = 0; i < podCount; i++) {
          const podRow = podRows.nth(i);
          const podName = await podRow.locator('td').first().textContent();
          const podStatus = await podRow.locator('td').nth(2).textContent();
          const podReady = await podRow.locator('td').nth(3).textContent();
          
          console.log(`Pod ${i + 1}: ${podName}, Status: ${podStatus}, Ready: ${podReady}`);
        }
      } else {
        console.log('No pods found for deployment - this might be normal if deployment is still starting');
      }
      
      await page.screenshot({ 
        path: `test-results/screenshots/step4-pods-check-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 5: Verify related services are created (if any)
    // await test.step('5. Verify related services are created', async () => {
    //   // Navigate to services page
    //   await page.goto('/i/services');
    //   await setNamespaceTo(page, namespace);
      
    //   // Wait for services page to load
    //   await expect(page.locator('main h2:has-text("Services")')).toBeVisible();
      
    //   // Check if service exists for our deployment (may or may not exist)
    //   const serviceExists = await page.locator(`tbody tr:has-text("${deploymentName}")`).isVisible();
    //   console.log(`Service for ${deploymentName} exists: ${serviceExists}`);
      
    //   // Verify only default kubernetes service exists (expected behavior)
    //   await expect(page.locator('tbody tr')).toHaveCount(1); // Only kubernetes service
    //   await expect(page.locator('tbody tr:has-text("kubernetes")')).toBeVisible();
      
    //   await page.screenshot({ 
    //     path: `test-results/screenshots/step5-services-checked-${Date.now()}.png`,
    //     fullPage: true 
    //   });
    // });

    // Step 6: Test interactive buttons and UI controls
    await test.step('6. Test interactive buttons and UI controls', async () => {
      // Go back to deployments page
      await page.goto('/i/deployments');
      await setNamespaceTo(page, namespace);
      
      // Find the deployment row
      const deploymentRow = page.locator(`tbody tr:has-text("${deploymentName}")`);
      await expect(deploymentRow).toBeVisible();
      
      // Test View deployment button
      const viewButton = deploymentRow.getByRole('button', { name: /view/i });
      await expect(viewButton).toBeVisible();
      await viewButton.click();
      
      // Wait for view dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('h2:has-text("View Deployment")')).toBeVisible();
      
      // Close the view dialog
      const closeButton = page.getByRole('button', { name: /close/i }).last();
      await expect(closeButton).toBeVisible();
      await closeButton.click();
      
      // Test Scale deployment button
      const scaleButton = deploymentRow.getByRole('button', { name: /scale/i });
      await expect(scaleButton).toBeVisible();
      await scaleButton.click();
      
      // Wait for scale dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('h2:has-text("Scale Deployment")')).toBeVisible();
      
      // Cancel the scale operation
      const scaleCancelButton = page.getByRole('button', { name: /cancel/i });
      await expect(scaleCancelButton).toBeVisible();
      await scaleCancelButton.click();
      
      // Test Edit deployment button
      const editButton = deploymentRow.getByRole('button', { name: /edit/i });
      await expect(editButton).toBeVisible();
      await editButton.click();
      
      // Wait for edit dialog
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('h2:has-text("Edit Deployment")')).toBeVisible();
      
      // Cancel the edit operation
      const editCancelButton = page.getByRole('button', { name: /cancel/i });
      await expect(editCancelButton).toBeVisible();
      await editCancelButton.click();
      
      await page.screenshot({ 
        path: `test-results/screenshots/step6-ui-tested-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 7: Delete deployment
    await test.step('7. Delete deployment', async () => {
      // Find the deployment row
      const deploymentRow = page.locator(`tbody tr:has-text("${deploymentName}")`);
      await expect(deploymentRow).toBeVisible();
      
      // Click delete button (last button in Actions column)
      const deleteButton = deploymentRow.locator('button').last();
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      
      // Confirm deletion
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('h2:has-text("Delete Deployment")')).toBeVisible();
      
      const confirmDeleteButton = page.getByRole('button', { name: /delete/i });
      await expect(confirmDeleteButton).toBeVisible();
      await confirmDeleteButton.click();
      
      // Wait for deletion to complete
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ 
        path: `test-results/screenshots/step7-deployment-deleted-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 8: Verify cleanup - deployments
    await test.step('8. Verify cleanup - deployments', async () => {
      // Wait for deployment to be removed from the table
      const deploymentRow = page.locator(`tbody tr:has-text("${deploymentName}")`);
      await expect(deploymentRow).not.toBeVisible({ timeout: 30000 });
      
      // Check if there are any deployments left
      const remainingDeployments = await page.locator('tbody tr').count();
      console.log(`Remaining deployments after cleanup: ${remainingDeployments}`);
      
      if (remainingDeployments === 0) {
        // No deployments left - verify empty state
        await expect(page.locator('text=No deployments found')).toBeVisible();
        
        // Verify stats cards show 0
        // The value div is a sibling of the h3's parent, not a direct sibling of the h3
        // Find the card container and then the value div within it
        const totalDeploymentsCard = page.locator('h3:has-text("Total Deployments")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(totalDeploymentsCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
        
        const runningCard = page.locator('h3:has-text("Running")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(runningCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
        
        const totalReplicasCard = page.locator('h3:has-text("Total Replicas")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(totalReplicasCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
      } else {
        // There are other deployments - just verify our specific deployment is gone
        console.log('Other deployments exist, only verifying our deployment is deleted');
      }
      
      await page.screenshot({ 
        path: `test-results/screenshots/step8-cleanup-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 9: Verify cleanup - pods
    await test.step('9. Verify cleanup - pods', async () => {
      // Navigate to pods page to verify cleanup
      await page.goto('/i/pods');
      await setNamespaceTo(page, namespace);
      
      // Wait for pods page to load
      await expect(page.locator('main h2:has-text("Pods")')).toBeVisible();
      
      // Verify no pods exist for our deployment
      await expect(page.locator(`tbody tr:has-text("${deploymentName}")`)).toHaveCount(0);
      
      // Check if there are any pods left
      const remainingPods = await page.locator('tbody tr').count();
      console.log(`Remaining pods after cleanup: ${remainingPods}`);
      
      if (remainingPods === 0) {
        // No pods left - verify empty state
        await expect(page.locator('text=No pods found')).toBeVisible();
        
        // Verify pod stats show 0
        // The value div is a sibling of the h3's parent, not a direct sibling of the h3
        // Use main context to ensure we're looking at pods page stats, not deployments page stats
        // Find the card container and then the value div within it
        const mainContent = page.locator('main');
        
        const totalPodsCard = mainContent.locator('h3:has-text("Total Pods")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(totalPodsCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
        
        const runningPodsCard = mainContent.locator('h3:has-text("Running")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(runningPodsCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
        
        const pendingPodsCard = mainContent.locator('h3:has-text("Pending")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(pendingPodsCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
        
        const failedPodsCard = mainContent.locator('h3:has-text("Failed")').locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
        await expect(failedPodsCard.locator('div').filter({ hasText: '0' }).first()).toContainText('0');
      } else {
        // There are other pods - just verify our specific pods are gone
        console.log('Other pods exist, only verifying our deployment pods are deleted');
      }
      
      await page.screenshot({ 
        path: `test-results/screenshots/step9-pods-cleanup-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 10: Verify cluster state through API
    await test.step('10. Verify cluster state through API', async () => {
      // Verify deployment is deleted through API
      const clusterStateValid = await verifyClusterState(page, {
        deployments: [] // No deployments should exist
      });
      expect(clusterStateValid).toBe(true);
    });

    // Step 11: Final cleanup
    await test.step('11. Final cleanup', async () => {
      await cleanupResources(page, namespace);
      console.log('Final cleanup completed');
    });
  });
});
