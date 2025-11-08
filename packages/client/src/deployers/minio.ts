import {
  InterwebClient as InterwebKubernetesClient,
  Namespace,
  Secret,
  AppsV1Deployment,
  Service,
  KubernetesResource,
} from '@kubernetesjs/ops';
import { SetupClient } from '../setup';

export interface MinioDeployOptions {
  name?: string;
  namespace?: string;
  storage?: string; // e.g. '10Gi'
  storageClass?: string;
  accessKey?: string;
  secretKey?: string;
  replicas?: number;
  imageName?: string;
  log?: (msg: string) => void;
}

const defaultOpts: Required<Pick<MinioDeployOptions,
  'name' | 'namespace' | 'storage' | 'accessKey' | 'secretKey' | 'replicas' | 'imageName'
>> = {
  name: 'minio',
  namespace: 'default',
  storage: '10Gi',
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
  replicas: 1,
  imageName: 'minio/minio:latest',
};

function b64(v: string): string {
  return Buffer.from(v, 'utf8').toString('base64');
}

function buildNamespace(ns: string): Namespace {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: { name: ns, labels: { 'app.kubernetesjs.dev/managed': 'true' } },
  };
}

function buildSecret(opts: Required<MinioDeployOptions>): Secret {
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: `${opts.name}-credentials`,
      namespace: opts.namespace,
      labels: {
        'app.kubernetes.io/name': opts.name,
        'app.kubernetes.io/component': 'object-storage',
        'app.kubernetesjs.dev/managed': 'true',
      },
    },
    data: {
      'access-key': b64(opts.accessKey),
      'secret-key': b64(opts.secretKey),
    },
  };
}

function buildDeployment(opts: Required<MinioDeployOptions>): AppsV1Deployment {
  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: opts.name,
      namespace: opts.namespace,
      labels: {
        app: opts.name,
        'app.kubernetes.io/name': opts.name,
        'app.kubernetes.io/component': 'object-storage',
        'app.kubernetesjs.dev/managed': 'true',
      },
    },
    spec: {
      replicas: opts.replicas,
      selector: {
        matchLabels: {
          app: opts.name,
        },
      },
      template: {
        metadata: {
          labels: {
            app: opts.name,
            'app.kubernetes.io/name': opts.name,
            'app.kubernetes.io/component': 'object-storage',
          },
        },
        spec: {
          containers: [
            {
              name: 'minio',
              image: opts.imageName,
              command: ['minio', 'server', '/data', '--console-address', ':9001'],
              env: [
                {
                  name: 'MINIO_ACCESS_KEY',
                  valueFrom: {
                    secretKeyRef: {
                      name: `${opts.name}-credentials`,
                      key: 'access-key',
                    },
                  },
                },
                {
                  name: 'MINIO_SECRET_KEY',
                  valueFrom: {
                    secretKeyRef: {
                      name: `${opts.name}-credentials`,
                      key: 'secret-key',
                    },
                  },
                },
              ],
              ports: [
                { containerPort: 9000, name: 'api' },
                { containerPort: 9001, name: 'console' },
              ],
              volumeMounts: [
                {
                  name: 'data',
                  mountPath: '/data',
                },
              ],
              resources: {
                requests: { memory: '256Mi', cpu: '100m' },
                limits: { memory: '1Gi', cpu: '500m' },
              },
            },
          ],
          volumes: [
            {
              name: 'data',
              persistentVolumeClaim: {
                claimName: `${opts.name}-data`,
              },
            },
          ],
        },
      },
    },
  };
}

function buildService(opts: Required<MinioDeployOptions>): Service {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: opts.name,
      namespace: opts.namespace,
      labels: {
        app: opts.name,
        'app.kubernetes.io/name': opts.name,
        'app.kubernetes.io/component': 'object-storage',
        'app.kubernetesjs.dev/managed': 'true',
      },
    },
    spec: {
      selector: {
        app: opts.name,
      },
      ports: [
        { name: 'api', port: 9000, targetPort: 9000 },
        { name: 'console', port: 9001, targetPort: 9001 },
      ],
      type: 'ClusterIP',
    },
  };
}

function buildPVC(opts: Required<MinioDeployOptions>): KubernetesResource {
  return {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: `${opts.name}-data`,
      namespace: opts.namespace,
      labels: {
        app: opts.name,
        'app.kubernetes.io/name': opts.name,
        'app.kubernetes.io/component': 'object-storage',
        'app.kubernetesjs.dev/managed': 'true',
      },
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: opts.storage,
        },
      },
      ...(opts.storageClass ? { storageClassName: opts.storageClass } : {}),
    },
  } as KubernetesResource;
}

export interface MinioDeployResult {
  namespace: string;
  name: string;
  hosts: {
    api: string;
    console: string;
  };
  credentials: {
    accessKey: string;
    secretKey: string;
  };
}

export class MinioDeployer {
  private kube: InterwebKubernetesClient;
  private setup: SetupClient;
  private log: (msg: string) => void;

  constructor(kube: InterwebKubernetesClient, setup: SetupClient, log: (msg: string) => void = console.log) {
    this.kube = kube;
    this.setup = setup;
    this.log = log;
  }

  async deploy(options: MinioDeployOptions = {}): Promise<MinioDeployResult> {
    const opts = { ...defaultOpts, ...options } as Required<MinioDeployOptions>;
    const ns = opts.namespace;
    const name = opts.name;

    const resources: KubernetesResource[] = [
      buildNamespace(ns),
      buildSecret(opts),
      buildPVC(opts),
      buildDeployment(opts) as KubernetesResource,
      buildService(opts) as KubernetesResource,
    ];

    this.log(`Applying ${resources.length} MinIO manifest(s) to namespace ${ns}...`);
    await this.setup.applyManifests(resources, { continueOnError: false, log: this.log });

    // Wait for deployment to be ready
    await this.waitForDeploymentReady(name, ns);

    const result: MinioDeployResult = {
      namespace: ns,
      name,
      hosts: {
        api: `${name}.${ns}.svc.cluster.local:9000`,
        console: `${name}.${ns}.svc.cluster.local:9001`,
      },
      credentials: {
        accessKey: opts.accessKey,
        secretKey: opts.secretKey,
      },
    };

    return result;
  }

  async waitForDeploymentReady(name: string, namespace: string, timeoutMs = 300_000, pollMs = 5_000) {
    const start = Date.now();
    this.log(`Waiting for MinIO deployment ${name} in ${namespace} to be ready...`);
    
    while (Date.now() - start < timeoutMs) {
      try {
        const deployment = await this.kube.readAppsV1NamespacedDeployment({ 
          path: { namespace, name }, 
          query: {} 
        });
        
        const readyReplicas = deployment.status?.readyReplicas ?? 0;
        const desiredReplicas = deployment.spec?.replicas ?? 0;
        
        if (readyReplicas >= desiredReplicas && desiredReplicas > 0) {
          this.log(`✓ MinIO deployment ready: ${readyReplicas}/${desiredReplicas} replicas`);
          return;
        }
        
        this.log(`... MinIO deployment status: ${readyReplicas}/${desiredReplicas} replicas ready`);
      } catch (err) {
        // ignore 404 until created
      }
      
      await new Promise((r) => setTimeout(r, pollMs));
    }
    
    throw new Error(`Timeout waiting for MinIO deployment ${name} in ${namespace} to be ready`);
  }
}

// Note: Template metadata is now exported from ./metadata.ts to avoid Node.js dependencies in browser environments
