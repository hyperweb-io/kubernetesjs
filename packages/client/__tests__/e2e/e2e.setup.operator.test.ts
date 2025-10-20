import { InterwebClient as InterwebKubernetesClient } from "@interweb/interwebjs";
import { SetupClient } from "../../src/setup";
import type { ClusterSetupConfig, OperatorConfig } from "../../src/types";

// Runs e2e install for a single operator using env var:
//   OPERATOR=<name>
// Requires kubectl proxy on :8001 (CI sets it up) or K8S_API env

jest.setTimeout(15 * 60 * 1000); // generous for CI

const K8S_API = process.env.K8S_API || "http://127.0.0.1:8001";

const DEFAULT_VERSIONS: Record<string, string> = {
  "ingress-nginx": "4.11.2",
  "cert-manager": "v1.17.0",
  "knative-serving": "v1.15.0",
  "cloudnative-pg": "1.25.2",
  "kube-prometheus-stack": "77.5.0",
  "minio-operator": "7.1.1",
};

const DEFAULT_NAMESPACES: Record<string, string> = {
  "ingress-nginx": "ingress-nginx",
  "cert-manager": "cert-manager",
  "knative-serving": "knative-serving",
  "cloudnative-pg": "cnpg-system",
  "kube-prometheus-stack": "monitoring",
  "minio-operator": "minio-operator",
};

// Minimal operator dependency map for tests. Extend over time as needed.
// Example: knative-serving and cloudnative-pg both require cert-manager present.
const OPERATOR_DEPENDENCIES: Record<string, string[]> = {
  "knative-serving": ["cert-manager"],
  "cloudnative-pg": ["cert-manager"],
};

function buildOperator(name: string): OperatorConfig {
  const version = DEFAULT_VERSIONS[name];
  if (!version) throw new Error(`Unknown operator '${name}'`);
  const namespace = DEFAULT_NAMESPACES[name] || name;
  return { name, enabled: true, version, namespace } as OperatorConfig;
}

// Resolve requested operators into a de-duplicated, dependency-ordered list
function resolveOperatorOrder(requested: string[]): string[] {
  const seen = new Set<string>();
  const order: string[] = [];

  const addWithDeps = (name: string) => {
    if (seen.has(name)) return;
    const deps = OPERATOR_DEPENDENCIES[name] || [];
    for (const d of deps) addWithDeps(d);
    seen.add(name);
    order.push(name);
  };

  for (const r of requested) addWithDeps(r);
  return order;
}

describe("SetupClient E2E (matrix): install operators", () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  // Allow single or comma/space-separated list via OPERATOR or OPERATORS
  const rawOps = process.env.OPERATORS || process.env.OPERATOR;

  if (!rawOps) {
    // Make intent clear in local runs
    it("skips because OPERATOR env not set", () => {
      console.warn("OPERATOR env not set; skipping e2e.setup.operator.test");
    });
    return;
  }

  const requested = String(rawOps)
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const resolvedNames = resolveOperatorOrder(requested);
  const operators: OperatorConfig[] = resolvedNames.map(buildOperator);

  const cfg: ClusterSetupConfig = {
    apiVersion: "interweb.dev/v1",
    kind: "ClusterSetup",
    metadata: { name: `e2e-${requested[0]}`, namespace: "interweb-system" },
    spec: {
      operators,
      networking: { ingressClass: "kourier", domain: "127.0.0.1.nip.io" },
    },
  };

  const label = operators.map((o) => `${o.name}@${o.version}`).join(", ");
  it(`installs operators: ${label}`, async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn("Kubernetes cluster not reachable; skipping test.");
      return;
    }

    // Apply operators
    await setup.installOperators(cfg);

    // Verify namespaces exist for each operator
    for (const op of operators) {
      const ns = DEFAULT_NAMESPACES[op.name] || op.namespace || op.name;
      const got = await api.readCoreV1Namespace({
        path: { name: ns },
        query: {} as any,
      });
      expect(got?.metadata?.name).toBe(ns);
    }
  });
});
