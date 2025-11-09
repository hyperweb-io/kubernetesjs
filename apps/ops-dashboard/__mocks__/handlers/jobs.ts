import { BatchV1Job } from '@kubernetesjs/ops';
import { http, HttpResponse } from 'msw';

import { API_BASE } from './common';

export const createJobsListData = (): BatchV1Job[] => {
  return [
    {
      metadata: {
        name: 'data-processing-job',
        namespace: 'default',
        uid: 'job-1',
        labels: { app: 'data-processor' },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      spec: {
        completions: 1,
        parallelism: 1,
        template: {
          metadata: { labels: { app: 'data-processor' } },
          spec: {
            containers: [{ 
              name: 'processor', 
              image: 'python:3.9',
              command: ['python', 'process.py']
            }],
            restartPolicy: 'Never'
          }
        }
      },
      status: {
        active: 0,
        succeeded: 1,
        failed: 0,
        startTime: '2024-01-15T10:30:00Z',
        completionTime: '2024-01-15T10:35:00Z',
        conditions: [
          {
            type: 'Complete',
            status: 'True',
            lastProbeTime: '2024-01-15T10:35:00Z',
            lastTransitionTime: '2024-01-15T10:35:00Z'
          }
        ]
      }
    },
    {
      metadata: {
        name: 'backup-job',
        namespace: 'default',
        uid: 'job-2',
        labels: { app: 'backup' },
        creationTimestamp: '2024-01-15T11:00:00Z'
      },
      spec: {
        completions: 3,
        parallelism: 1,
        template: {
          metadata: { labels: { app: 'backup' } },
          spec: {
            containers: [{ 
              name: 'backup', 
              image: 'postgres:13',
              command: ['pg_dump']
            }],
            restartPolicy: 'Never'
          }
        }
      },
      status: {
        active: 1,
        succeeded: 2,
        failed: 0,
        startTime: '2024-01-15T11:00:00Z',
        conditions: [
          {
            type: 'Progressing',
            status: 'True',
            lastProbeTime: '2024-01-15T11:00:00Z',
            lastTransitionTime: '2024-01-15T11:00:00Z'
          }
        ]
      }
    },
    {
      metadata: {
        name: 'failed-job',
        namespace: 'kube-system',
        uid: 'job-3',
        labels: { app: 'failed-task' },
        creationTimestamp: '2024-01-15T12:00:00Z'
      },
      spec: {
        completions: 1,
        parallelism: 1,
        template: {
          metadata: { labels: { app: 'failed-task' } },
          spec: {
            containers: [{ 
              name: 'task', 
              image: 'invalid-image:latest',
              command: ['run']
            }],
            restartPolicy: 'Never'
          }
        }
      },
      status: {
        active: 0,
        succeeded: 0,
        failed: 1,
        startTime: '2024-01-15T12:00:00Z',
        conditions: [
          {
            type: 'Failed',
            status: 'True',
            lastProbeTime: '2024-01-15T12:05:00Z',
            lastTransitionTime: '2024-01-15T12:05:00Z'
          }
        ]
      }
    }
  ];
};

export const createJobsList = (jobs: BatchV1Job[] = createJobsListData()) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs`, ({ params, request }) => {
    const namespace = params.namespace as string;
    const namespaceJobs = jobs.filter(job => job.metadata.namespace === namespace);

    return HttpResponse.json({
      apiVersion: 'batch/v1',
      kind: 'JobList',
      items: namespaceJobs
    });
  });
};

export const createAllJobsList = (jobs: BatchV1Job[] = createJobsListData()) => {
  return http.get(`${API_BASE}/apis/batch/v1/jobs`, () => {
    return HttpResponse.json({
      apiVersion: 'batch/v1',
      kind: 'JobList',
      items: jobs
    });
  });
};

// Error handlers
export const createJobsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

export const createAllJobsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/batch/v1/jobs`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    );
  });
};

// Network error handler
export const createJobsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs`, () => {
    return HttpResponse.error();
  });
};

// Slow response handler for testing loading states
export const createJobsListSlow = (jobs: BatchV1Job[] = createJobsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    const namespace = params.namespace as string;
    const namespaceJobs = jobs.filter(job => job.metadata.namespace === namespace);

    return HttpResponse.json({
      apiVersion: 'batch/v1',
      kind: 'JobList',
      items: namespaceJobs
    });
  });
};

// Job by name handler
export const createJobByName = (jobs: BatchV1Job[] = createJobsListData()) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs/:name`, ({ params }) => {
    const namespace = params.namespace as string;
    const name = params.name as string;
    const job = jobs.find(job => job.metadata.namespace === namespace && job.metadata.name === name);

    if (!job) {
      return HttpResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(job);
  });
};

// Job details handler (alias for createJobByName)
export const createJobDetails = (job: BatchV1Job) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs/:name`, ({ params }) => {
    if (params.name === job.metadata?.name && params.namespace === job.metadata?.namespace) {
      return HttpResponse.json(job);
    }
    return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
  });
};

// Delete Job handler
export const createJobDelete = () => {
  return http.delete(`${API_BASE}/apis/batch/v1/namespaces/:namespace/jobs/:name`, () => {
    return HttpResponse.json({});
  });
};
