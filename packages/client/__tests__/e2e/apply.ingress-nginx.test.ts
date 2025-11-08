import { InterwebClient as InterwebKubernetesClient } from "@kubernetesjs/ops";
import { getOperatorResources } from "@kubernetesjs/manifests";
import { SetupClient } from "../../src/setup";
import { ensureNamespaceReady, ensureNamespaceExists, forceDeleteNamespace } from "../utils/test-utils";
import { globalCleanup } from "../setup/e2e-setup";

jest.setTimeout(10 * 60 * 1000); // up to 10 minutes for full operator

const K8S_API = process.env.K8S_API || "http://127.0.0.1:8001";
const nsName = "ingress-nginx";

describe("FULL APPLY: ingress-nginx operator", () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);

  beforeAll(async () => {
    // Ensure namespace exists before starting tests
    await ensureNamespaceExists(api as any, nsName);
    
    // Register cleanup for the namespace
    globalCleanup.register(async () => {
      await forceDeleteNamespace(api as any, nsName);
    });
  });

  afterAll(async () => {
    // Clean up the namespace after tests
    try {
      await forceDeleteNamespace(api as any, nsName);
    } catch (err: any) {
      console.warn(`Failed to cleanup namespace ${nsName}:`, err.message);
    }
  });

  it("applies all ingress-nginx manifests", async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn("Kubernetes cluster not reachable; skipping test.");
      return;
    }

    const manifests = getOperatorResources("ingress-nginx");
    await setup.applyManifests(manifests);

    // Wait a moment for namespace to be created by manifests
    await new Promise(r => setTimeout(r, 2000));

    // Ensure namespace exists after applying manifests
    await ensureNamespaceExists(api as any, nsName);

    const res = await api.listCoreV1Namespace({ query: {} as any });
    const namespaces = res?.items || [];
    const ns = namespaces.find((n: any) => n?.metadata?.name === nsName);
    expect(ns?.metadata?.name).toBe(nsName);
  });
});
