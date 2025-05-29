import { KubernetesClient } from 'kubernetesjs';

const DEFAULT_ENDPOINT = 'http://localhost:8001';

export interface KubernetesConfig {
  restEndpoint?: string;
  namespace?: string;
}

let kubeClient: KubernetesClient | null = null;

/**
 * Get or create a Kubernetes client instance
 */
export function getKubernetesClient(config?: KubernetesConfig): KubernetesClient {
  if (!kubeClient) {
    kubeClient = new KubernetesClient({
      restEndpoint: config?.restEndpoint || DEFAULT_ENDPOINT
    });
  }
  return kubeClient;
}

/**
 * Get the current namespace or use the default
 */
export function getCurrentNamespace(config?: KubernetesConfig): string {
  return config?.namespace || 'default';
}

/**
 * Reset the Kubernetes client (useful for changing endpoints)
 */
export function resetKubernetesClient(): void {
  kubeClient = null;
}
