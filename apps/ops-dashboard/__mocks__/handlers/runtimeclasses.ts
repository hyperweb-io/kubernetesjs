import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { NodeK8sIoV1RuntimeClass } from "@kubernetesjs/ops"

export const createRuntimeClassesListData = (): NodeK8sIoV1RuntimeClass[] => {
  return [
    {
      metadata: {
        name: 'runc',
        uid: 'rc-1'
      },
      handler: 'runc',
      scheduling: {
        nodeSelector: { 'kubernetes.io/arch': 'amd64' },
        tolerations: [{ key: 'node-role.kubernetes.io/master', operator: 'Exists' }]
      },
      overhead: { podFixed: { cpu: '200m', memory: '128Mi' } }
    },
    {
      metadata: {
        name: 'gvisor',
        uid: 'rc-2'
      },
      handler: 'runsc',
      scheduling: {
        nodeSelector: { 'cloud.google.com/gke-gvisor': 'true' }
      },
      overhead: { podFixed: { cpu: '100m', memory: '64Mi' } }
    },
    {
      metadata: {
        name: 'kata',
        uid: 'rc-3'
      },
      handler: 'kata-containers',
      scheduling: null,
      overhead: null
    },
    {
      metadata: {
        name: 'crun',
        uid: 'rc-4'
      },
      handler: 'crun',
      scheduling: {
        nodeSelector: { 'kubernetes.io/os': 'linux' }
      },
      overhead: { podFixed: { cpu: '50m', memory: '32Mi' } }
    }
  ]
}

export const createRuntimeClassesList = (runtimeClasses: NodeK8sIoV1RuntimeClass[] = createRuntimeClassesListData()) => {
  return http.get(`${API_BASE}/apis/node.k8s.io/v1/runtimeclasses`, () => {
    return HttpResponse.json({
      apiVersion: 'node.k8s.io/v1',
      kind: 'RuntimeClassList',
      items: runtimeClasses
    })
  })
}

export const createRuntimeClassesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/node.k8s.io/v1/runtimeclasses`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createRuntimeClassesListSlow = (runtimeClasses: NodeK8sIoV1RuntimeClass[] = createRuntimeClassesListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/node.k8s.io/v1/runtimeclasses`, async () => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return HttpResponse.json({
      apiVersion: 'node.k8s.io/v1',
      kind: 'RuntimeClassList',
      items: runtimeClasses
    })
  })
}

export const deleteRuntimeClassHandler = (name: string) => {
  return http.delete(`${API_BASE}/apis/node.k8s.io/v1/runtimeclasses/:name`, ({ params }) => {
    if (params.name === name) {
      return HttpResponse.json({}, { status: 200 })
    }
    return HttpResponse.json({ error: 'Runtime class not found' }, { status: 404 })
  })
}

export const deleteRuntimeClassErrorHandler = (name: string, status: number = 500, message: string = 'Deletion failed') => {
  return http.delete(`${API_BASE}/apis/node.k8s.io/v1/runtimeclasses/:name`, ({ params }) => {
    if (params.name === name) {
      return HttpResponse.json({ error: message }, { status })
    }
    return HttpResponse.json({ error: 'Runtime class not found' }, { status: 404 })
  })
}