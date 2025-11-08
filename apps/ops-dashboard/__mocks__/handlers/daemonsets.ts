import { V1DaemonSet } from '@kubernetesjs/ops';
import { http, HttpResponse } from 'msw';

import { API_BASE } from './common';

export const createDaemonSetsListData = (): V1DaemonSet[] => {
  return [
    {
      metadata: {
        name: 'nginx-daemonset',
        namespace: 'default',
        uid: 'ds-1',
        labels: { app: 'nginx' }
      },
      spec: {
        selector: { matchLabels: { app: 'nginx' } },
        template: {
          metadata: { labels: { app: 'nginx' } },
          spec: { containers: [{ name: 'nginx', image: 'nginx:1.14.2' }] }
        }
      },
      status: {
        currentNumberScheduled: 3,
        numberReady: 3,
        desiredNumberScheduled: 3,
        numberAvailable: 3
      }
    },
    {
      metadata: {
        name: 'redis-daemonset',
        namespace: 'default',
        uid: 'ds-2',
        labels: { app: 'redis' }
      },
      spec: {
        selector: { matchLabels: { app: 'redis' } },
        template: {
          metadata: { labels: { app: 'redis' } },
          spec: { containers: [{ name: 'redis', image: 'redis:5.0.3-alpine' }] }
        }
      },
      status: {
        currentNumberScheduled: 2,
        numberReady: 2,
        desiredNumberScheduled: 2,
        numberAvailable: 2
      }
    },
    {
      metadata: {
        name: 'pending-daemonset',
        namespace: 'kube-system',
        uid: 'ds-3',
        labels: { app: 'pending' }
      },
      spec: {
        selector: { matchLabels: { app: 'pending' } },
        template: {
          metadata: { labels: { app: 'pending' } },
          spec: { containers: [{ name: 'pending', image: 'pending:latest' }] }
        }
      },
      status: {
        currentNumberScheduled: 0,
        numberReady: 0,
        desiredNumberScheduled: 1,
        numberAvailable: 0
      }
    }
  ];
};

export const createDaemonSetsList = (daemonSets: V1DaemonSet[] = createDaemonSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets`, ({ params }) => {
    const namespace = params.namespace as string;
    const namespaceDaemonSets = daemonSets.filter(ds => ds.metadata.namespace === namespace);

    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'DaemonSetList',
      items: namespaceDaemonSets
    });
  });
};

export const createAllDaemonSetsList = (daemonSets: V1DaemonSet[] = createDaemonSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/daemonsets`, () => {
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'DaemonSetList',
      items: daemonSets
    });
  });
};

// Error handlers
export const createDaemonSetsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createAllDaemonSetsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/daemonsets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Network error handler
export const createDaemonSetsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets`, () => {
    return HttpResponse.error();
  });
};

// Slow response handler for testing loading states
export const createDaemonSetsListSlow = (daemonSets: V1DaemonSet[] = createDaemonSetsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    const namespace = params.namespace as string;
    const namespaceDaemonSets = daemonSets.filter(ds => ds.metadata.namespace === namespace);

    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'DaemonSetList',
      items: namespaceDaemonSets
    });
  });
};

// DaemonSet by name handler
export const createDaemonSetByName = (daemonSets: V1DaemonSet[] = createDaemonSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets/:name`, ({ params }) => {
    const namespace = params.namespace as string;
    const name = params.name as string;
    const daemonSet = daemonSets.find(ds => ds.metadata.namespace === namespace && ds.metadata.name === name);

    if (!daemonSet) {
      return HttpResponse.json(
        { error: 'DaemonSet not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(daemonSet);
  });
};

// DaemonSet details handler (alias for createDaemonSetByName)
export const createDaemonSetDetails = (daemonSet: V1DaemonSet) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets/:name`, ({ params }) => {
    if (params.name === daemonSet.metadata?.name && params.namespace === daemonSet.metadata?.namespace) {
      return HttpResponse.json(daemonSet);
    }
    return HttpResponse.json({ error: 'DaemonSet not found' }, { status: 404 });
  });
};

// Delete daemonset handler
export const createDaemonSetDelete = () => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets/:name`, () => {
    return HttpResponse.json({});
  });
};

// Delete daemonset error handler
export const createDaemonSetDeleteError = (status: number = 500, message: string = 'Delete failed') => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};
