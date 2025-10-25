import { test, expect } from '@playwright/test';
import { 
  navigateToOperatorsPage, 
  installOperator, 
  verifyOperatorInstallation,
  createDatabase,
  verifyDatabaseCreated,
  snapshotAdminDashboard,
  validateInfrastructurePage,
  checkForResource,
  verifyClusterHealth,
  waitForOperatorInstallation,
  verifyOperatorInstalled,
  setNamespaceToAll,
  setNamespaceTo,
  checkNamespaceHasDeployments,
  checkNamespaceHasServices,
  checkNamespaceHasPods,
  checkNamespaceHasConfigMaps
} from './utils/workflow-helpers';
import { 
  verifyClusterState, 
  waitForDeploymentReady, 
  waitForPodReady,
  cleanupResources 
} from './utils/cluster-verification';

test.describe('Workflow 1: Operator Installation & Database Management (Focused)', () => {
  
  test('Complete Operator Installation & Database Management Workflow', async ({ page }) => {
    // Step 1: Open dashboard and navigate to admin/operators
    await test.step('1. Navigate to admin/operators', async () => {
      await navigateToOperatorsPage(page);
      await page.screenshot({ 
        path: `test-results/screenshots/step1-operators-page-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 2: Install cert-manager operator
    await test.step('2. Install cert-manager operator', async () => {
      await installOperator(page, 'cert-manager');
      await page.screenshot({ 
        path: `test-results/screenshots/step2-cert-manager-installed-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 3: Install cloudnative-pg operator
    await test.step('3. Install CloudNativePG operator', async () => {
      await installOperator(page, 'CloudNativePG');
      await page.screenshot({ 
        path: `test-results/screenshots/step3-cloudnative-pg-installed-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 4: Verify operator installation using interwebjs queries
    await test.step('4. Verify operator installation', async () => {
      // Wait for operators to be fully installed
      await waitForOperatorInstallation(page, 'cert-manager');
      await waitForOperatorInstallation(page, 'CloudNativePG');
      
      // Verify both operators
      await verifyOperatorInstallation(page, 'cert-manager');
      await verifyOperatorInstallation(page, 'CloudNativePG');

      await verifyOperatorInstalled('cert-manager');
      await verifyOperatorInstalled('cnpg');
      
      await page.screenshot({ 
        path: `test-results/screenshots/step4-operators-verified-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 5: Navigate to admin/database and create a database
    await test.step('5. Create database in admin/databases', async () => {
      await createDatabase(page, 'test-database-workflow');
      await page.screenshot({ 
        path: `test-results/screenshots/step5-database-created-${Date.now()}.png`,
        fullPage: true 
      });
    });

    // Step 5.5: Verify database was created successfully
    await test.step('5.5. Verify database creation', async () => {
      await verifyDatabaseCreated(page, 'postgres-db/postgres-cluster');
    });

    // Step 6: Snapshot test admin/dashboard cluster info pages
    await test.step('6. Snapshot admin dashboard cluster info', async () => {
      await snapshotAdminDashboard(page);
      await verifyClusterHealth(page);
    });

    // Step 7: Check infrastructure/deployments in specific namespaces
    await test.step('7. Validate infrastructure/deployments', async () => {
      // Check cert-manager namespace has deployments
      const certManagerHasDeployments = await checkNamespaceHasDeployments(page, 'cert-manager');
      expect(certManagerHasDeployments).toBe(true);
      
      // Check cnpg-system namespace has deployments
      const cnpgSystemHasDeployments = await checkNamespaceHasDeployments(page, 'cnpg-system');
      expect(cnpgSystemHasDeployments).toBe(true);
      
      // Check postgres-db namespace has deployments
      const postgresDbHasDeployments = await checkNamespaceHasDeployments(page, 'postgres-db');
      expect(postgresDbHasDeployments).toBe(true);
    });

    // Step 8: Validate infrastructure/services in specific namespaces
    await test.step('8. Validate infrastructure/services', async () => {
      // Check cert-manager namespace has services
      const certManagerHasServices = await checkNamespaceHasServices(page, 'cert-manager');
      expect(certManagerHasServices).toBe(true);
      
      // Check cnpg-system namespace has services
      const cnpgSystemHasServices = await checkNamespaceHasServices(page, 'cnpg-system');
      expect(cnpgSystemHasServices).toBe(true);
      
      // Check postgres-db namespace has services
      const postgresDbHasServices = await checkNamespaceHasServices(page, 'postgres-db');
      expect(postgresDbHasServices).toBe(true);
    });

    // Step 9: Validate infrastructure/pods in specific namespaces
    await test.step('9. Validate infrastructure/pods', async () => {
      // Check cert-manager namespace has pods
      const certManagerHasPods = await checkNamespaceHasPods(page, 'cert-manager');
      expect(certManagerHasPods).toBe(true);
      
      // Check cnpg-system namespace has pods
      const cnpgSystemHasPods = await checkNamespaceHasPods(page, 'cnpg-system');
      expect(cnpgSystemHasPods).toBe(true);
      
      // Check postgres-db namespace has pods
      const postgresDbHasPods = await checkNamespaceHasPods(page, 'postgres-db');
      expect(postgresDbHasPods).toBe(true);
    });

    // Step 10: Validate infrastructure/configs (configmaps) in specific namespaces
    await test.step('10. Validate infrastructure/configs', async () => {
      // Check cert-manager namespace has configMaps
      const certManagerHasConfigMaps = await checkNamespaceHasConfigMaps(page, 'cert-manager');
      expect(certManagerHasConfigMaps).toBe(true);
      
      // Check cnpg-system namespace has configMaps
      const cnpgSystemHasConfigMaps = await checkNamespaceHasConfigMaps(page, 'cnpg-system');
      expect(cnpgSystemHasConfigMaps).toBe(true);
      
      // Check postgres-db namespace has configMaps
      const postgresDbHasConfigMaps = await checkNamespaceHasConfigMaps(page, 'postgres-db');
      expect(postgresDbHasConfigMaps).toBe(true);
    });

    // Step 11: Final validation
    await test.step('11. Final validation', async () => {
      // Go back to admin dashboard for final overview
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Take final screenshot
      await page.screenshot({ 
        path: `test-results/screenshots/step11-workflow-completed-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Verify cluster health one more time
      await verifyClusterHealth(page);
    });

    // Step 12: Verify cluster state through API
    await test.step('12. Verify cluster state through API', async () => {
      const clusterStateValid = await verifyClusterState(page, {
        namespaces: ['cert-manager', 'cnpg-system', 'postgres-db'],
        deployments: [
          { name: 'cert-manager', namespace: 'cert-manager', replicas: 1, readyReplicas: 1, status: 'Available' },
          { name: 'cnpg-controller-manager', namespace: 'cnpg-system', replicas: 1, readyReplicas: 1, status: 'Available' }
        ]
      });
      expect(clusterStateValid).toBe(true);
    });

    // Step 13: Cleanup test resources
    await test.step('13. Cleanup test resources', async () => {
      await cleanupResources(page, 'postgres-db');
      console.log('Test resources cleaned up');
    });
  });

  // Quick test for operators page only
  test('Operators Page Quick Test', async ({ page }) => {
    await navigateToOperatorsPage(page);
    await installOperator(page, 'cert-manager');
  });
});
