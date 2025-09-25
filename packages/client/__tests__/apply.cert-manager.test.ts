import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { getOperatorResources } from '@interweb/manifests';
import { SetupClient } from '../src/setup';

jest.setTimeout(10 * 60 * 1000); // up to 10 minutes for full operator

const K8S_API = process.env.K8S_API || 'http://127.0.0.1:8001';
const nsName = 'cert-manager';

describe('FULL APPLY: cert-manager operator', () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  it('applies all cert-manager manifests', async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    const manifests = getOperatorResources('cert-manager');

    // check the manifest have a valid namespace object
    const nsDoc = manifests.find((m) => m.kind === 'Namespace');
    expect(nsDoc).toBeDefined();
    expect((nsDoc?.metadata as any).name).toBe(nsName);

    await setup.applyManifests(manifests);

    const ns = await api.readCoreV1Namespace({ path: { name: nsName }, query: {} as any });
    expect(ns?.metadata?.name).toBe(nsName);
  });
});
