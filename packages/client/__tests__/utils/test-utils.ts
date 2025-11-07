import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';

/**
 * Ensures a namespace is ready for use by waiting for any terminating namespace to be fully deleted
 */
export async function ensureNamespaceReady(
  api: InterwebKubernetesClient, 
  name: string, 
  maxWaitMs = 180000 // 3 minutes
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    try {
      const res = await api.listCoreV1Namespace({ query: {} as any });
      const namespaces = res?.items || [];
      const ns = namespaces.find((n: any) => n?.metadata?.name === name);
      
      if (ns) {
        // Check if namespace is terminating
        if (ns?.status?.phase === 'Terminating') {
          console.log(`Waiting for namespace ${name} to finish terminating... (${Math.floor((Date.now() - startTime) / 1000)}s elapsed)`);
          await new Promise(r => setTimeout(r, 5000));
          continue;
        }
        
        // Namespace exists and is active
        if (ns?.status?.phase === 'Active') {
          console.log(`Namespace ${name} is ready`);
          return;
        }
      } else {
        // Namespace doesn't exist - we can proceed
        console.log(`Namespace ${name} does not exist - ready to create`);
        return;
      }
    } catch (err: any) {
      console.warn(`Error checking namespace ${name}:`, err.message);
    }
    
    await new Promise(r => setTimeout(r, 3000));
  }
  
  throw new Error(`Namespace ${name} not ready after ${maxWaitMs}ms`);
}

/**
 * Force delete a namespace and wait for it to be fully removed
 */
export async function forceDeleteNamespace(
  api: InterwebKubernetesClient, 
  name: string,
  maxWaitMs = 120000
): Promise<void> {
  try {
    // First try normal deletion
    await api.deleteCoreV1Namespace({ path: { name }, query: {} as any });
    console.log(`Initiated deletion of namespace ${name}`);
    
    // Wait for deletion to complete
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      try {
        const res = await api.listCoreV1Namespace({ query: {} as any });
        const namespaces = res?.items || [];
        const ns = namespaces.find((n: any) => n?.metadata?.name === name);
        
        if (ns?.status?.phase === 'Terminating') {
          console.log(`Waiting for namespace ${name} deletion to complete...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        } else if (!ns) {
          console.log(`Namespace ${name} successfully deleted`);
          return;
        }
      } catch (err: any) {
        console.warn(`Error checking namespace ${name} deletion:`, err.message);
      }
      
      await new Promise(r => setTimeout(r, 2000));
    }
    
    console.warn(`Namespace ${name} deletion timed out after ${maxWaitMs}ms`);
  } catch (err: any) {
    if (err?.message?.includes('404') || err?.message?.includes('not found')) {
      console.log(`Namespace ${name} already deleted`);
      return;
    }
    console.warn(`Error deleting namespace ${name}:`, err.message);
  }
}

/**
 * Ensure namespace exists and is ready, creating it if necessary
 */
export async function ensureNamespaceExists(
  api: InterwebKubernetesClient,
  name: string,
  maxWaitMs = 180000 // 3 minutes
): Promise<void> {
  try {
    const res = await api.listCoreV1Namespace({ query: {} as any });
    const namespaces = res?.items || [];
    const ns = namespaces.find((n: any) => n?.metadata?.name === name);
    
    if (ns) {
      if (ns?.status?.phase === 'Active') {
        console.log(`Namespace ${name} already exists and is active`);
        return;
      }
      if (ns?.status?.phase === 'Terminating') {
        console.log(`Namespace ${name} is terminating, waiting for deletion...`);
        await ensureNamespaceReady(api, name, maxWaitMs);
        // After it's deleted, create it again
        await createNamespace(api, name);
        return;
      }
    } else {
      // Create the namespace
      await createNamespace(api, name);
      return;
    }
  } catch (err: any) {
    console.warn(`Error checking namespace ${name}:`, err.message);
    // Try to create it anyway
    await createNamespace(api, name);
  }
}

/**
 * Helper function to create a namespace
 */
async function createNamespace(api: InterwebKubernetesClient, name: string): Promise<void> {
  const namespaceManifest = {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: name
    }
  };
  
  try {
    await api.createCoreV1Namespace({ 
      body: namespaceManifest as any,
      query: {} as any 
    });
    console.log(`Created namespace ${name}`);
    
    // Wait a bit for the namespace to be fully ready
    await new Promise(r => setTimeout(r, 2000));
  } catch (err: any) {
    if (err?.message?.includes('already exists')) {
      console.log(`Namespace ${name} already exists`);
      return;
    }
    throw err;
  }
}

/**
 * Clean up multiple namespaces in parallel
 */
export async function cleanupNamespaces(
  api: InterwebKubernetesClient,
  namespaces: string[]
): Promise<void> {
  const cleanupPromises = namespaces.map(ns => 
    forceDeleteNamespace(api, ns).catch(err => 
      console.warn(`Failed to cleanup namespace ${ns}:`, err.message)
    )
  );
  
  await Promise.all(cleanupPromises);
}

/**
 * Create a cleanup registry for tests
 */
export class TestCleanupRegistry {
  private cleanupTasks: (() => Promise<void>)[] = [];

  register(cleanup: () => Promise<void>): void {
    this.cleanupTasks.push(cleanup);
  }

  async cleanup(): Promise<void> {
    // Run cleanup tasks in reverse order (LIFO)
    for (const cleanup of this.cleanupTasks.reverse()) {
      try {
        await cleanup();
      } catch (err: any) {
        console.warn('Cleanup error:', err.message);
      }
    }
    this.cleanupTasks = [];
  }
}