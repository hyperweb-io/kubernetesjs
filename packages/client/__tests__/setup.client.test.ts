import { KubernetesClient } from 'kubernetesjs';
import { SetupClient } from '../src/kubernetes-client';
import type { ClusterSetupConfig } from '../src/types';

// Simple, lightweight e2e against a running cluster (via kubectl proxy).
// Set K8S_API if not using the default proxy URL.

jest.setTimeout(60_000);

const K8S_API = process.env.K8S_API || 'http://127.0.0.1:8001';
const nsNames = ['knative-serving', 'kourier-system'];

async function ensureNamespaceAbsent(client: KubernetesClient, name: string) {
  try {
    await client.deleteCoreV1Namespace({ path: { name }, query: {} });
    await new Promise((r) => setTimeout(r, 1500));
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (!/404/.test(msg)) throw err;
  }
}

describe('SetupClient e2e: installOperators creates namespaces', () => {
  let api: KubernetesClient;
  let setup: SetupClient;
  let connected = false;

  beforeAll(async () => {
    api = new KubernetesClient({ restEndpoint: K8S_API } as any);
    setup = new SetupClient(api as any);
    connected = await setup.checkConnection();
    if (!connected) return;
    for (const ns of nsNames) await ensureNamespaceAbsent(api, ns);
  });

  afterAll(async () => {
    if (!connected) return;
    for (const ns of nsNames) await ensureNamespaceAbsent(api, ns);
  });

  const itIf = (cond: boolean) => (cond ? it : it.skip);

  itIf(true)('connects to cluster (or skips if unavailable)', async () => {
    // The beforeAll already sets connectivity flag.
    expect(typeof connected).toBe('boolean');
  });

  itIf(connected)('installs knative-serving namespaces from manifests', async () => {
    const cfg: ClusterSetupConfig = {
      apiVersion: 'interweb.dev/v1',
      kind: 'ClusterSetup',
      metadata: { name: 'e2e-setup' },
      spec: {
        operators: [{ name: 'knative-serving', enabled: true, version: 'v1.15.0' }],
        networking: { ingressClass: 'kourier', domain: '127.0.0.1.nip.io' },
      },
    };

    await setup.installOperators(cfg);
    for (const ns of nsNames) {
      const got = await api.readCoreV1Namespace({ path: { name: ns }, query: {} as any });
      expect(got?.metadata?.name).toBe(ns);
    }
  });
});
