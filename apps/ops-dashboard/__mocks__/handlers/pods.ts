import { V1Pod } from '@kubernetesjs/ops';
import { http, HttpResponse } from 'msw';

import { API_BASE } from './common';

export const createPodsListData = (): V1Pod[] => {
  return [
    {
      metadata: { 
        name: 'nginx-pod-1', 
        namespace: 'default', 
        uid: 'pod-1',
        labels: { app: 'nginx' }
      },
      spec: { 
        containers: [{ name: 'nginx', image: 'nginx:1.14.2' }],
        nodeName: 'node-1'
      },
      status: { 
        phase: 'Running',
        conditions: [
          { type: 'Ready', status: 'True' }
        ],
        containerStatuses: [
          { name: 'nginx', ready: true, restartCount: 0 }
        ]
      }
    },
    {
      metadata: { 
        name: 'redis-pod-1', 
        namespace: 'default', 
        uid: 'pod-2',
        labels: { app: 'redis' }
      },
      spec: { 
        containers: [{ name: 'redis', image: 'redis:5.0.3-alpine' }],
        nodeName: 'node-2'
      },
      status: { 
        phase: 'Running',
        conditions: [
          { type: 'Ready', status: 'True' }
        ],
        containerStatuses: [
          { name: 'redis', ready: true, restartCount: 0 }
        ]
      }
    },
    {
      metadata: { 
        name: 'pending-pod', 
        namespace: 'default', 
        uid: 'pod-3',
        labels: { app: 'pending' }
      },
      spec: { 
        containers: [{ name: 'pending', image: 'pending:latest' }],
        nodeName: 'node-1'
      },
      status: { 
        phase: 'Pending',
        conditions: [
          { type: 'Ready', status: 'False' }
        ]
      }
    },
    {
      metadata: { 
        name: 'failed-pod', 
        namespace: 'default', 
        uid: 'pod-4', 
        labels: { app: 'failed' }
      },
      spec: { 
        containers: [{ name: 'failed', image: 'failed:latest' }],
        nodeName: 'node-1'
      },
      status: { 
        phase: 'Failed',
        conditions: [
          { type: 'Ready', status: 'False' }
        ]
      }
    },
    {
      metadata: { 
        name: 'succeeded-pod', 
        namespace: 'default', 
        uid: 'pod-5', 
        labels: { app: 'succeeded' }
      },
      spec: { 
        containers: [{ name: 'succeeded', image: 'succeeded:latest' }],
        nodeName: 'node-1'
      },
      status: { 
        phase: 'Succeeded',
        conditions: [
          { type: 'Ready', status: 'True' }
        ]
      }
    }
  ];
};

export const createPodsList = (pods: V1Pod[] = createPodsListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods`, ({ params }) => {
    const namespace = params.namespace as string;
    const namespacePods = pods.filter(pod => pod.metadata.namespace === namespace);
      
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PodList',
      items: namespacePods
    });
  });
};

export const createAllPodsList = (pods: V1Pod[] = createPodsListData()) => {
  return http.get(`${API_BASE}/api/v1/pods`, () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PodList',
      items: pods
    });
  });
};

// Error handlers
export const createPodsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createAllPodsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/pods`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Network error handler
export const createPodsListNetworkError = () => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods`, () => {
    return HttpResponse.error();
  });
};

// Slow response handler for testing loading states
export const createPodsListSlow = (pods: V1Pod[] = createPodsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    const namespace = params.namespace as string;
    const namespacePods = pods.filter(pod => pod.metadata.namespace === namespace);
      
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PodList',
      items: namespacePods
    });
  });
};

// Pod by name handler
export const createPodByName = (pods: V1Pod[] = createPodsListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods/:name`, ({ params }) => {
    const namespace = params.namespace as string;
    const name = params.name as string;
    const pod = pods.find(p => p.metadata.namespace === namespace && p.metadata.name === name);
    
    if (!pod) {
      return HttpResponse.json(
        { error: 'Pod not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(pod);
  });
};

// Pod details handler (alias for createPodByName)
export const createPodDetails = (pod: V1Pod) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods/:name`, ({ params }) => {
    if (params.name === pod.metadata?.name && params.namespace === pod.metadata?.namespace) {
      return HttpResponse.json(pod);
    }
    return HttpResponse.json({ error: 'Pod not found' }, { status: 404 });
  });
};

// Pod logs handler
export const createPodLogs = (name: string, namespace: string, logs: string) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods/:name/log`, ({ params, request }) => {
    if (params.name === name && params.namespace === namespace) {
      // Check for container parameter in query string
      const url = new URL(request.url);
      const container = url.searchParams.get('container');
      
      return new HttpResponse(logs, { 
        headers: { 
          'Content-Type': 'text/plain',
          'Content-Length': logs.length.toString()
        } 
      });
    }
    return HttpResponse.json({ error: 'Logs not found' }, { status: 404 });
  });
};

// Generic pod logs handler for any pod
export const createPodLogsHandler = (logs: string) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods/:name/log`, ({ params, request }) => {
    // Check for container parameter in query string
    return HttpResponse.json(logs);
  });
};
