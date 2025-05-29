# KubernetesJS

<p align="center" width="100%">
  <img src="https://github.com/hyperweb-io/interweb-utils/assets/545047/89c743c4-be88-409f-9a77-4b02cd7fe9a4" width="80">
  <br/>
  TypeScript Client for Kubernetes
  <br />
   <a href="https://github.com/hyperweb-io/kubernetesjs/blob/main/LICENSE">
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

## Example

```js
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

🛠 Built by Hyperweb — if you like our tools, please checkout and contribute to [our github ⚛️](https://github.com/hyperweb-io)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
