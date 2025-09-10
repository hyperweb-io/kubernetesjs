import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { SetupClient } from '../src/setup';
import type { ClusterSetupConfig, OperatorConfig } from '../src/types';

// Runs e2e install for a single operator using env var:
//   OPERATOR=<name>
// Requires kubectl proxy on :8001 (CI sets it up) or K8S_API env

jest.setTimeout(15 * 60 * 1000); // generous for CI

const K8S_API = process.env.K8S_API || 'http://127.0.0.1:8001';

const DEFAULT_VERSIONS: Record<string, string> = {
  'ingress-nginx': '4.11.2',
  'cert-manager': 'v1.17.0',
  'knative-serving': 'v1.15.0',
  'cloudnative-pg': '1.25.2',
  'kube-prometheus-stack': '77.5.0',
};

const DEFAULT_NAMESPACES: Record<string, string> = {
  'ingress-nginx': 'ingress-nginx',
  'cert-manager': 'cert-manager',
  'knative-serving': 'knative-serving',
  'cloudnative-pg': 'cnpg-system',
  'kube-prometheus-stack': 'monitoring',
};

function buildOperator(name: string): OperatorConfig {
  const version = DEFAULT_VERSIONS[name];
  if (!version) throw new Error(`Unknown operator '${name}'`);
  const namespace = DEFAULT_NAMESPACES[name] || name;
  return { name, enabled: true, version, namespace } as OperatorConfig;
}

describe('SetupClient E2E (matrix): install operators', () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  const op1 = process.env.OPERATOR;

  if (!op1) {
    // Make intent clear in local runs
    it('skips because OPERATOR env not set', () => {
      console.warn('OPERATOR env not set; skipping e2e.setup.operator.test');
    });
    return;
  }

  const operators: OperatorConfig[] = [buildOperator(op1 as string)];

  const cfg: ClusterSetupConfig = {
    apiVersion: 'interweb.dev/v1',
    kind: 'ClusterSetup',
    metadata: { name: `e2e-${operators[0].name}`, namespace: 'interweb-system' },
    spec: {
      operators,
      networking: { ingressClass: 'kourier', domain: '127.0.0.1.nip.io' },
    },
  };

  it(`installs operator: ${operators[0].name}@${operators[0].version}`, async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn('Kubernetes cluster not reachable; skipping test.');
      return;
    }

    // Apply operators
    await setup.installOperators(cfg);

    // Verify namespaces exist for each operator
    for (const op of operators) {
      const ns = DEFAULT_NAMESPACES[op.name] || op.namespace || op.name;
      const got = await api.readCoreV1Namespace({ path: { name: ns }, query: {} as any });
      expect(got?.metadata?.name).toBe(ns);
    }
  });
});
