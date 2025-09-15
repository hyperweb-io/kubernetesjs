# @interweb/client

## Postgres (CloudNativePG) Quick Deploy

Assumes the CloudNativePG CRDs/operator are already installed. Then, from code:

```ts
import { Client } from '@interweb/client';

const client = new Client({
  // Optionally set kubeconfig/context/namespace/restEndpoint
  restEndpoint: '/api/k8s', // e.g. dashboard proxy
});

await client.deployPostgres({
  namespace: 'postgres-db',
  name: 'postgres-cluster',
  instances: 3,
  storage: '10Gi',
  enablePooler: true,
});
```

This creates:
- Namespace (if missing)
- Secrets: `postgres-superuser`, `postgres-app-user`
- CNPG Cluster: `postgres-cluster`
- PgBouncer Pooler: `postgres-pooler` (rw)

It waits for the cluster and pooler pods to be ready, then prints connection URLs.

Change the default credentials in production.
