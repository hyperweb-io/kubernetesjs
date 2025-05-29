import { KubernetesClient } from '../src';

export interface CleanupConfig {
  namespace: string;
  name: string;
}

const defaultConfig: CleanupConfig = {
  namespace: 'default',
  name: 'postgres-pgvector'
};

export async function cleanupPostgres(
  client: KubernetesClient,
  config: Partial<CleanupConfig> = {}
) {
  const finalConfig = { ...defaultConfig, ...config };
  const { namespace, name } = finalConfig;

  try {
    // Check if deployment exists before trying to delete it
    try {
      await client.readAppsV1NamespacedDeployment({
        path: {
          namespace,
          name
        },
        query: {}
      });
      await client.deleteAppsV1NamespacedDeployment({
        path: {
          namespace,
          name
        },
        query: {}
      });
      console.log(`Deleted deployment ${name} in namespace ${namespace}`);
    } catch (error) {
      // Deployment doesn't exist, that's fine
      console.log(`Deployment ${name} not found in namespace ${namespace}`);
    }

    // Check if service exists before trying to delete it
    try {
      await client.readCoreV1NamespacedService({
        path: {
          namespace,
          name
        },
        query: {}
      });
      await client.deleteCoreV1NamespacedService({
        path: {
          namespace,
          name
        },
        query: {}
      });
      console.log(`Deleted service ${name} in namespace ${namespace}`);
    } catch (error) {
      // Service doesn't exist, that's fine
      console.log(`Service ${name} not found in namespace ${namespace}`);
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  }
} 