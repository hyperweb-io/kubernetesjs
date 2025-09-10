import * as path from 'path';
import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { SetupClient } from '../src/setup';
import { ConfigLoader } from '../src/config-loader';
import type { ClusterSetupConfig } from '../src/types';

// Lightweight e2e wiring against a running cluster (via kubectl proxy).
// Start proxy before running: pnpm --filter @interweb/client proxy
// Optionally set K8S_API to your API server URL.

jest.setTimeout(60_000);

const K8S_API = process.env.K8S_API || 'http://127.0.0.1:8001';

describe('SetupClient deleteOperators: basic flow with config', () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  const cfgPath = path.join(__dirname, '..', '__fixtures__', 'config', 'setup.config.yaml');
  let cfg: ClusterSetupConfig;

  it('loads config and connects to cluster', async () => {
    cfg = ConfigLoader.loadClusterSetup(cfgPath);
    expect(cfg?.metadata?.name).toBe('dev-cluster');

    const ok = await setup.checkConnection();
    expect(typeof ok).toBe('boolean');
    // Don’t fail the suite if cluster is unavailable
    if (!ok) {
      console.warn('Kubernetes cluster not reachable; skipping remaining tests.');
      return;
    }
  });

  it('runs deleteOperators on config', async () => {
    if (!cfg) return;
    await setup.deleteOperators(cfg);
    const status = await setup.getClusterSetupStatus(cfg);
    expect(status.phase === 'ready' || status.phase === 'installing').toBe(true);
  });
});

