import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { ManifestLoader } from '@interweb/manifests';
import { SetupClient } from '../src/setup';

jest.setTimeout(120_000);

const K8S_API = process.env.K8S_API || 'http://127.0.0.1:8001';

describe('apply: manifests from @interweb/manifests', () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  const nsName = 'ingress-nginx';

  async function ensureNamespaceAbsent(name: string) {
    try {
      await api.deleteCoreV1Namespace({ path: { name }, query: {} as any });
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (!/404/.test(msg)) throw err;
    }
  }

  beforeAll(async () => {
    await ensureNamespaceAbsent(nsName);
  });

  // afterAll(async () => {
  //   if (!KEEP) await ensureNamespaceAbsent(nsName);
  // });

  it('applies a Namespace from the ingress-nginx operator manifest', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    // Load the operator manifests from the manifests package (versioned path)
    const docs = ManifestLoader.loadOperatorManifests('ingress-nginx');

    // Take the Namespace manifest from the operator (first doc in this file)
    const nsDoc = docs.find((d) => d && d.kind === 'Namespace');
    expect(nsDoc).toBeTruthy();

    // Apply with strict error handling - should throw on any error
    await setup.applyManifest(nsDoc as any, { 
      continueOnError: false,
      log: (msg) => console.log(`[APPLY] ${msg}`)
    });

    // Verify the namespace now exists
    const got = await api.readCoreV1Namespace({ path: { name: nsName }, query: {} as any });
    expect(got?.metadata?.name).toBe(nsName);

    // Re-apply to exercise idempotent update path - should also succeed
    await setup.applyManifest(nsDoc as any, { 
      continueOnError: false,
      log: (msg) => console.log(`[REAPPLY] ${msg}`)
    });
  });

  it('should fail when applying invalid manifest with continueOnError=false', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    // Create an invalid manifest (missing required namespace)
    const invalidManifest = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: 'invalid-service',
        namespace: 'non-existent-namespace-12345' // This namespace doesn't exist
      },
      spec: {
        ports: [{ port: 80 }],
        selector: { app: 'test' }
      }
    };

    // Should throw an error with continueOnError=false
    await expect(
      setup.applyManifest(invalidManifest as any, { 
        continueOnError: false,
        log: (msg) => console.log(`[ERROR_TEST] ${msg}`)
      })
    ).rejects.toThrow();
  });

  it('should not fail when applying invalid manifest with continueOnError=true', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    // Create an invalid manifest (missing required namespace)
    const invalidManifest = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: 'invalid-service-2',
        namespace: 'non-existent-namespace-67890' // This namespace doesn't exist
      },
      spec: {
        ports: [{ port: 80 }],
        selector: { app: 'test' }
      }
    };

    const logs: string[] = [];

    // Should NOT throw an error with continueOnError=true (default)
    await expect(
      setup.applyManifest(invalidManifest as any, { 
        continueOnError: true,
        log: (msg) => {
          console.log(`[TOLERANT_TEST] ${msg}`);
          logs.push(msg);
        }
      })
    ).resolves.not.toThrow();

    // But should have logged an error
    expect(logs.some(log => log.includes('Error creating') || log.includes('Apply error'))).toBe(true);
  });

  it('should delete a namespace successfully', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    const testNsName = 'test-delete-namespace';
    
    // Create a test namespace first
    const testNamespace = {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: testNsName
      }
    };

    // Apply the namespace
    await setup.applyManifest(testNamespace as any, { 
      continueOnError: false,
      log: (msg) => console.log(`[CREATE] ${msg}`)
    });

    // Verify it exists
    const created = await api.readCoreV1Namespace({ path: { name: testNsName }, query: {} as any });
    expect(created?.metadata?.name).toBe(testNsName);

    // Now delete it
    await setup.deleteManifest(testNamespace as any, { 
      continueOnError: false,
      log: (msg) => console.log(`[DELETE] ${msg}`)
    });

    // Verify it's fully deleted: namespace deletion is async, so wait until GET returns 404
    await waitForNamespaceGone(api, testNsName, 60_000);
  });

  async function waitForNamespaceGone(client: any, name: string, timeoutMs = 60_000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const ns = await client.readCoreV1Namespace({ path: { name }, query: {} as any });
        const phase = (ns as any)?.status?.phase;
        if (phase === 'Terminating') {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        // If it exists and isn't terminating, wait a bit and retry
      } catch (err: any) {
        const msg = String(err?.message || '');
        if (/status:\s*404/.test(msg)) return; // gone
        throw err;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error(`Timeout waiting for namespace ${name} to be deleted`);
  }

  it('should handle deleting non-existent resources gracefully', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    const nonExistentManifest = {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: 'non-existent-namespace-xyz'
      }
    };

    const logs: string[] = [];

    // Should not throw with continueOnError=true (default)
    await expect(
      setup.deleteManifest(nonExistentManifest as any, { 
        continueOnError: true,
        log: (msg) => {
          console.log(`[DELETE_MISSING] ${msg}`);
          logs.push(msg);
        }
      })
    ).resolves.not.toThrow();

    // Should log that it was not found
    expect(logs.some(log => log.includes('not found') || log.includes('already deleted'))).toBe(true);
  });
});
