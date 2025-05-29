import { KubernetesClient } from "../src";
import { createPostgresDeployment } from "./deployment";

// Create a client instance
const client = new KubernetesClient({
  restEndpoint: 'http://127.0.0.1:8001'
});

// Deploy PostgreSQL
async function deploy() {
  try {
    const { deployment, service } = await createPostgresDeployment(client, {
      namespace: 'default',
      name: 'my-postgres',
      password: 'my-secure-password',
      resources: {
        requests: {
          memory: '512Mi',
          cpu: '500m'
        },
        limits: {
          memory: '1Gi',
          cpu: '1000m'
        }
      }
    });

    console.log('PostgreSQL deployment created:', deployment.metadata?.name);
    console.log('PostgreSQL service created:', service.metadata?.name);
    console.log('PostgreSQL will be available on port 30000');
  } catch (error) {
    console.error('Failed to deploy PostgreSQL:', error);
    process.exit(1);
  }
}

// Run deployment
deploy(); 