import * as path from "path";
import { InterwebClient as InterwebKubernetesClient } from "@kubernetesjs/ops";
import { SetupClient } from "../../src/setup";
import { ConfigLoader } from "../../src/config-loader";
import type { ClusterSetupConfig } from "../../src/types";
import { TestCleanupRegistry } from "../utils/test-utils";
import { globalCleanup } from "../setup/e2e-setup";

// Lightweight e2e wiring against a running cluster (via kubectl proxy).
// Start proxy before running: pnpm --filter @kubernetesjs/client proxy
// Optionally set K8S_API to your API server URL.

jest.setTimeout(15 * 60 * 1000); // 15 minutes for setup operations

const K8S_API = process.env.K8S_API || "http://127.0.0.1:8001";

describe("SetupClient: basic flow with config", () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);
  const testCleanup = new TestCleanupRegistry();

  const cfgPath = path.join(
    __dirname,
    "..",
    "..",
    "__fixtures__",
    "config",
    "setup.config.yaml"
  );
  let cfg: ClusterSetupConfig;
  let clusterAvailable = false;

  beforeAll(async () => {
    // Register global cleanup
    globalCleanup.register(async () => {
      await testCleanup.cleanup();
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await testCleanup.cleanup();
  });

  it("loads config and connects to cluster", async () => {
    cfg = ConfigLoader.loadClusterSetup(cfgPath);
    expect(cfg?.metadata?.name).toBe("dev-cluster");

    const ok = await setup.checkConnection();
    expect(typeof ok).toBe("boolean");
    clusterAvailable = ok;
    // Don't fail the suite if cluster is unavailable
    if (!ok) {
      console.warn(
        "Kubernetes cluster not reachable; skipping remaining tests."
      );
      return;
    }
  });

  it("runs installOperators on config", async () => {
    if (!cfg || !clusterAvailable) {
      console.warn("Skipping test - cluster not available or config not loaded");
      return;
    }
    await setup.installOperators(cfg);
    const status = await setup.getClusterSetupStatus(cfg);
    expect(status.phase === "ready" || status.phase === "installing").toBe(
      true
    );
  });
});
