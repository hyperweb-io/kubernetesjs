import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { BatchV1CronJob } from "@kubernetesjs/ops"

export const createCronJobsListData = (): BatchV1CronJob[] => {
  return [
    {
      metadata: {
        name: 'backup-cronjob',
        namespace: 'default',
        uid: 'cronjob-1',
        labels: { app: 'backup' },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      spec: {
        schedule: '0 2 * * *', // Daily at 2 AM
        suspend: false,
        jobTemplate: {
          spec: {
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
          }
        }
      },
      status: {
        lastScheduleTime: '2024-01-15T02:00:00Z',
        lastSuccessfulTime: '2024-01-15T02:05:00Z',
        active: [
          {
            apiVersion: 'batch/v1',
            kind: 'Job',
            name: 'backup-cronjob-1760971200',
            namespace: 'default',
            uid: 'job-1'
          }
        ]
      }
    },
    {
      metadata: {
        name: 'cleanup-cronjob',
        namespace: 'default',
        uid: 'cronjob-2',
        labels: { app: 'cleanup' },
        creationTimestamp: '2024-01-15T11:00:00Z'
      },
      spec: {
        schedule: '0 0 * * 0', // Weekly on Sunday
        suspend: false,
        jobTemplate: {
          spec: {
            template: {
              metadata: { labels: { app: 'cleanup' } },
              spec: {
                containers: [{ 
                  name: 'cleanup', 
                  image: 'alpine:latest',
                  command: ['rm', '-rf', '/tmp/old-files']
                }],
                restartPolicy: 'Never'
              }
            }
          }
        }
      },
      status: {
        lastScheduleTime: '2024-01-14T00:00:00Z',
        lastSuccessfulTime: '2024-01-14T00:02:00Z',
        active: []
      }
    },
    {
      metadata: {
        name: 'suspended-cronjob',
        namespace: 'kube-system',
        uid: 'cronjob-3',
        labels: { app: 'maintenance' },
        creationTimestamp: '2024-01-15T12:00:00Z'
      },
      spec: {
        schedule: '0 */6 * * *', // Every 6 hours
        suspend: true,
        jobTemplate: {
          spec: {
            template: {
              metadata: { labels: { app: 'maintenance' } },
              spec: {
                containers: [{ 
                  name: 'maintenance', 
                  image: 'ubuntu:20.04',
                  command: ['apt', 'update']
                }],
                restartPolicy: 'Never'
              }
            }
          }
        }
      },
      status: {
        lastScheduleTime: '2024-01-15T06:00:00Z',
        lastSuccessfulTime: '2024-01-15T06:01:00Z',
        active: []
      }
    }
  ]
}

export const createCronJobsList = (cronjobs: BatchV1CronJob[] = createCronJobsListData()) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs`, ({ params, request }) => {
    const namespace = params.namespace as string
    const namespaceCronJobs = cronjobs.filter(cj => cj.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'batch/v1',
      kind: 'CronJobList',
      items: namespaceCronJobs
    })
  })
}

export const createAllCronJobsList = (cronjobs: BatchV1CronJob[] = createCronJobsListData()) => {
  return http.get(`${API_BASE}/apis/batch/v1/cronjobs`, () => {
    return HttpResponse.json({
      apiVersion: 'batch/v1',
      kind: 'CronJobList',
      items: cronjobs
    })
  })
}

// Error handlers
export const createCronJobsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllCronJobsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/batch/v1/cronjobs`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createCronJobsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createCronJobsListSlow = (cronjobs: BatchV1CronJob[] = createCronJobsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceCronJobs = cronjobs.filter(cj => cj.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'batch/v1',
      kind: 'CronJobList',
      items: namespaceCronJobs
    })
  })
}

// CronJob by name handler
export const createCronJobByName = (cronjobs: BatchV1CronJob[] = createCronJobsListData()) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs/:name`, ({ params }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    const cronjob = cronjobs.find(cj => cj.metadata.namespace === namespace && cj.metadata.name === name)

    if (!cronjob) {
      return HttpResponse.json(
        { error: 'CronJob not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(cronjob)
  })
}

// CronJob details handler (alias for createCronJobByName)
export const createCronJobDetails = (cronjob: BatchV1CronJob) => {
  return http.get(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs/:name`, ({ params }) => {
    if (params.name === cronjob.metadata?.name && params.namespace === cronjob.metadata?.namespace) {
      return HttpResponse.json(cronjob)
    }
    return HttpResponse.json({ error: 'CronJob not found' }, { status: 404 })
  })
}

// Delete CronJob handler
export const createCronJobDelete = () => {
  return http.delete(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs/:name`, () => {
    return HttpResponse.json({})
  })
}

// Patch CronJob handler (for suspend/unsuspend)
export const createCronJobPatch = () => {
  return http.patch(`${API_BASE}/apis/batch/v1/namespaces/:namespace/cronjobs/:name`, () => {
    return HttpResponse.json({})
  })
}
