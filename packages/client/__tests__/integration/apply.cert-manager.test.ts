import { SetupClient } from "../../src/setup";
import type { ClusterSetupConfig } from "../../src/types";
import { getOperatorResources } from "@interweb/manifests";

describe("SetupClient.installOperators integration", () => {
  const operatorDetails: Record<
    string,
    { namespace: string; version: string }
  > = {
    "cert-manager": { namespace: "cert-manager", version: "v1.17.0" },
    "ingress-nginx": { namespace: "ingress-nginx", version: "4.11.2" },
  };

  const createConfig = (names: string[]): ClusterSetupConfig => ({
    apiVersion: "interweb.dev/v1",
    kind: "ClusterSetup",
    metadata: { name: "test-cluster", namespace: "interweb-system" },
    spec: {
      operators: names.map((name) => ({
        name,
        enabled: true,
        version: operatorDetails[name]?.version ?? "0.0.0",
        namespace: operatorDetails[name]?.namespace ?? `${name}-ns`,
      })),
      networking: { ingressClass: "nginx", domain: "example.test" },
    },
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("applies manifests for each enabled operator", async () => {
    const setup = new SetupClient({} as any);
    const applySpy = jest
      .spyOn(
        setup as unknown as { applyManifests: typeof setup.applyManifests },
        "applyManifests"
      )
      .mockResolvedValue(undefined);
    const waitSpy = jest
      .spyOn(
        setup as unknown as { waitForOperator: typeof setup.waitForOperator },
        "waitForOperator"
      )
      .mockResolvedValue(undefined);
    jest.spyOn(console, "log").mockImplementation(() => {});

    const config = createConfig(["cert-manager", "ingress-nginx"]);
    await setup.installOperators(config);

    expect(applySpy).toHaveBeenCalledTimes(2);
    const calledManifests = applySpy.mock.calls.map((c) => c[0]);
    expect(calledManifests).toEqual(
      expect.arrayContaining([
        getOperatorResources(
          "cert-manager",
          operatorDetails["cert-manager"].version
        ),
        getOperatorResources(
          "ingress-nginx",
          operatorDetails["ingress-nginx"].version
        ),
      ])
    );

    // Ensure readiness waits were invoked for both operators
    const waitedOperators = waitSpy.mock.calls.map((c) => c[0]);
    expect(waitedOperators).toEqual(
      expect.arrayContaining(["cert-manager", "ingress-nginx"])
    );
  });

  it("throws for unsupported operators", async () => {
    const setup = new SetupClient({} as any);
    jest.spyOn(console, "log").mockImplementation(() => {});

    const config = createConfig(["unknown-operator"] as any);
    await expect(setup.installOperators(config)).rejects.toThrow(
      "Unsupported operator"
    );
  });
});
