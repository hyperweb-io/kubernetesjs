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

  it("applies manifests for each enabled operator in order", async () => {
    const setup = new SetupClient({} as any);
    const applySpy = jest
      .spyOn(
        setup as unknown as { applyManifests: typeof setup.applyManifests },
        "applyManifests"
      )
      .mockResolvedValue(undefined);
    jest.spyOn(console, "log").mockImplementation(() => {});

    const config = createConfig(["cert-manager", "ingress-nginx"]);
    await setup.installOperators(config);

    expect(applySpy).toHaveBeenCalledTimes(2);
    const firstCall = applySpy.mock.calls[0];
    const secondCall = applySpy.mock.calls[1];

    expect(firstCall[0]).toEqual(
      getOperatorResources(
        "cert-manager",
        operatorDetails["cert-manager"].version
      )
    );
    expect(firstCall[1]).toEqual(
      expect.objectContaining({ continueOnError: false })
    );
    expect(secondCall[0]).toEqual(
      getOperatorResources(
        "ingress-nginx",
        operatorDetails["ingress-nginx"].version
      )
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
