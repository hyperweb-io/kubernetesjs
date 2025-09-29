import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { OPERATOR_OBJECTS, OperatorObjectModule, OPERATOR_VERSIONS, OPERATOR_MAP, OPERATOR_IDS } from './generated';
import { KubernetesResource } from '@interweb/interwebjs';

// Optional metadata for UIs: display name, description, docs, and (optionally) canonical namespaces
export interface OperatorCatalogEntry {
  name: string;
  displayName: string;
  description: string;
  docsUrl?: string;
  namespaces?: string[];
}

export const OPERATOR_CATALOG: Record<string, OperatorCatalogEntry> = {
  'minio-operator': {
    name: 'minio-operator',
    displayName: 'MinIO Operator',
    description: 'Operator to manage MinIO tenants and S3-compatible object storage on Kubernetes',
    docsUrl: 'https://operator.min.io',
    namespaces: ['minio-operator'],
  },
  'ingress-nginx': {
    name: 'ingress-nginx',
    displayName: 'NGINX Ingress Controller',
    description: 'Ingress controller using NGINX as a reverse proxy and load balancer',
    docsUrl: 'https://kubernetes.github.io/ingress-nginx/',
    namespaces: ['ingress-nginx'],
  },
  'cert-manager': {
    name: 'cert-manager',
    displayName: 'cert-manager',
    description: 'X.509 certificate management for Kubernetes',
    docsUrl: 'https://cert-manager.io/',
    namespaces: ['cert-manager'],
  },
  'knative-serving': {
    name: 'knative-serving',
    displayName: 'Knative Serving',
    description: 'Serverless workloads on Kubernetes',
    docsUrl: 'https://knative.dev/docs/serving/',
    namespaces: ['knative-serving', 'kourier-system'],
  },
  'cloudnative-pg': {
    name: 'cloudnative-pg',
    displayName: 'CloudNativePG',
    description: 'PostgreSQL operator for Kubernetes',
    docsUrl: 'https://cloudnative-pg.io/',
    namespaces: ['cnpg-system'],
  },
  'kube-prometheus-stack': {
    name: 'kube-prometheus-stack',
    displayName: 'Prometheus Stack',
    description: 'Monitoring stack with Prometheus, Grafana, Alertmanager',
    docsUrl: 'https://prometheus.io/',
    namespaces: ['monitoring'],
  },
};

export function getOperatorIds(): string[] {
  return OPERATOR_IDS as string[];
}

export function getOperatorInfo(operatorId: string): OperatorCatalogEntry {
  return OPERATOR_CATALOG[operatorId];
}

export function getOperatorVersions(operatorId: string): string[] {
  return OPERATOR_MAP[operatorId].versions as string[];
}

export function getOperatorResources(operatorId: string, version?: string): KubernetesResource[] {
  return OPERATOR_MAP[operatorId].resources as KubernetesResource[];
}

// Re-export generated operator artifacts at the root for convenience
export { OPERATOR_IDS, OPERATOR_VERSIONS, OPERATOR_MAP, OPERATOR_OBJECTS };
