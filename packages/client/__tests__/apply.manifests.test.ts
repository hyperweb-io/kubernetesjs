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

    await setup.applyManifest(nsDoc as any);

    // Verify the namespace now exists
    const got = await api.readCoreV1Namespace({ path: { name: nsName }, query: {} as any });
    expect(got?.metadata?.name).toBe(nsName);

    // Re-apply to exercise idempotent update path
    await setup.applyManifest(nsDoc as any);
  });
});
