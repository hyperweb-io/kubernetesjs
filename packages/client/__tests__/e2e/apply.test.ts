import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { InterwebClient as InterwebKubernetesClient } from "@kubernetesjs/ops";
import { SetupClient } from "../../src/setup";

// Assumes a local cluster is reachable via kubectl proxy.
// Start proxy before running: pnpm --filter @kubernetesjs/client proxy
// Optionally set K8S_API to your API server URL.

jest.setTimeout(120_000);

const K8S_API = process.env.K8S_API || "http://127.0.0.1:8001";
const KEEP = process.env.KEEP || process.env.KEEP_APPLY_RESOURCES;
const NS = "interweb-apply-test";
const CM_NAME = "apply-test-config";

describe("apply: custom manifest create/replace", () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  async function ensureNamespaceAbsent(name: string) {
    try {
      await api.deleteCoreV1Namespace({ path: { name }, query: {} as any });
      // give the API a moment to process delete
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (!/404/.test(msg)) throw err;
    }
  }

  beforeAll(async () => {
    // Clean slate - only if cluster is available
    const connected = await setup.checkConnection();
    if (connected && !KEEP) await ensureNamespaceAbsent(NS);
  });

  afterAll(async () => {
    // Cleanup - only if cluster is available
    const connected = await setup.checkConnection();
    if (connected && !KEEP) await ensureNamespaceAbsent(NS);
  });

  it("applies Namespace and ConfigMap via SetupClient.applyManifest", async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn("Kubernetes cluster not reachable; skipping test.");
      return;
    }
    // Load fixture YAML (multi-doc)
    const file = path.join(
      __dirname,
      "..",
      "..",
      "__fixtures__",
      "manifests",
      "apply.configmap.yaml"
    );
    const docs = yaml.loadAll(fs.readFileSync(file, "utf8")) as any[];

    for (const doc of docs) {
      await setup.applyManifest(doc as any);
    }

    // Verify namespace exists
    const res = await api.listCoreV1Namespace({ query: {} as any });
    const namespaces = res?.items || [];
    const ns = namespaces.find((n: any) => n?.metadata?.name === NS);
    expect(ns?.metadata?.name).toBe(NS);

    // Verify configmap exists
    const cm = await api.readCoreV1NamespacedConfigMap({
      path: { namespace: NS, name: CM_NAME },
      query: {} as any,
    });
    expect(cm?.metadata?.name).toBe(CM_NAME);

    // Re-apply to exercise replace path
    for (const doc of docs) {
      await setup.applyManifest(doc as any);
    }
    if (KEEP) {
      console.log(`Keeping namespace ${NS} for inspection.`);
    }
  });
});
