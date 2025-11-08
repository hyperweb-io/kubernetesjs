/** Auto-generated aggregator of operator objects*/
import type { KubernetesResource } from "@kubernetesjs/ops";
import CertManager from "./cert-manager";
import CloudnativePg from "./cloudnative-pg";
import IngressNginx from "./ingress-nginx";
import KnativeServing from "./knative-serving";
import KubePrometheusStack from "./kube-prometheus-stack";
import MinioOperator from "./minio-operator";
export interface OperatorObjectModule {
  resources?: ReadonlyArray<KubernetesResource>;
}
export const OPERATOR_OBJECTS: Record<string, OperatorObjectModule> = {
  "cert-manager": CertManager,
  "cloudnative-pg": CloudnativePg,
  "ingress-nginx": IngressNginx,
  "knative-serving": KnativeServing,
  "kube-prometheus-stack": KubePrometheusStack,
  "minio-operator": MinioOperator
};
export const OPERATOR_IDS: ReadonlyArray<string> = ["cert-manager", "cloudnative-pg", "ingress-nginx", "knative-serving", "kube-prometheus-stack", "minio-operator"];
export const OPERATOR_VERSIONS = {
  "cert-manager": ["v1.17.0"],
  "cloudnative-pg": ["1.25.2"],
  "ingress-nginx": ["4.11.2"],
  "knative-serving": ["v1.15.0"],
  "kube-prometheus-stack": ["77.5.0"],
  "minio-operator": ["7.1.1"]
};
export const OPERATOR_MAP: Record<string, {
  resources: ReadonlyArray<KubernetesResource>;
  versions: ReadonlyArray<string>;
}> = {
  "cert-manager": {
    versions: ["v1.17.0"],
    resources: CertManager.resources
  },
  "cloudnative-pg": {
    versions: ["1.25.2"],
    resources: CloudnativePg.resources
  },
  "ingress-nginx": {
    versions: ["4.11.2"],
    resources: IngressNginx.resources
  },
  "knative-serving": {
    versions: ["v1.15.0"],
    resources: KnativeServing.resources
  },
  "kube-prometheus-stack": {
    versions: ["77.5.0"],
    resources: KubePrometheusStack.resources
  },
  "minio-operator": {
    versions: ["7.1.1"],
    resources: MinioOperator.resources
  }
};
