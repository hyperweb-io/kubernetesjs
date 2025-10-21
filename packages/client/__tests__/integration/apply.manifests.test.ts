import { K8sApplier } from "../../src/apply";
import type { KubernetesResource } from "@interweb/interwebjs";

describe("K8sApplier integration with discovery", () => {
  const kubeClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  } as any;
  let postedEndpoints: string[];

  const namespaceManifest: KubernetesResource = {
    apiVersion: "v1",
    kind: "Namespace",
    metadata: { name: "test-ns" },
  } as any;

  const deploymentManifest: KubernetesResource = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: { name: "test" },
    spec: {} as any,
  } as any;

  const coreResources = {
    groupVersion: "v1",
    resources: [{ name: "namespaces", kind: "Namespace", namespaced: false }],
  } as any;

  const appsResources = {
    groupVersion: "apps/v1",
    resources: [{ name: "deployments", kind: "Deployment", namespaced: true }],
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    postedEndpoints = [];
    kubeClient.get.mockImplementation((url: string) => {
      if (url === "/api/v1") return coreResources;
      if (url === "/apis/apps/v1") return appsResources;
      if (url.startsWith("/apis/apps/v1/namespaces/test-ns/deployments"))
        throw Object.assign(new Error("status: 404"), {
          message: "status: 404",
        });
      if (url.startsWith("/api/v1/namespaces/test-ns"))
        throw Object.assign(new Error("status: 404"), {
          message: "status: 404",
        });
      throw new Error(`Unexpected GET ${url}`);
    });
    kubeClient.post.mockImplementation(
      async (url: string, _opts: unknown, body: unknown) => {
        postedEndpoints.push(url);
        return { body };
      }
    );
    kubeClient.put.mockResolvedValue({});
  });

  it("creates namespaces and deployments when missing", async () => {
    const applier = new K8sApplier(kubeClient, { log: () => {} });
    await applier.applyAll([namespaceManifest, deploymentManifest]);

    expect(postedEndpoints.length).toBeGreaterThan(0);
  });

  it("retries with PUT when resource already exists", async () => {
    kubeClient.post.mockImplementation((url: string) => {
      const err = new Error("status: 409");
      (err as any).message = "status: 409";
      throw err;
    });

    const applier = new K8sApplier(kubeClient, {
      log: () => {},
      continueOnError: false,
    });
    await applier.apply(namespaceManifest);

    expect(kubeClient.put).toHaveBeenCalledWith(
      "/api/v1/namespaces/test-ns",
      undefined,
      expect.objectContaining({ metadata: { name: "test-ns" } })
    );
  });
});
