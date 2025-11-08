export interface ClusterSetupMetadata {
  name: string;
  namespace?: string;
}

export interface OperatorConfig {
  name: string;
  namespace?: string;
  version?: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface MonitoringConfig {
  enabled: boolean;
  prometheus?: {
    retention: string;
    storage: string;
  };
  grafana?: {
    adminPassword: string;
    persistence: string;
  };
}

export interface NetworkingConfig {
  ingressClass: string;
  domain: string;
  tls?: {
    enabled: boolean;
    issuer?: string;
  };
}

export interface ClusterSetupSpec {
  operators: OperatorConfig[];
  monitoring?: MonitoringConfig;
  networking: NetworkingConfig;
}

export interface ClusterSetupConfig {
  apiVersion: string;
  kind: string;
  metadata: ClusterSetupMetadata;
  spec: ClusterSetupSpec;
}

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'mongodb';
  name: string;
  namespace: string;
  config: {
    instances: number;
    storage?: string;
    resources?: {
      requests?: {
        memory?: string;
        cpu?: string;
      };
      limits?: {
        memory?: string;
        cpu?: string;
      };
    };
  };
}

export interface ApplicationSpec {
  database?: DatabaseConfig;
  services?: ServiceConfig[];
  ingress?: IngressConfig;
}

export interface ServiceConfig {
  name: string;
  image: string;
  port: number;
  replicas?: number;
  env?: Record<string, string>;
  resources?: {
    requests?: {
      memory?: string;
      cpu?: string;
    };
    limits?: {
      memory?: string;
      cpu?: string;
    };
  };
}

export interface IngressConfig {
  enabled: boolean;
  host?: string;
  path?: string;
  tls?: boolean;
}

export interface ApplicationConfig {
  apiVersion: string;
  kind: string;
  metadata: ClusterSetupMetadata;
  spec: ApplicationSpec;
}

export interface DeploymentStatus {
  phase: 'pending' | 'installing' | 'ready' | 'failed';
  message?: string;
  conditions?: Array<{
    type: string;
    status: string;
    reason?: string;
    message?: string;
    lastTransitionTime: string;
  }>;
}

export interface InterwebClientConfig {
  kubeconfig?: string;
  namespace?: string;
  context?: string;
  restEndpoint?: string;
}

// Dashboard-friendly types for reuse
export type OperatorInstallStatus = 'installed' | 'not-installed' | 'installing' | 'error';

export interface OperatorInfo {
  name: string;
  displayName: string;
  description: string;
  docsUrl?: string;
  version: string;
  status: OperatorInstallStatus;
  namespace?: string;
  installations?: Array<{
    namespace: string;
    status: OperatorInstallStatus;
    version: string;
  }>;
}

export interface ClusterOverview {
  healthy: boolean;
  nodeCount: number;
  podCount: number;
  serviceCount: number;
  operatorCount: number;
  version: string;
  nodes: Array<{
    name: string;
    status: string;
    version: string;
    roles: string[];
  }>;
}

export interface SecretConfig {
  name: string;
  namespace: string;
  type: 'Opaque' | 'kubernetes.io/dockerconfigjson' | 'kubernetes.io/tls';
  data: Record<string, string>;
}
