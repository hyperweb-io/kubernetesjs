// Auto-generated. Do not edit.

import type { KubernetesResource } from '@interweb/interwebjs';
import * as cert_manager from './cert-manager';
import * as cloudnative_pg from './cloudnative-pg';
import * as ingress_nginx from './ingress-nginx';
import * as knative_serving from './knative-serving';
import * as kube_prometheus_stack from './kube-prometheus-stack';

export interface OperatorObjectModule {
  Resources?: ReadonlyArray<KubernetesResource>;
  versions?: Record<string, ReadonlyArray<KubernetesResource>>;
}
export const OPERATOR_OBJECTS: Record<string, OperatorObjectModule> = {
  "cert-manager": cert_manager,
  "cloudnative-pg": cloudnative_pg,
  "ingress-nginx": ingress_nginx,
  "knative-serving": knative_serving,
  "kube-prometheus-stack": kube_prometheus_stack,
};
