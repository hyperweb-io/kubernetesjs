import chalk from 'chalk';

// Default Kubernetes API endpoint
export const DEFAULT_K8S_API_ENDPOINT = 'http://127.0.0.1:8001';

// Operator namespace mappings
export const OPERATOR_NAMESPACES: Record<string, string[]> = {
  'knative-serving': ['knative-serving', 'kourier-system'],
  'cert-manager': ['cert-manager'],
  'ingress-nginx': ['ingress-nginx'],
  'cloudnative-pg': ['cnpg-system'],
  'kube-prometheus-stack': ['monitoring']
};

// Operator cluster-scoped resources
export const OPERATOR_CLUSTER_RESOURCES: Record<string, {
  crds: string[];
  clusterRoles: string[];
  clusterRoleBindings: string[];
  webhooks: string[];
}> = {
  'knative-serving': {
    crds: [
      'certificates.networking.internal.knative.dev',
      'configurations.serving.knative.dev',
      'clusterdomainclaims.networking.internal.knative.dev',
      'domainmappings.serving.knative.dev',
      'ingresses.networking.internal.knative.dev',
      'metrics.autoscaling.internal.knative.dev',
      'podautoscalers.autoscaling.internal.knative.dev',
      'revisions.serving.knative.dev',
      'routes.serving.knative.dev',
      'serverlessservices.networking.internal.knative.dev',
      'services.serving.knative.dev',
      'images.caching.internal.knative.dev'
    ],
    clusterRoles: [
      'knative-serving-activator-cluster',
      'knative-serving-addressable-resolver',
      'knative-serving-admin',
      'knative-serving-aggregated-addressable-resolver',
      'knative-serving-core',
      'knative-serving-namespaced-admin',
      'knative-serving-namespaced-edit',
      'knative-serving-namespaced-view',
      'knative-serving-podspecable-binding'
    ],
    clusterRoleBindings: [
      'knative-serving-activator-cluster',
      'knative-serving-controller-addressable-resolver',
      'knative-serving-controller-admin'
    ],
    webhooks: [
      'config.webhook.serving.knative.dev',
      'validation.webhook.serving.knative.dev',
      'webhook.serving.knative.dev'
    ]
  },
  'cert-manager': {
    crds: [
      'certificaterequests.cert-manager.io',
      'certificates.cert-manager.io',
      'challenges.acme.cert-manager.io',
      'clusterissuers.cert-manager.io',
      'issuers.cert-manager.io',
      'orders.acme.cert-manager.io'
    ],
    clusterRoles: [
      'cert-manager-cainjector',
      'cert-manager-controller-approve:cert-manager-io',
      'cert-manager-controller-certificates',
      'cert-manager-controller-certificatesigningrequests',
      'cert-manager-controller-challenges',
      'cert-manager-controller-clusterissuers',
      'cert-manager-controller-ingress-shim',
      'cert-manager-controller-issuers',
      'cert-manager-controller-orders',
      'cert-manager-edit',
      'cert-manager-view',
      'cert-manager-webhook:subjectaccessreviews'
    ],
    clusterRoleBindings: [
      'cert-manager-cainjector',
      'cert-manager-controller-approve:cert-manager-io',
      'cert-manager-controller-certificates',
      'cert-manager-controller-certificatesigningrequests',
      'cert-manager-controller-challenges',
      'cert-manager-controller-clusterissuers',
      'cert-manager-controller-ingress-shim',
      'cert-manager-controller-issuers',
      'cert-manager-controller-orders',
      'cert-manager-webhook:subjectaccessreviews'
    ],
    webhooks: [
      'cert-manager-webhook'
    ]
  },
  'ingress-nginx': {
    crds: [],
    clusterRoles: [
      'ingress-nginx',
      'ingress-nginx-admission'
    ],
    clusterRoleBindings: [
      'ingress-nginx',
      'ingress-nginx-admission'
    ],
    webhooks: [
      'ingress-nginx-admission'
    ]
  },
  'cloudnative-pg': {
    crds: [
      'clusterimagecatalogs.postgresql.cnpg.io',
      'clusters.postgresql.cnpg.io',
      'databases.postgresql.cnpg.io',
      'imagecatalogs.postgresql.cnpg.io',
      'poolers.postgresql.cnpg.io',
      'publications.postgresql.cnpg.io',
      'scheduledbackups.postgresql.cnpg.io',
      'subscriptions.postgresql.cnpg.io'
    ],
    clusterRoles: [
      'cnpg-database-editor-role',
      'cnpg-database-viewer-role',
      'cnpg-manager',
      'cnpg-publication-editor-role',
      'cnpg-publication-viewer-role',
      'cnpg-subscription-editor-role',
      'cnpg-subscription-viewer-role'
    ],
    clusterRoleBindings: [
      'cnpg-manager-rolebinding'
    ],
    webhooks: [
      'cnpg-validating-webhook-configuration',
      'cnpg-mutating-webhook-configuration'
    ]
  },
  'kube-prometheus-stack': {
    crds: [],
    clusterRoles: [],
    clusterRoleBindings: [],
    webhooks: []
  }
};

/**
 * Get the API endpoint to use, preferring the provided restEndpoint over the default
 */
export function getApiEndpoint(restEndpoint?: string): string {
  return restEndpoint || DEFAULT_K8S_API_ENDPOINT;
}

/**
 * Get namespaces for enabled operators
 */
export function getOperatorNamespaces(config: any): string[] {
  return config.spec.operators
    .filter((op: any) => op.enabled)
    .flatMap((op: any) => OPERATOR_NAMESPACES[op.name] || []);
}

/**
 * Wait for namespace to be deleted or finish terminating
 */
export async function waitForNamespaceDeletion(
  namespace: string, 
  apiEndpoint: string,
  maxAttempts: number = 60,
  intervalMs: number = 5000
): Promise<void> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      const response = await fetch(`${apiEndpoint}/api/v1/namespaces/${namespace}`);
      
      if (response.status === 404) {
        // Namespace doesn't exist, which is what we want
        console.log(chalk.green(`✓ Namespace ${namespace} successfully deleted`));
        return;
      }
      
      if (response.ok) {
        const ns = await response.json();
        
        if (ns.status?.phase === 'Terminating') {
          console.log(chalk.yellow(`⏳ Waiting for namespace ${namespace} to be deleted... (${attempts}/${maxAttempts})`));
        } else {
          // Namespace exists but is not terminating - this might indicate an issue
          console.log(chalk.yellow(`⏳ Waiting for namespace ${namespace} to be deleted... (${attempts}/${maxAttempts}) - Status: ${ns.status?.phase || 'Active'}`));
        }
      } else {
        // Other HTTP errors, log but continue retrying
        console.log(chalk.yellow(`⏳ Waiting for namespace ${namespace} to be deleted... (${attempts}/${maxAttempts}) - HTTP ${response.status}`));
      }
    } catch (error: any) {
      // Network or other errors, log but continue retrying
      console.log(chalk.yellow(`⏳ Waiting for namespace ${namespace} to be deleted... (${attempts}/${maxAttempts}) - Error: ${error.message}`));
    }
    
    // If we haven't reached max attempts, wait before next check
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  // If we reach here, we've exceeded max attempts
  const timeoutMs = maxAttempts * intervalMs;
  throw new Error(`Timeout waiting for namespace ${namespace} to be deleted after ${timeoutMs}ms`);
}

/**
 * Wait for multiple namespaces to be deleted
 */
export async function waitForNamespacesDeletion(
  namespaces: string[], 
  apiEndpoint: string,
  maxAttempts: number = 60,
  intervalMs: number = 5000
): Promise<void> {
  for (const namespace of namespaces) {
    await waitForNamespaceDeletion(namespace, apiEndpoint, maxAttempts, intervalMs);
  }
}

/**
 * Delete a namespace
 */
export async function deleteNamespace(
  namespace: string, 
  apiEndpoint: string,
  continueOnError: boolean = true
): Promise<void> {
  try {
    console.log(chalk.yellow(`Deleting namespace: ${namespace}`));
    const response = await fetch(`${apiEndpoint}/api/v1/namespaces/${namespace}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok || response.status === 404) {
      console.log(chalk.green(`✓ Namespace ${namespace} deletion initiated`));
    } else {
      const errorText = await response.text();
      console.log(chalk.red(`✗ Failed to delete namespace ${namespace}: HTTP ${response.status} - ${errorText}`));
      if (!continueOnError) {
        throw new Error(`Failed to delete namespace ${namespace}: HTTP ${response.status}`);
      }
    }
  } catch (error: any) {
    const errorMsg = `Error deleting namespace ${namespace}: ${error.message}`;
    console.log(chalk.red(`✗ ${errorMsg}`));
    if (!continueOnError) {
      throw new Error(errorMsg);
    }
  }
}

/**
 * Check if namespace exists and get its status
 */
export async function checkNamespaceStatus(
  namespace: string, 
  apiEndpoint: string
): Promise<{ exists: boolean; phase?: string }> {
  try {
    const response = await fetch(`${apiEndpoint}/api/v1/namespaces/${namespace}`);
    
    if (response.status === 404) {
      return { exists: false };
    }
    
    if (response.ok) {
      const ns = await response.json();
      return { exists: true, phase: ns.status?.phase };
    }
    
    throw new Error(`HTTP ${response.status}`);
  } catch (error: any) {
    throw new Error(`Error checking namespace ${namespace}: ${error.message}`);
  }
}

/**
 * Force delete namespace by removing finalizers if stuck
 */
export async function forceDeleteNamespace(
  namespace: string, 
  apiEndpoint: string,
  continueOnError: boolean = true
): Promise<void> {
  try {
    // Check if namespace exists first
    const checkResponse = await fetch(`${apiEndpoint}/api/v1/namespaces/${namespace}`);
    
    if (checkResponse.status === 404) {
      // Namespace doesn't exist, skip
      return;
    }
    
    if (checkResponse.ok) {
      const ns = await checkResponse.json();
      
      // If namespace is already terminating, wait for it
      if (ns.status?.phase === 'Terminating') {
        console.log(chalk.yellow(`⏳ Namespace ${namespace} is already terminating, waiting...`));
        return;
      }
      
      // Delete the namespace
      await deleteNamespace(namespace, apiEndpoint, continueOnError);
    }
  } catch (error: any) {
    console.log(chalk.yellow(`Warning: Error checking/deleting namespace ${namespace}: ${error.message}`));
    if (!continueOnError) {
      throw error;
    }
  }
}