import { http, HttpResponse } from 'msw';

export interface ClusterStatus {
  isConnected: boolean
  nodes: {
    name: string
    status: 'Ready' | 'NotReady'
    roles: string[]
    version: string
  }[]
  totalNodes: number
  readyNodes: number
  totalPods: number
  runningPods: number
  totalServices: number
  operators: {
    installed: number
    total: number
  }
}

export const createClusterStatusData = (): ClusterStatus => {
  return {
    isConnected: true,
    nodes: [
      {
        name: 'master-node',
        status: 'Ready',
        roles: ['master', 'worker'],
        version: 'v1.28.0'
      },
      {
        name: 'worker-node-1',
        status: 'Ready',
        roles: ['worker'],
        version: 'v1.28.0'
      },
      {
        name: 'worker-node-2',
        status: 'Ready',
        roles: ['worker'],
        version: 'v1.28.0'
      }
    ],
    totalNodes: 3,
    readyNodes: 3,
    totalPods: 15,
    runningPods: 14,
    totalServices: 8,
    operators: {
      installed: 3,
      total: 5
    }
  };
};

export const createClusterStatus = (status: ClusterStatus = createClusterStatusData()) => {
  return http.get('/api/cluster/status', () => {
    return HttpResponse.json(status);
  });
};

export const createClusterStatusError = (status: number = 500, message: string = 'Failed to fetch cluster status') => {
  return http.get('/api/cluster/status', () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createClusterStatusNetworkError = () => {
  return http.get('/api/cluster/status', () => {
    return HttpResponse.error();
  });
};

export const createClusterStatusSlow = (delay: number = 2000) => {
  return http.get('/api/cluster/status', async () => {
    await new Promise(resolve => setTimeout(resolve, delay));
    return HttpResponse.json(createClusterStatusData());
  });
};
