import { http, HttpResponse } from 'msw';

export const createResourceQuotasListData = () => [
  {
    metadata: {
      name: 'compute-quota',
      namespace: 'default',
      uid: 'compute-quota-uid',
      creationTimestamp: '2024-01-01T00:00:00Z'
    },
    spec: {
      hard: {
        'requests.cpu': '2',
        'requests.memory': '4Gi',
        'limits.cpu': '4',
        'limits.memory': '8Gi',
        pods: '10'
      }
    },
    status: {
      hard: {
        'requests.cpu': '2',
        'requests.memory': '4Gi',
        'limits.cpu': '4',
        'limits.memory': '8Gi',
        pods: '10'
      },
      used: {
        'requests.cpu': '1',
        'requests.memory': '2Gi',
        'limits.cpu': '2',
        'limits.memory': '4Gi',
        pods: '5'
      }
    }
  },
  {
    metadata: {
      name: 'storage-quota',
      namespace: 'kube-system',
      uid: 'storage-quota-uid',
      creationTimestamp: '2024-01-02T00:00:00Z'
    },
    spec: {
      hard: {
        'requests.storage': '100Gi',
        persistentvolumeclaims: '10'
      }
    },
    status: {
      hard: {
        'requests.storage': '100Gi',
        persistentvolumeclaims: '10'
      },
      used: {
        'requests.storage': '80Gi',
        persistentvolumeclaims: '8'
      }
    }
  },
  {
    metadata: {
      name: 'high-usage-quota',
      namespace: 'production',
      uid: 'high-usage-quota-uid',
      creationTimestamp: '2024-01-03T00:00:00Z'
    },
    spec: {
      hard: {
        'requests.cpu': '1',
        'requests.memory': '2Gi',
        pods: '5'
      }
    },
    status: {
      hard: {
        'requests.cpu': '1',
        'requests.memory': '2Gi',
        pods: '5'
      },
      used: {
        'requests.cpu': '0.9',
        'requests.memory': '1.8Gi',
        pods: '4'
      }
    }
  },
  {
    metadata: {
      name: 'critical-quota',
      namespace: 'critical',
      uid: 'critical-quota-uid',
      creationTimestamp: '2024-01-04T00:00:00Z'
    },
    spec: {
      hard: {
        'requests.cpu': '2',
        'requests.memory': '4Gi',
        pods: '10'
      }
    },
    status: {
      hard: {
        'requests.cpu': '2',
        'requests.memory': '4Gi',
        pods: '10'
      },
      used: {
        'requests.cpu': '1.9',
        'requests.memory': '3.8Gi',
        pods: '9'
      }
    }
  }
];

export const createResourceQuotaDelete = () =>
  http.delete('/api/v1/namespaces/:namespace/resourcequotas/:name', ({ params }) => {
    const { namespace, name } = params;
    return HttpResponse.json({
      metadata: {
        name,
        namespace,
        deletionTimestamp: new Date().toISOString()
      }
    });
  });

export const createResourceQuotasList = () =>
  http.get('/api/v1/namespaces/:namespace/resourcequotas', ({ request }) => {
    const url = new URL(request.url);
    const namespace = url.pathname.split('/')[4];
    
    const data = createResourceQuotasListData().filter(quota => 
      quota.metadata.namespace === namespace
    );
    
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ResourceQuotaList',
      items: data
    });
  });

export const createAllResourceQuotasList = () =>
  http.get('/api/v1/resourcequotas', () => {
    const data = createResourceQuotasListData();
    
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ResourceQuotaList',
      items: data
    });
  });

export const createResourceQuotasListError = () =>
  http.get('/api/v1/namespaces/:namespace/resourcequotas', () => {
    return HttpResponse.json(
      { error: 'Network request failed' },
      { status: 500 }
    );
  });

export const createResourceQuotasListSlow = () =>
  http.get('/api/v1/namespaces/:namespace/resourcequotas', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ResourceQuotaList',
      items: []
    });
  });
