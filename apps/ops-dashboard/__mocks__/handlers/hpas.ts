import { AutoscalingV2HorizontalPodAutoscaler } from '@kubernetesjs/ops';
import { http, HttpResponse } from 'msw';

import { API_BASE } from './common';

export const createHPAsListData = (): AutoscalingV2HorizontalPodAutoscaler[] => {
  return [
    {
      metadata: {
        name: 'web-hpa',
        namespace: 'default',
        uid: 'hpa-1',
        labels: { app: 'web' },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      spec: {
        scaleTargetRef: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'web-deployment'
        },
        minReplicas: 2,
        maxReplicas: 10,
        metrics: [
          {
            type: 'Resource',
            resource: {
              name: 'cpu',
              target: {
                type: 'Utilization',
                averageUtilization: 70
              }
            }
          }
        ]
      },
      status: {
        currentReplicas: 3,
        desiredReplicas: 5,
        conditions: [
          {
            type: 'AbleToScale',
            status: 'True',
            lastTransitionTime: '2024-01-15T10:30:00Z',
            reason: 'ReadyForNewScale',
            message: 'recommended size matches current size'
          },
          {
            type: 'ScalingActive',
            status: 'True',
            lastTransitionTime: '2024-01-15T10:30:00Z',
            reason: 'ValidMetricFound',
            message: 'the HPA was able to successfully calculate a replica count from cpu resource utilization'
          }
        ]
      }
    },
    {
      metadata: {
        name: 'api-hpa',
        namespace: 'default',
        uid: 'hpa-2',
        labels: { app: 'api' },
        creationTimestamp: '2024-01-15T11:00:00Z'
      },
      spec: {
        scaleTargetRef: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'api-deployment'
        },
        minReplicas: 1,
        maxReplicas: 5,
        metrics: [
          {
            type: 'Resource',
            resource: {
              name: 'memory',
              target: {
                type: 'Utilization',
                averageUtilization: 80
              }
            }
          }
        ]
      },
      status: {
        currentReplicas: 2,
        desiredReplicas: 2,
        conditions: [
          {
            type: 'AbleToScale',
            status: 'True',
            lastTransitionTime: '2024-01-15T11:00:00Z',
            reason: 'ReadyForNewScale',
            message: 'recommended size matches current size'
          },
          {
            type: 'ScalingActive',
            status: 'False',
            lastTransitionTime: '2024-01-15T11:00:00Z',
            reason: 'InsufficientData',
            message: 'the HPA was unable to compute the replica count'
          }
        ]
      }
    },
    {
      metadata: {
        name: 'db-hpa',
        namespace: 'kube-system',
        uid: 'hpa-3',
        labels: { app: 'database' },
        creationTimestamp: '2024-01-15T12:00:00Z'
      },
      spec: {
        scaleTargetRef: {
          apiVersion: 'apps/v1',
          kind: 'StatefulSet',
          name: 'db-statefulset'
        },
        minReplicas: 1,
        maxReplicas: 3,
        metrics: []
      },
      status: {
        currentReplicas: 1,
        desiredReplicas: 1,
        conditions: [
          {
            type: 'AbleToScale',
            status: 'False',
            lastTransitionTime: '2024-01-15T12:00:00Z',
            reason: 'FailedGetScale',
            message: 'the HPA controller was unable to get the target\'s current scale'
          }
        ]
      }
    }
  ];
};

export const createHPAsList = (hpas: AutoscalingV2HorizontalPodAutoscaler[] = createHPAsListData()) => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers`, ({ params, request }) => {
    const namespace = params.namespace as string;
    const namespaceHPAs = hpas.filter(hpa => hpa.metadata.namespace === namespace);

    return HttpResponse.json({
      apiVersion: 'autoscaling/v2',
      kind: 'HorizontalPodAutoscalerList',
      items: namespaceHPAs
    });
  });
};

export const createAllHPAsList = (hpas: AutoscalingV2HorizontalPodAutoscaler[] = createHPAsListData()) => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/horizontalpodautoscalers`, () => {
    return HttpResponse.json({
      apiVersion: 'autoscaling/v2',
      kind: 'HorizontalPodAutoscalerList',
      items: hpas
    });
  });
};

// Error handlers
export const createHPAsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createAllHPAsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/horizontalpodautoscalers`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Network error handler
export const createHPAsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers`, () => {
    return HttpResponse.error();
  });
};

// Slow response handler for testing loading states
export const createHPAsListSlow = (hpas: AutoscalingV2HorizontalPodAutoscaler[] = createHPAsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    const namespace = params.namespace as string;
    const namespaceHPAs = hpas.filter(hpa => hpa.metadata.namespace === namespace);

    return HttpResponse.json({
      apiVersion: 'autoscaling/v2',
      kind: 'HorizontalPodAutoscalerList',
      items: namespaceHPAs
    });
  });
};

// HPA by name handler
export const createHPAByName = (hpas: AutoscalingV2HorizontalPodAutoscaler[] = createHPAsListData()) => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers/:name`, ({ params }) => {
    const namespace = params.namespace as string;
    const name = params.name as string;
    const hpa = hpas.find(hpa => hpa.metadata.namespace === namespace && hpa.metadata.name === name);

    if (!hpa) {
      return HttpResponse.json(
        { error: 'HorizontalPodAutoscaler not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(hpa);
  });
};

// HPA details handler (alias for createHPAByName)
export const createHPADetails = (hpa: AutoscalingV2HorizontalPodAutoscaler) => {
  return http.get(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers/:name`, ({ params }) => {
    if (params.name === hpa.metadata?.name && params.namespace === hpa.metadata?.namespace) {
      return HttpResponse.json(hpa);
    }
    return HttpResponse.json({ error: 'HorizontalPodAutoscaler not found' }, { status: 404 });
  });
};

// Delete HPA handler
export const createHPADelete = () => {
  return http.delete(`${API_BASE}/apis/autoscaling/v2/namespaces/:namespace/horizontalpodautoscalers/:name`, () => {
    return HttpResponse.json({});
  });
};
