# KubernetesJS

KubernetesJS is a **fully-typed**, zero-dependency TypeScript library designed to simplify interactions with Kubernetes APIs. With comprehensive TypeScript support, it provides a strongly-typed interface that makes managing Kubernetes resources clear and predictable, ideal for TypeScript developers looking to integrate Kubernetes management into their applications.

## Features

- **🔒 Fully Typed**: Complete TypeScript definitions for all functions and models for an enhanced development experience.
- **🚀 Zero Dependencies**: Works out of the box without the need for additional installations.
- **📡 Full Kubernetes API Coverage**: Supports all Kubernetes API endpoints with detailed TypeScript types.
- **👍 Easy to Use**: Simple, clear API methods that make Kubernetes operations straightforward.
- **🌐 Cross-Platform**: Works with both Node.js and browser environments.

## Installation

To install KubernetesJS, you can use npm or yarn:

```bash
npm install kubernetesjs
# or
yarn add kubernetesjs

```

## Example (WIP)

```js
import { KubernetesClient } from "kubernetesjs";

const client = new KubernetesClient({
  restEndpoint: 'http://127.0.0.1:8001'
});

client.listCoreV1NamespacedPod({
  path: {
    namespace: 'default'
  },
  query: {
    // Add any necessary query parameters here
  }
}).then(result => {
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
}).catch(reason => {
  console.error('Failed to fetch pods:', reason);
});
```
