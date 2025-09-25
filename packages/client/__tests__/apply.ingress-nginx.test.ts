import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { getOperatorResources } from '@interweb/manifests';
import { SetupClient } from '../src/setup';

jest.setTimeout(10 * 60 * 1000); // up to 10 minutes for full operator

const K8S_API = process.env.K8S_API || 'http://127.0.0.1:8001';
const nsName = 'ingress-nginx';

describe('FULL APPLY: ingress-nginx operator', () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  async function ensureNamespaceAbsent(name: string) {
    try {
      await api.deleteCoreV1Namespace({ path: { name }, query: {} as any });
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (!/404/.test(msg)) throw err;
    }
  }

  // beforeAll(async () => {
  //   await ensureNamespaceAbsent(nsName);
  // });

  // afterAll(async () => {
  //   await ensureNamespaceAbsent(nsName);
  // });

  it('applies all ingress-nginx manifests', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    const manifests = getOperatorResources('ingress-nginx');
    await setup.applyManifests(manifests);

    const ns = await api.readCoreV1Namespace({ path: { name: nsName }, query: {} as any });
    expect(ns?.metadata?.name).toBe(nsName);
  });
});
