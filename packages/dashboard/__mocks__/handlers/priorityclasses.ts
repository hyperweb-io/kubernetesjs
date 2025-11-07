import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { SchedulingK8sIoV1PriorityClass } from "@interweb/interwebjs"

export const createPriorityClassesListData = (): SchedulingK8sIoV1PriorityClass[] => {
  return [
    {
      metadata: {
        name: 'system-critical',
        uid: 'pc-1'
      },
      value: 2000000000,
      globalDefault: false,
      description: 'System critical priority class',
      preemptionPolicy: 'PreemptLowerPriority'
    },
    {
      metadata: {
        name: 'cluster-critical',
        uid: 'pc-2'
      },
      value: 1000000000,
      globalDefault: false,
      description: 'Cluster critical priority class',
      preemptionPolicy: 'PreemptLowerPriority'
    },
    {
      metadata: {
        name: 'high-priority',
        uid: 'pc-3'
      },
      value: 1000000,
      globalDefault: false,
      description: 'High priority class',
      preemptionPolicy: 'PreemptLowerPriority'
    },
    {
      metadata: {
        name: 'default-priority',
        uid: 'pc-4'
      },
      value: 0,
      globalDefault: true,
      description: 'Default priority class',
      preemptionPolicy: 'PreemptLowerPriority'
    },
    {
      metadata: {
        name: 'low-priority',
        uid: 'pc-5'
      },
      value: -1000000,
      globalDefault: false,
      description: 'Low priority class',
      preemptionPolicy: 'Never'
    }
  ]
}

export const createPriorityClassesList = (priorityClasses: SchedulingK8sIoV1PriorityClass[] = createPriorityClassesListData()) => {
  return http.get(`${API_BASE}/apis/scheduling.k8s.io/v1/priorityclasses`, () => {
    return HttpResponse.json({
      apiVersion: 'scheduling.k8s.io/v1',
      kind: 'PriorityClassList',
      items: priorityClasses
    })
  })
}

export const createPriorityClassesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/scheduling.k8s.io/v1/priorityclasses`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createPriorityClassesListSlow = (priorityClasses: SchedulingK8sIoV1PriorityClass[] = createPriorityClassesListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/scheduling.k8s.io/v1/priorityclasses`, async () => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return HttpResponse.json({
      apiVersion: 'scheduling.k8s.io/v1',
      kind: 'PriorityClassList',
      items: priorityClasses
    })
  })
}

export const deletePriorityClassHandler = (name: string) => {
  return http.delete(`${API_BASE}/apis/scheduling.k8s.io/v1/priorityclasses/:name`, ({ params }) => {
    if (params.name === name) {
      return HttpResponse.json({}, { status: 200 })
    }
    return HttpResponse.json({ error: 'Priority class not found' }, { status: 404 })
  })
}

export const deletePriorityClassErrorHandler = (name: string, status: number = 500, message: string = 'Deletion failed') => {
  return http.delete(`${API_BASE}/apis/scheduling.k8s.io/v1/priorityclasses/:name`, ({ params }) => {
    if (params.name === name) {
      return HttpResponse.json({ error: message }, { status })
    }
    return HttpResponse.json({ error: 'Priority class not found' }, { status: 404 })
  })
}