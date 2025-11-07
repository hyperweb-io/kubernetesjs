import { http, HttpResponse } from 'msw'
import type { RbacAuthorizationK8sIoV1Role as Role, RbacAuthorizationK8sIoV1ClusterRole as ClusterRole } from '@interweb/interwebjs'

export function createRolesListData(): Role[] {
  return [
    {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      metadata: {
        name: 'admin',
        namespace: 'default',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      rules: [
        {
          apiGroups: [''],
          resources: ['pods', 'services'],
          verbs: ['get', 'list', 'create', 'update', 'delete']
        },
        {
          apiGroups: ['apps'],
          resources: ['deployments'],
          verbs: ['*']
        }
      ]
    },
    {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      metadata: {
        name: 'viewer',
        namespace: 'default',
        creationTimestamp: '2024-01-02T00:00:00Z'
      },
      rules: [
        {
          apiGroups: [''],
          resources: ['pods', 'services'],
          verbs: ['get', 'list']
        }
      ]
    },
    {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      metadata: {
        name: 'system:service-account-controller',
        namespace: 'kube-system',
        creationTimestamp: '2024-01-01T00:00:00Z',
        labels: {
          'kubernetes.io/bootstrapping': 'rbac-defaults'
        }
      },
      rules: [
        {
          apiGroups: [''],
          resources: ['*'],
          verbs: ['*']
        }
      ]
    }
  ]
}

export function createClusterRolesListData(): ClusterRole[] {
  return [
    {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRole',
      metadata: {
        name: 'cluster-admin',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      rules: [
        {
          apiGroups: ['*'],
          resources: ['*'],
          verbs: ['*']
        }
      ]
    },
    {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRole',
      metadata: {
        name: 'view',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      rules: [
        {
          apiGroups: [''],
          resources: ['*'],
          verbs: ['get', 'list', 'watch']
        }
      ]
    },
    {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRole',
      metadata: {
        name: 'system:node',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      rules: [
        {
          apiGroups: [''],
          resources: ['nodes'],
          verbs: ['get', 'list', 'watch']
        }
      ]
    }
  ]
}

export function createRoleDelete() {
  return http.delete('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/roles/:name', () => {
    return HttpResponse.json({})
  })
}

export function createClusterRoleDelete() {
  return http.delete('/apis/rbac.authorization.k8s.io/v1/clusterroles/:name', () => {
    return HttpResponse.json({})
  })
}

export function createRolesList() {
  return http.get('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/roles', ({ request }) => {
    const url = new URL(request.url)
    const namespace = url.pathname.split('/')[5]
    
    if (namespace === 'default') {
      return HttpResponse.json({
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'RoleList',
        items: createRolesListData().filter(role => role.metadata?.namespace === 'default')
      })
    }
    
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleList',
      items: createRolesListData()
    })
  })
}

export function createAllRolesList() {
  return http.get('/apis/rbac.authorization.k8s.io/v1/roles', () => {
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleList',
      items: createRolesListData()
    })
  })
}

export function createClusterRolesList() {
  return http.get('/apis/rbac.authorization.k8s.io/v1/clusterroles', () => {
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRoleList',
      items: createClusterRolesListData()
    })
  })
}

export function createRolesListError() {
  return http.get('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/roles', () => {
    return HttpResponse.error()
  })
}

export function createRolesListSlow() {
  return http.get('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/roles', () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          apiVersion: 'rbac.authorization.k8s.io/v1',
          kind: 'RoleList',
          items: createRolesListData()
        }))
      }, 2000)
    })
  })
}
