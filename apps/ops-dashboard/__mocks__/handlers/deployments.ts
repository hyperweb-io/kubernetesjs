import { AppsV1Deployment } from '@kubernetesjs/ops';
import { http, HttpResponse } from 'msw';

import { API_BASE } from './common';

export const createDeploymentsListData = ():AppsV1Deployment[] => {
  return [
    {
      metadata: { 
        name: 'nginx-deployment', 
        namespace: 'default', 
        uid: 'deploy-1' 
      },
      spec: { replicas: 3, selector: { matchLabels: { app: 'nginx' } }, template: { spec: { containers: [{ name: 'nginx', image: 'nginx:1.14.2' }] } } },
      status: { readyReplicas: 3, replicas: 3 }
    },
    {
      metadata: { 
        name: 'redis-deployment', 
        namespace: 'default', 
        uid: 'deploy-2' 
      },
      spec: { replicas: 1, selector: { matchLabels: { app: 'redis' } }, template: { spec: { containers: [{ name: 'redis', image: 'redis:5.0.3-alpine' }] } } },
      status: { readyReplicas: 1, replicas: 1 }
    }
  ];
};

export const createAllDeploymentsList = (deployments: AppsV1Deployment[] = createDeploymentsListData()) =>{
  return http.get(`${API_BASE}/apis/apps/v1/deployments`, () => {
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'DeploymentList',
      items: deployments
    });
  });
};

export const createDeploymentsList = (deployments: AppsV1Deployment[] = createDeploymentsListData()) =>{
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments`, ({ params }) => {
    const namespace = params.namespace as string;
    const namespaceDeployments = deployments.filter(deploy => deploy.metadata.namespace === namespace);
        
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'DeploymentList',
      items: namespaceDeployments
    });
  });
};

// Error handlers
export const createDeploymentsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createAllDeploymentsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/deployments`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Network error handler
export const createDeploymentsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments`, () => {
    return HttpResponse.error();
  });
};

// Slow response handler for testing loading states
export const createDeploymentsListSlow = (deployments: AppsV1Deployment[] = createDeploymentsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    const namespace = params.namespace as string;
    const namespaceDeployments = deployments.filter(deploy => deploy.metadata.namespace === namespace);
      
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'DeploymentList',
      items: namespaceDeployments
    });
  });
};

// ============================================================================
// MUTATION HANDLERS
// ============================================================================

// Create deployment handler
export const createDeploymentHandler = (deployment: AppsV1Deployment[] = createDeploymentsListData()) => {
  return http.post(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments`, () => {
    return HttpResponse.json(deployment, { status: 201 });
  });
};

// Create deployment error handler
export const createDeploymentErrorHandler = (status: number = 400, message: string = 'Creation failed') => {
  return http.post(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments`, () => {
    return HttpResponse.json({ error: message }, { status });
  });
};

// Update deployment handler
export const updateDeploymentHandler = (deployment: AppsV1Deployment = createDeploymentsListData()[0]) => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name`, () => {
    return HttpResponse.json(deployment);
  });
};

// Update deployment error handler
export const updateDeploymentErrorHandler = (status: number = 400, message: string = 'Update failed') => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name`, () => {
    return HttpResponse.json({ error: message }, { status });
  });
};

// Delete deployment handler
export const deleteDeploymentHandler = () => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name`, () => {
    return HttpResponse.json({}, { status: 200 });
  });
};

// Delete deployment error handler
export const deleteDeploymentErrorHandler = (status: number = 404, message: string = 'Deletion failed') => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name`, () => {
    return HttpResponse.json({ error: message }, { status });
  });
};

// Scale deployment handler
export const scaleDeploymentHandler = (replicas: number = 3) => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name/scale`, () => {
    return HttpResponse.json({
      apiVersion: 'autoscaling/v1',
      kind: 'Scale',
      metadata: { name: 'test-deployment', namespace: 'default' },
      spec: { replicas }
    });
  });
};

// Scale deployment error handler
export const scaleDeploymentErrorHandler = (status: number = 400, message: string = 'Scaling failed') => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name/scale`, () => {
    return HttpResponse.json({ error: message }, { status });
  });
};

// Scale deployment with namespace validation handler
export const scaleDeploymentWithNamespaceValidationHandler = (replicas: number, expectedNamespace: string = 'default') => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name/scale`, ({ params }) => {
    expect(params.namespace).toBe(expectedNamespace);
    return HttpResponse.json({
      apiVersion: 'autoscaling/v1',
      kind: 'Scale',
      metadata: { name: 'test-deployment', namespace: expectedNamespace },
      spec: { replicas }
    });
  });
};

// Get single deployment by name handler
export const createDeploymentByName = (deployment: AppsV1Deployment, delay: number = 0, errorStatus?: number, errorMessage?: string) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/deployments/:name`, async ({ params }) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    if (errorStatus) {
      return HttpResponse.json(
        { error: errorMessage || 'Deployment not found' },
        { status: errorStatus }
      );
    }
    
    return HttpResponse.json(deployment);
  });
};
