import { test, expect } from '@playwright/test';
import { 
  setNamespaceTo,
  createDeployment,
  verifyDeploymentCreated,
  testDeploymentUI,
  deleteDeployment,
  verifyDeploymentDeleted,
  checkDeploymentPods
} from './utils/deployment-helpers';
import { 
  verifyClusterState, 
  waitForDeploymentReady, 
  waitForPodReady,
  cleanupResources 
} from './utils/cluster-verification';

test.describe('Workflow 2: Deployment Lifecycle Management', () => {
  
  test('Complete Deployment Lifecycle Management Workflow', async ({ page }) => {
    const timestamp = Date.now();
    const deploymentName = `test-deployment-lifecycle-${timestamp}`;
    const namespace = 'default';

    // Step 1: Navigate to infrastructure/deployments
    await test.step('1. Navigate to infrastructure/deployments', async () => {
      await page.goto('/i/deployments');
      await page.waitForLoadState('networkidle');
      
      // Set namespace to default for this test
      await setNamespaceTo(page, namespace);
      
      // Verify we're on the deployments page - use more specific selector
      await expect(page.locator('main h2:has-text("Deployments")')).toBeVisible();
      await page.screenshot({ 
        path: `test-results/screenshots/step1-deployments-page-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 2: Create new deployment
    await test.step('2. Create new deployment', async () => {
      await createDeployment(page, deploymentName, {
        image: 'nginx:latest',
        replicas: 2,
        port: 80
      });
      
      await page.screenshot({ 
        path: `test-results/screenshots/step2-deployment-created-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 3: Verify deployment was created
    await test.step('3. Verify deployment was created', async () => {
      await verifyDeploymentCreated(page, deploymentName, namespace);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step3-deployment-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 4: Verify related pods are created
    await test.step('4. Verify related pods are created', async () => {
      // Check if pods exist for our deployment (should have 2 pods for 2 replicas)
      const podResult = await checkDeploymentPods(page, deploymentName, namespace, 2);
      expect(podResult.exists).toBe(true);
      expect(podResult.count).toBe(2);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step4-pods-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 5: Verify related services are created (if any)
    await test.step('5. Verify related services are created', async () => {
      // Navigate to services page
      await page.goto('/i/services');
      await setNamespaceTo(page, namespace);
      
      // Check if service exists for our deployment (may or may not exist)
      const serviceExists = await page.locator(`tbody tr:has-text("${deploymentName}")`).isVisible();
      // Note: Services might not be created automatically, so we just log the result
      console.log(`Service for ${deploymentName} exists: ${serviceExists}`);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step5-services-checked-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 6: Test interactive buttons and UI controls
    await test.step('6. Test interactive buttons and UI controls', async () => {
      // Go back to deployments page
      await page.goto('/i/deployments');
      await setNamespaceTo(page, namespace);
      
      await testDeploymentUI(page, deploymentName);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step6-ui-tested-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 7: Delete deployment
    await test.step('7. Delete deployment', async () => {
      await deleteDeployment(page, deploymentName, namespace);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step7-deployment-deleted-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 8: Verify cleanup
    await test.step('8. Verify cleanup', async () => {
      await verifyDeploymentDeleted(page, deploymentName, namespace);
      
      await page.screenshot({ 
        path: `test-results/screenshots/step8-cleanup-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 9: Verify cluster state through API
    await test.step('9. Verify cluster state through API', async () => {
      // Verify deployment is deleted through API
      const clusterStateValid = await verifyClusterState(page, {
        deployments: [] // No deployments should exist
      });
      expect(clusterStateValid).toBe(true);
    });

    // Step 10: Final cleanup
    await test.step('10. Final cleanup', async () => {
      await cleanupResources(page, namespace);
      console.log('Final cleanup completed');
    });
  });

  // Quick test for deployment creation only
  test('Deployment Creation Quick Test', async ({ page }) => {
    const timestamp = Date.now();
    const deploymentName = `quick-test-deployment-${timestamp}`;
    const namespace = 'default';

    await page.goto('/i/deployments');
    await setNamespaceTo(page, namespace);
    await createDeployment(page, deploymentName, {
      image: 'nginx:latest',
      replicas: 1,
      port: 80
    });
    
    // Clean up
    await deleteDeployment(page, deploymentName, namespace);
  });
});
