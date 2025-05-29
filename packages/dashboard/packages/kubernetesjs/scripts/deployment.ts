import { KubernetesClient } from '../src';

export interface PostgresConfig {
  namespace: string;
  name: string;
  image: string;
  port: number;
  nodePort: number;
  database: string;
  username: string;
  password: string;
  resources: {
    requests: {
      memory: string;
      cpu: string;
    };
    limits: {
      memory: string;
      cpu: string;
    };
  };
}

const defaultConfig: PostgresConfig = {
  namespace: 'default',
  name: 'postgres-pgvector',
  image: 'pyramation/pgvector:13.3-alpine',
  port: 5432,
  nodePort: 30000,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  resources: {
    requests: {
      memory: '256Mi',
      cpu: '250m'
    },
    limits: {
      memory: '512Mi',
      cpu: '500m'
    }
  }
};

export async function createPostgresDeployment(
  client: KubernetesClient,
  config: Partial<PostgresConfig> = {}
) {
  const finalConfig = { ...defaultConfig, ...config };
  const { namespace, name, image, port, database, username, password, resources } = finalConfig;

  // Create deployment
  const deployment = await client.createAppsV1NamespacedDeployment({
    path: { namespace },
    query: {},
    body: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name,
        labels: {
          app: name
        }
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: name
          }
        },
        template: {
          metadata: {
            labels: {
              app: name
            }
          },
          spec: {
            containers: [
              {
                name: 'postgres',
                image,
                ports: [
                  {
                    name: 'postgres',
                    containerPort: port,
                    protocol: 'TCP'
                  }
                ],
                env: [
                  {
                    name: 'POSTGRES_DB',
                    value: database
                  },
                  {
                    name: 'POSTGRES_USER',
                    value: username
                  },
                  {
                    name: 'POSTGRES_PASSWORD',
                    value: password
                  }
                ],
                resources,
                imagePullPolicy: 'IfNotPresent'
              }
            ],
            restartPolicy: 'Always'
          }
        }
      }
    }
  });

  // Create service
  const service = await client.createCoreV1NamespacedService({
    path: { namespace },
    query: {},
    body: {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name,
        labels: {
          app: name
        }
      },
      spec: {
        type: 'NodePort',
        ports: [
          {
            name: 'postgres',
            port,
            targetPort: 'postgres',
            nodePort: finalConfig.nodePort,
            protocol: 'TCP'
          }
        ],
        selector: {
          app: name
        }
      }
    }
  });

  return { deployment, service };
} 