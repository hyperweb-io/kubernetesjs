import { getOperatorResources } from "@interweb/manifests";

describe("manifests: metadata coverage", () => {
  const operatorNamespaceMap = {
    "ingress-nginx": "ingress-nginx",
    "cert-manager": "cert-manager",
    "knative-serving": "knative-serving",
    "cloudnative-pg": "cnpg-system",
    "kube-prometheus-stack": "monitoring",
  };

  it("exports namespaces for supported operators", () => {
    for (const operator of Object.keys(operatorNamespaceMap)) {
      const manifests = getOperatorResources(operator);
      const ns = manifests.find((m) => m.kind === "Namespace");
      expect(ns).toBeTruthy();
      expect((ns?.metadata as any).name).toBe(
        operatorNamespaceMap[operator as keyof typeof operatorNamespaceMap]
      );
    }
  });
});
