import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import { KubernetesClient, Deployment, Service } from 'kubernetesjs';

interface DeploymentAnswers {
  deploymentType: string;
  confirmDeployment: boolean;
}

const createDeployment = (type: string): Deployment => {
  const commonMetadata = {
    name: `${type}-deployment`,
    labels: {
      app: type
    }
  };

  const commonSpec = {
    replicas: 1,
    selector: {
      matchLabels: {
        app: type
      }
    },
    template: {
      metadata: {
        labels: {
          app: type
        }
      }
    }
  };

  switch (type) {
    case 'minio':
      return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: commonMetadata,
        spec: {
          ...commonSpec,
          template: {
            ...commonSpec.template,
            spec: {
              containers: [{
                name: 'minio',
                image: 'minio/minio:latest',
                ports: [{ containerPort: 9000, name: 'minio' }],
                env: [
                  { name: 'MINIO_ROOT_USER', value: 'minioadmin' },
                  { name: 'MINIO_ROOT_PASSWORD', value: 'minioadmin' }
                ],
                args: ['server', '/data']
              }]
            }
          }
        }
      };
    case 'postgres':
      return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: commonMetadata,
        spec: {
          ...commonSpec,
          template: {
            ...commonSpec.template,
            spec: {
              containers: [{
                name: 'postgres',
                image: 'pyramation/pgvector:13.3-alpine',
                ports: [{ containerPort: 5432, name: 'postgres' }],
                env: [
                  { name: 'POSTGRES_USER', value: 'postgres' },
                  { name: 'POSTGRES_PASSWORD', value: 'postgres' },
                  { name: 'POSTGRES_DB', value: 'postgres' }
                ]
              }]
            }
          }
        }
      };
    case 'ollama':
      return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: commonMetadata,
        spec: {
          ...commonSpec,
          template: {
            ...commonSpec.template,
            spec: {
              containers: [{
                name: 'ollama',
                image: 'ollama/ollama:latest',
                ports: [{ containerPort: 11434, name: 'ollama' }]
              }]
            }
          }
        }
      };
    default:
      throw new Error(`Unsupported deployment type: ${type}`);
  }
};

const createService = (type: string): Service => {
  const commonMetadata = {
    name: `${type}-service`,
    labels: {
      app: type
    }
  };

  const commonSpec = {
    selector: {
      app: type
    }
  };

  switch (type) {
    case 'minio':
      return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: commonMetadata,
        spec: {
          ...commonSpec,
          ports: [{ port: 9000, targetPort: 'minio' }],
          type: 'ClusterIP'
        }
      };
    case 'postgres':
      return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: commonMetadata,
        spec: {
          ...commonSpec,
          ports: [{ port: 5432, targetPort: 'postgres' }],
          type: 'ClusterIP'
        }
      };
    case 'ollama':
      return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: commonMetadata,
        spec: {
          ...commonSpec,
          ports: [{ port: 11434, targetPort: 'ollama' }],
          type: 'ClusterIP'
        }
      };
    default:
      throw new Error(`Unsupported service type: ${type}`);
  }
};

export default async (
  argv: Partial<ParsedArgs>,
  prompter: Inquirerer,
  _options: CLIOptions
) => {
  const deploymentOptions = ['minio', 'postgres', 'ollama'];

  const questions: Question[] = [
    {
      type: 'autocomplete',
      name: 'deploymentType',
      message: 'Select deployment type',
      options: deploymentOptions,
      maxDisplayLines: 5,
      required: true
    }
  ];

  const { deploymentType } = await prompter.prompt(argv, questions);

  const confirmQuestion: Question = {
    type: 'confirm',
    name: 'confirmDeployment',
    message: `Are you sure you want to deploy ${deploymentType}?`,
    required: true
  };

  const { confirmDeployment } = await prompter.prompt(argv, [confirmQuestion]);

  if (!confirmDeployment) {
    console.log('Deployment cancelled.');
    return;
  }

  console.log(`Deploying ${deploymentType}...`);

  try {
    // Initialize Kubernetes client
    const client = new KubernetesClient({
      restEndpoint: argv.clientUrl || 'http://127.0.0.1:8001'
    });

    // Create deployment
    const deployment = createDeployment(deploymentType);
    await client.createAppsV1NamespacedDeployment({
      path: {
        namespace: 'default'
      },
      query: {
        pretty: 'true'
      },
      body: deployment
    });
    console.log(`Created deployment: ${deployment.metadata.name}`);

    // Create service
    const service = createService(deploymentType);
    await client.createCoreV1NamespacedService({
      path: {
        namespace: 'default'
      },
      query: {
        pretty: 'true'
      },
      body: service
    });
    console.log(`Created service: ${service.metadata.name}`);

    console.log(`Successfully deployed ${deploymentType}!`);
  } catch (error) {
    console.error(`Failed to deploy ${deploymentType}:`, error);
    throw error;
  }

  return { deploymentType };
};
