import { V1ConfigMap } from '@kubernetesjs/ops';
import { http, HttpResponse } from 'msw';

import { API_BASE } from './common';

export const createConfigMapsListData = (): V1ConfigMap[] => {
  return [
    {
      metadata: { 
        name: 'app-config', 
        namespace: 'default', 
        uid: 'cm-1',
        labels: { app: 'nginx' }
      },
      data: {
        'app.properties': 'server.port=8080\napp.name=my-app',
        'database.properties': 'db.host=localhost\ndb.port=5432'
      }
    },
    {
      metadata: { 
        name: 'redis-config', 
        namespace: 'default', 
        uid: 'cm-2',
        labels: { app: 'redis' }
      },
      data: {
        'redis.conf': 'maxmemory 256mb\nmaxmemory-policy allkeys-lru'
      }
    },
    {
      metadata: { 
        name: 'empty-config', 
        namespace: 'default', 
        uid: 'cm-3',
        labels: { app: 'empty' }
      },
      data: {}
    }
  ];
};

export const createConfigMapsList = (configMaps: V1ConfigMap[] = createConfigMapsListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/configmaps`, ({ params }) => {
    const namespace = params.namespace as string;
    const namespaceConfigMaps = configMaps.filter(cm => cm.metadata.namespace === namespace);
      
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ConfigMapList',
      items: namespaceConfigMaps
    });
  });
};

export const createAllConfigMapsList = (configMaps: V1ConfigMap[] = createConfigMapsListData()) => {
  return http.get(`${API_BASE}/api/v1/configmaps`, () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ConfigMapList',
      items: configMaps
    });
  });
};

// Error handlers
export const createConfigMapsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/configmaps`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createAllConfigMapsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/configmaps`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Network error handler
export const createConfigMapsListNetworkError = () => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/configmaps`, () => {
    return HttpResponse.error();
  });
};

// Slow response handler for testing loading states
export const createConfigMapsListSlow = (configMaps: V1ConfigMap[] = createConfigMapsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/configmaps`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    const namespace = params.namespace as string;
    const namespaceConfigMaps = configMaps.filter(cm => cm.metadata.namespace === namespace);
      
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ConfigMapList',
      items: namespaceConfigMaps
    });
  });
};

// Get single configmap handler
export const getConfigMap = (configMap: V1ConfigMap) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/configmaps/:name`, ({ params }) => {
    const name = params.name as string;
    const namespace = params.namespace as string;
    if (name === configMap.metadata.name && namespace === configMap.metadata.namespace) {
      return HttpResponse.json(configMap);
    }
    return HttpResponse.json({ error: 'ConfigMap not found' }, { status: 404 });
  });
};

// Create configmap handler
export const createConfigMap = () => {
  return http.post(`${API_BASE}/api/v1/namespaces/:namespace/configmaps`, async ({ request, params }) => {
    const body = await request.json() as V1ConfigMap;
    const namespace = params.namespace as string;
    
    return HttpResponse.json({
      ...body,
      metadata: {
        ...body.metadata,
        namespace,
        resourceVersion: '12345',
        uid: `cm-${body.metadata?.name || 'new-config'}`,
        creationTimestamp: new Date().toISOString()
      }
    }, { status: 201 });
  });
};

// Update configmap handler
export const createConfigMapUpdate = () => {
  return http.put(`${API_BASE}/api/v1/namespaces/:namespace/configmaps/:name`, async ({ request, params }) => {
    const body = await request.json() as V1ConfigMap;
    const name = params.name as string;
    const namespace = params.namespace as string;
    
    return HttpResponse.json({
      ...body,
      metadata: {
        ...body.metadata,
        name,
        namespace,
        resourceVersion: '12345',
        uid: `cm-${name}`
      }
    });
  });
};

// Update configmap error handler
export const createConfigMapUpdateError = (status: number = 500, message: string = 'Update failed') => {
  return http.put(`${API_BASE}/api/v1/namespaces/:namespace/configmaps/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Delete configmap handler
export const createConfigMapDelete = () => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/configmaps/:name`, () => {
    return HttpResponse.json({});
  });
};

// Delete configmap error handler
export const createConfigMapDeleteError = (status: number = 500, message: string = 'Delete failed') => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/configmaps/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};
