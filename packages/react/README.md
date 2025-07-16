# @kubernetesjs/react

<p align="center" width="100%">
  <img src="https://github.com/hyperweb-io/interweb-utils/assets/545047/89c743c4-be88-409f-9a77-4b02cd7fe9a4" width="80">
  <br/>
  React Hooks for Kubernetes
  <br />
   <a href="https://github.com/hyperweb-io/kubernetesjs/actions/workflows/ci.yml">
    <img height="20" src="https://github.com/hyperweb-io/kubernetesjs/actions/workflows/ci.yml/badge.svg"/>
  </a>
   <a href="https://github.com/hyperweb-io/kubernetesjs/blob/main/LICENSE">
    <img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
  </a>
</p>

**@kubernetesjs/react** provides **fully-typed React hooks** for the Kubernetes API, powered by [TanStack Query](https://tanstack.com/query) for intelligent caching, background refetching, and optimistic updates.

Build reactive Kubernetes dashboards, operators, and tools with the same patterns you use for your React apps—declarative, composable, and type-safe.

> Real-time Kubernetes state management for React applications. No more polling loops or manual refreshes.

## Features

- **⚛️ React Hooks**: Ready-to-use hooks for all Kubernetes API operations
- **🔄 Smart Caching**: Powered by TanStack Query for intelligent data synchronization
- **🔒 Fully Typed**: Complete TypeScript support with IntelliSense for all Kubernetes resources
- **📡 Real-time Updates**: Automatic background refetching keeps your UI in sync
- **🎯 Optimistic Updates**: Instant UI feedback for mutations with automatic rollback on errors
- **🚀 Zero Configuration**: Works out of the box with sensible defaults

## Installation

```bash
npm install @kubernetesjs/react
```

## Quick Start

### 1. Wrap your app with KubernetesProvider

```tsx
import { KubernetesProvider } from '@kubernetesjs/react';

function App() {
  return (
    <KubernetesProvider 
      initialConfig={{
        restEndpoint: process.env.REACT_APP_K8S_API_URL || 'http://127.0.0.1:8001',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_K8S_TOKEN}`
        }
      }}
    >
      <YourApp />
    </KubernetesProvider>
  );
}
```

### 2. Use hooks in your components

```tsx
import { useListCoreV1NamespacedPodQuery } from '@kubernetesjs/react';

function PodList({ namespace }: { namespace: string }) {
  const { data, isLoading, error } = useListCoreV1NamespacedPodQuery({
    path: { namespace }
  });

  if (isLoading) return <div>Loading pods...</div>;
  if (error) return <div>Error: {error.message}</div>;

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

## Usage Examples

### Listing Resources

```tsx
import { useListAppsV1NamespacedDeploymentQuery } from '@kubernetesjs/react';

function DeploymentDashboard() {
  const { data: deployments } = useListAppsV1NamespacedDeploymentQuery({
    path: { namespace: 'default' }
  });

  return (
    <div>
      {deployments?.items?.map(deployment => (
        <DeploymentCard 
          key={deployment.metadata?.uid}
          deployment={deployment}
        />
      ))}
    </div>
  );
}
```

### Creating Resources

```tsx
import { useCreateCoreV1NamespacedConfigMap } from '@kubernetesjs/react';

function CreateConfigMapForm() {
  const createConfigMap = useCreateCoreV1NamespacedConfigMap();

  const handleSubmit = async (data: FormData) => {
    try {
      await createConfigMap.mutateAsync({
        path: { namespace: 'default' },
        body: {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: { name: data.name },
          data: data.configData
        }
      });
      toast.success('ConfigMap created!');
    } catch (error) {
      toast.error(`Failed: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createConfigMap.isPending}
      >
        {createConfigMap.isPending ? 'Creating...' : 'Create ConfigMap'}
      </button>
    </form>
  );
}
```

### Updating Resources

```tsx
import { 
  useReadAppsV1NamespacedDeploymentQuery,
  useReplaceAppsV1NamespacedDeployment 
} from '@kubernetesjs/react';

function ScaleDeployment({ namespace, name }: Props) {
  const { data: deployment } = useReadAppsV1NamespacedDeploymentQuery({
    path: { namespace, name }
  });
  
  const updateDeployment = useReplaceAppsV1NamespacedDeployment();

  const handleScale = async (replicas: number) => {
    if (!deployment) return;

    await updateDeployment.mutateAsync({
      path: { namespace, name },
      body: {
        ...deployment,
        spec: {
          ...deployment.spec,
          replicas
        }
      }
    });
  };

  return (
    <div>
      <h3>Current replicas: {deployment?.spec?.replicas || 0}</h3>
      <button onClick={() => handleScale(3)}>Scale to 3</button>
    </div>
  );
}
```

### Deleting Resources

```tsx
import { useDeleteCoreV1NamespacedPod } from '@kubernetesjs/react';

function PodActions({ namespace, name }: Props) {
  const deletePod = useDeleteCoreV1NamespacedPod();

  const handleDelete = async () => {
    if (confirm('Delete this pod?')) {
      await deletePod.mutateAsync({
        path: { namespace, name }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deletePod.isPending}
    >
      {deletePod.isPending ? 'Deleting...' : 'Delete Pod'}
    </button>
  );
}
```

### Real-time Monitoring

```tsx
import { useListCoreV1EventForAllNamespacesQuery } from '@kubernetesjs/react';

function EventStream() {
  const { data: events } = useListCoreV1EventForAllNamespacesQuery(
    {},
    {
      refetchInterval: 5000, // Poll every 5 seconds
      refetchIntervalInBackground: true
    }
  );

  return (
    <div className="event-stream">
      {events?.items?.slice(0, 50).map(event => (
        <EventCard key={event.metadata?.uid} event={event} />
      ))}
    </div>
  );
}
```

## API Reference

### Provider

```tsx
<KubernetesProvider initialConfig={{ restEndpoint, headers }}>
```

### Hooks

All Kubernetes API operations are available as hooks following this pattern:

- **Queries** (GET operations): `use{Operation}Query`
- **Mutations** (POST/PUT/PATCH/DELETE): `use{Operation}`

Examples:
- `useListCoreV1NamespacedPodQuery` - List pods in a namespace
- `useCreateAppsV1NamespacedDeployment` - Create a deployment
- `useDeleteCoreV1NamespacedService` - Delete a service
- `usePatchCoreV1NamespacedConfigMap` - Patch a ConfigMap

### Context Hook

```tsx
const { client, config, updateConfig } = useKubernetes();
```

Access the underlying KubernetesClient instance and configuration.

## Related

- [`kubernetesjs`](https://github.com/hyperweb-io/kubernetesjs/tree/main/packages/kubernetesjs) - The core TypeScript client for Kubernetes
- [`@tanstack/react-query`](https://tanstack.com/query) - The powerful async state management library powering our hooks

## Credits

🛠 Built by Hyperweb — if you like our tools, please checkout and contribute to [our github ⚛️](https://github.com/hyperweb-io)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.