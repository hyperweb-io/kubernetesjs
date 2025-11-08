import {
  InterwebClient as InterwebKubernetesClient,
  Namespace,
  AppsV1Deployment,
  Service,
  KubernetesResource,
} from '@kubernetesjs/ops';
import { SetupClient } from '../setup';

export interface OllamaDeployOptions {
  namespace?: string;
  name?: string;
  image?: string;
  port?: number;
  replicas?: number;
  log?: (msg: string) => void;
}

const defaultOpts: Required<Pick<OllamaDeployOptions, 'namespace' | 'name' | 'image' | 'port' | 'replicas'>> = {
  namespace: 'default',
  name: 'ollama',
  image: 'ollama/ollama:latest',
  port: 11434,
  replicas: 1,
};

function buildNamespace(opts: Required<OllamaDeployOptions>): Namespace {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: opts.namespace,
    },
  };
}

function buildDeployment(opts: Required<OllamaDeployOptions>): AppsV1Deployment {
  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: opts.name,
      namespace: opts.namespace,
      labels: {
        app: opts.name,
        'app.kubernetes.io/name': opts.name,
        'app.kubernetes.io/component': 'llm-server',
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
            'app.kubernetes.io/component': 'llm-server',
          },
        },
        spec: {
          containers: [
            {
              name: opts.name,
              image: opts.image,
              ports: [
                {
                  containerPort: opts.port,
                  name: 'http',
                },
              ],
              resources: {
                requests: {
                  memory: '1Gi',
                  cpu: '500m',
                },
                limits: {
                  memory: '2Gi',
                  cpu: '1000m',
                },
              },
              volumeMounts: [
                {
                  name: 'ollama-data',
                  mountPath: '/root/.ollama',
                },
              ],
            },
          ],
          volumes: [
            {
              name: 'ollama-data',
              emptyDir: {},
            },
          ],
        },
      },
    },
  };
}

function buildService(opts: Required<OllamaDeployOptions>): Service {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: opts.name,
      namespace: opts.namespace,
      labels: {
        app: opts.name,
        'app.kubernetes.io/name': opts.name,
        'app.kubernetes.io/component': 'llm-server',
        'app.kubernetesjs.dev/managed': 'true',
      },
    },
    spec: {
      selector: {
        app: opts.name,
      },
      ports: [
        {
          port: opts.port,
          targetPort: opts.port,
          name: 'http',
        },
      ],
      type: 'ClusterIP',
    },
  };
}

export interface OllamaDeployResult {
  namespace: string;
  name: string;
  endpoint: string;
}

export class OllamaDeployer {
  private kube: InterwebKubernetesClient;
  private setup: SetupClient;
  private log: (msg: string) => void;

  constructor(kube: InterwebKubernetesClient, setup: SetupClient, log: (msg: string) => void = console.log) {
    this.kube = kube;
    this.setup = setup;
    this.log = log;
  }

  async deploy(options: OllamaDeployOptions = {}): Promise<OllamaDeployResult> {
    const opts = { ...defaultOpts, ...options } as Required<OllamaDeployOptions>;

    // Build resources
    const resources: KubernetesResource[] = [
      buildNamespace(opts),
      buildDeployment(opts),
      buildService(opts),
    ];

    this.log(`Applying ${resources.length} Ollama manifest(s) to namespace ${opts.namespace}...`);
    await this.setup.applyManifests(resources, { continueOnError: false, log: this.log });

    // Wait for deployment to be ready
    await this.waitForDeploymentReady(opts.name, opts.namespace, 5 * 60 * 1000);

    return {
      namespace: opts.namespace,
      name: opts.name,
      endpoint: `http://${opts.name}.${opts.namespace}.svc.cluster.local:${opts.port}`,
    };
  }

  async undeploy(options: OllamaDeployOptions = {}): Promise<void> {
    const opts = { ...defaultOpts, ...options } as Required<OllamaDeployOptions>;

    // Build resources for deletion
    const resources: KubernetesResource[] = [
      buildService(opts),
      buildDeployment(opts),
    ];

    this.log(`Deleting ${resources.length} Ollama manifest(s) from namespace ${opts.namespace}...`);
    await this.setup.deleteManifests(resources, { continueOnError: true, log: this.log });
  }

  private async waitForDeploymentReady(name: string, namespace: string, timeoutMs = 300_000, pollMs = 5_000) {
    const start = Date.now();
    this.log(`Waiting for deployment ${namespace}/${name} to be ready...`);

    while (Date.now() - start < timeoutMs) {
      try {
        const deployment = await this.kube.get(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`) as any;
        const status = deployment.status;
        
        if (status?.readyReplicas && status.readyReplicas > 0) {
          this.log(`✓ Deployment ${namespace}/${name} is ready`);
          return;
        }
      } catch (error) {
        // Deployment might not exist yet, continue waiting
      }

      await new Promise(resolve => setTimeout(resolve, pollMs));
    }

    throw new Error(`Timeout waiting for deployment ${namespace}/${name} to be ready`);
  }
}

// Note: Template metadata is now exported from ./metadata.ts to avoid Node.js dependencies in browser environments
