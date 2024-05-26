# KubernetesJS

<p align="center" width="100%">
  <img src="https://github.com/cosmology-tech/interweb-utils/assets/545047/89c743c4-be88-409f-9a77-4b02cd7fe9a4" width="80">
  <br/>
  TypeScript Client for Kubernetes
  <br />
   <a href="https://github.com/cosmology-tech/kubernetesjs/blob/main/LICENSE">
    <img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
  </a>
</p>


KubernetesJS is a **fully-typed**, zero-dependency TypeScript library designed to simplify interactions with Kubernetes APIs. With comprehensive TypeScript support, it provides a strongly-typed interface that makes managing Kubernetes resources clear and predictable, ideal for TypeScript developers looking to integrate Kubernetes management into their applications.

## Features

- **🔒 Fully Typed**: Complete TypeScript definitions for all functions and models for an enhanced development experience.
- **🚀 Zero Dependencies**: Works out of the box without the need for additional installations.
- **📡 Full Kubernetes API Coverage**: Supports all Kubernetes API endpoints with detailed TypeScript types.
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
