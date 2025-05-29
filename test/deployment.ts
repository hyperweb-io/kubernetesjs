import { KubernetesClient } from '../src';

const client = new KubernetesClient({
  restEndpoint: 'http://127.0.0.1:8001'
});

// Create a PostgreSQL deployment
client.createAppsV1NamespacedDeployment({
  path: {
    namespace: 'default'
  },
  query: {
    // Add any necessary query parameters here
  },
  body: {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: 'postgres-pgvector',
      labels: {
        app: 'postgres-pgvector'
      }
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: 'postgres-pgvector'
        }
      },
      template: {
        metadata: {
          labels: {
            app: 'postgres-pgvector'
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
}).then(result => {
  console.log('Deployment created successfully:', result);
}).catch(reason => {
  console.error('Failed to create deployment:', reason);
}); 