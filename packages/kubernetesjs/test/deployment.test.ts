import { KubernetesClient } from '../src';

jest.setTimeout(150000);

describe('PostgreSQL Deployment', () => {
  const client = new KubernetesClient({
    restEndpoint: process.env.KUBERNETES_API_URL || 'http://127.0.0.1:8001'
  });

  const namespace = 'default';
  const deploymentName = 'postgres-pgvector';
  const serviceName = 'postgres-pgvector';

  beforeAll(async () => {
    // Wait for cluster to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  it('should create a PostgreSQL deployment and service', async () => {
    // Create deployment
    const deployment = await client.createAppsV1NamespacedDeployment({
      path: { namespace },
      query: {},
      body: {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: deploymentName,
          labels: {
            app: deploymentName
          }
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              app: deploymentName
            }
          },
          template: {
            metadata: {
              labels: {
                app: deploymentName
              }
            },
            spec: {
              containers: [
                {
                  name: 'postgres',
                  image: 'pyramation/pgvector:13.3-alpine',
                  ports: [
                    {
                      name: 'postgres',
                      containerPort: 5432,
                      protocol: 'TCP'
                    }
                  ],
                  env: [
                    {
                      name: 'POSTGRES_DB',
                      value: 'postgres'
                    },
                    {
                      name: 'POSTGRES_USER',
                      value: 'postgres'
                    },
                    {
                      name: 'POSTGRES_PASSWORD',
                      value: 'postgres'
                    }
                  ],
                  resources: {
                    requests: {
                      memory: '256Mi',
                      cpu: '250m'
                    },
                    limits: {
                      memory: '512Mi',
                      cpu: '500m'
                    }
                  },
                  imagePullPolicy: 'IfNotPresent'
                }
              ],
              restartPolicy: 'Always'
            }
          }
        }
      }
    });

    expect(deployment.metadata?.name).toBe(deploymentName);

    // Create service
    const service = await client.createCoreV1NamespacedService({
      path: { namespace },
      query: {},
      body: {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name: serviceName,
          labels: {
            app: deploymentName
          }
        },
        spec: {
          type: 'NodePort',
          ports: [
            {
              name: 'postgres',
              port: 5432,
              targetPort: 'postgres',
              nodePort: 30000,
              protocol: 'TCP'
            }
          ],
          selector: {
            app: deploymentName
          }
        }
      }
    });

    expect(service.metadata?.name).toBe(serviceName);

    // Wait for deployment to be ready
    await new Promise(resolve => setTimeout(resolve, 10000)); // Give some time for pods to start

    // Get deployment status
    const deploymentStatus = await client.readAppsV1NamespacedDeployment({
      path: {
        namespace,
        name: deploymentName
      },
      query: {}
    });

    expect(deploymentStatus.status?.readyReplicas).toBe(1);
  });

  afterAll(async () => {
    // Cleanup
    try {
      // Check if deployment exists before trying to delete it
      try {
        await client.readAppsV1NamespacedDeployment({
          path: {
            namespace,
            name: deploymentName
          },
          query: {}
        });
        await client.deleteAppsV1NamespacedDeployment({
          path: {
            namespace,
            name: deploymentName
          },
          query: {}
        });
      } catch (error) {
        // Deployment doesn't exist, that's fine
      }

      // Check if service exists before trying to delete it
      try {
        await client.readCoreV1NamespacedService({
          path: {
            namespace,
            name: serviceName
          },
          query: {}
        });
        await client.deleteCoreV1NamespacedService({
          path: {
            namespace,
            name: serviceName
          },
          query: {}
        });
      } catch (error) {
        // Service doesn't exist, that's fine
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  });
}); 