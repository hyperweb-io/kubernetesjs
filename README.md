# KubernetesJS

<p align="center" width="100%">
  <img src="https://github.com/hyperweb-io/interweb-utils/assets/545047/89c743c4-be88-409f-9a77-4b02cd7fe9a4" width="80">
  <br/>
  TypeScript Client for Kubernetes
  <br />
   <a href="https://github.com/hyperweb-io/kubernetesjs/actions/workflows/ci.yml">
    <img height="20" src="https://github.com/hyperweb-io/kubernetesjs/actions/workflows/ci.yml/badge.svg"/>
  </a>
   <a href="https://github.com/hyperweb-io/kubernetesjs/blob/main/LICENSE">
    <img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
  </a>
</p>

KubernetesJS is a comprehensive TypeScript ecosystem for Kubernetes, providing **fully-typed**, zero-dependency clients and React hooks for building modern cloud-native applications.

Write infrastructure like you write apps—modular, composable, and testable. KubernetesJS gives you direct, programmatic access to the entire Kubernetes API, with the developer experience of modern JavaScript tooling.

> No more brittle YAML. No more hidden chart logic. Just pure, type-safe Kubernetes from the language you already use.

## Packages

### 📦 [`kubernetesjs`](./packages/kubernetesjs) - Core TypeScript Client
The foundation package providing a fully-typed, zero-dependency TypeScript client for the entire Kubernetes API. Perfect for Node.js applications, CLI tools, operators, and automation scripts.

```bash
npm install kubernetesjs
```

[View kubernetesjs documentation →](./packages/kubernetesjs)

### ⚛️ [`@kubernetesjs/react`](./packages/react) - React Hooks for Kubernetes
React hooks powered by TanStack Query for building reactive Kubernetes dashboards and management UIs. Includes intelligent caching, real-time updates, and optimistic mutations.

```bash
npm install @kubernetesjs/react
```

[View @kubernetesjs/react documentation →](./packages/react)

## Features

- **🔒 Fully Typed**: Complete TypeScript definitions for all functions and models for an enhanced development experience.
- **🚀 Zero Dependencies**: Core client works out of the box without additional installations.
- **📡 Full Kubernetes API Coverage**: Supports all Kubernetes API endpoints with detailed TypeScript types.
- **🌐 Cross-Platform**: Works with both Node.js and browser environments.
- **⚛️ React Integration**: First-class React hooks with intelligent state management.
- **🔄 Real-time Updates**: Built-in support for watching resources and automatic refetching.

With KubernetesJS, you don't shell out to `kubectl`, grep logs, or decode YAML trees. You write real code—typed, composable, inspectable.

## Quick Start

### Core Client Usage

```ts
import { KubernetesClient } from "kubernetesjs";

const client = new KubernetesClient({
  restEndpoint: process.env.KUBERNETES_API_URL || 'http://127.0.0.1:8001'
});

// Create a deployment
await client.createAppsV1NamespacedDeployment({
  path: { namespace: 'default' },
  body: {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: { name: 'hello-world' },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: 'hello-world' } },
      template: {
        metadata: { labels: { app: 'hello-world' } },
        spec: {
          containers: [{
            name: 'app',
            image: 'node:18-alpine',
            command: ['node', '-e', 'require("http").createServer((_,res)=>res.end("ok")).listen(3000)'],
            ports: [{ containerPort: 3000 }]
          }]
        }
      }
    }
  }
});
```

### React Hooks Usage

```tsx
import { KubernetesProvider, useListCoreV1NamespacedPodQuery } from '@kubernetesjs/react';

function App() {
  return (
    <KubernetesProvider initialConfig={{ restEndpoint: 'http://127.0.0.1:8001' }}>
      <PodList namespace="default" />
    </KubernetesProvider>
  );
}

function PodList({ namespace }: { namespace: string }) {
  const { data, isLoading } = useListCoreV1NamespacedPodQuery({
    path: { namespace }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.items?.map(pod => (
        <li key={pod.metadata?.uid}>
          {pod.metadata?.name} - {pod.status?.phase}
        </li>
      ))}
    </ul>
  );
}
```

## Your Infrastructure, Like a Component

This is what we mean by "*React for infrastructure*":

```ts
// Reusable infrastructure components
function createPostgresDeployment(name: string) {
  return client.createAppsV1NamespacedDeployment({
    path: { namespace: 'default' },
    body: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: { name },
      spec: { /* ... */ }
    }
  });
}

// Test your infrastructure
describe('PostgreSQL Deployment', () => {
  it('creates a PostgreSQL deployment + service', async () => {
    const deployment = await createPostgresDeployment('postgres-test');
    const service = await createPostgresService('postgres-test');

    expect(deployment.metadata?.name).toBe('postgres-test');
    expect(service.metadata?.name).toBe('postgres-test');

    const status = await client.readAppsV1NamespacedDeployment({
      path: { namespace: 'default', name: 'postgres-test' }
    });

    expect(status.status?.readyReplicas).toBe(1);
  });
});
```

> Type-safe Kubernetes. With `expect()`.

## Example: Inspect Init Containers in Running Pods

```ts
import { KubernetesClient } from "kubernetesjs";

const client = new KubernetesClient({
  restEndpoint: 'http://127.0.0.1:8001'
});

const result = await client.listCoreV1NamespacedPod({
  path: { namespace: 'default' }
});

if (result.items && result.items.length) {
  result.items.forEach(item => {
    console.log('NODE:', item.spec.nodeName);

    const initContainers = item.status.initContainerStatuses?.map(ic => ({
      image: ic.image,
      name: ic.name,
      ready: ic.ready,
      state: ic.state
    }));

    const containers = item.status.containerStatuses?.map(c => ({
      image: c.image,
      name: c.name,
      ready: c.ready,
      state: c.state
    }));

    console.log({ containers });
    console.log({ initContainers });
  });
}
```

## Development

Start the Kubernetes API proxy to allow local access:

```bash
kubectl proxy --port=8001 --accept-hosts='^.*$' --address='0.0.0.0'
```

## Related

Checkout these related projects:

* [`schema-typescript`](https://github.com/hyperweb-io/schema-typescript/tree/main/packages/schema-typescript)  
  Provides robust tools for handling JSON schemas and converting them to TypeScript interfaces with ease and efficiency.
* [`@schema-typescript/cli`](https://github.com/hyperweb-io/schema-typescript/tree/main/packages/cli)  
  CLI is the command line utility for `schema-typescript`.
* [`schema-sdk`](https://github.com/hyperweb-io/schema-typescript/tree/main/packages/schema-sdk)  
  Provides robust tools for handling OpenAPI schemas and converting them to TypeScript clients with ease and efficiency.
* [`starship`](https://github.com/hyperweb-io/starship) Unified Testing and Development for the Interchain.

## Credits

🛠 Built by [Interweb](https://interweb.co) — if you like our tools, please checkout and contribute [https://interweb.co](https://interweb.co)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.