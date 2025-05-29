import { KubernetesClient } from "../src";
import { cleanupPostgres } from "./cleanup";

// Create a client instance
const client = new KubernetesClient({
  restEndpoint: 'http://127.0.0.1:8001'
});

// Clean up resources
async function teardown() {
  try {
    await cleanupPostgres(client, {
      namespace: 'default',
      name: 'my-postgres'
    });
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

// Run teardown
teardown(); 