import { http, HttpResponse } from 'msw'
import type { ServiceAccount } from '@interweb/interwebjs'

export function createServiceAccountsListData(): ServiceAccount[] {
  return [
    {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: 'default',
        namespace: 'default',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      secrets: [
        { name: 'default-token-abc123' }
      ],
      imagePullSecrets: [],
      automountServiceAccountToken: true
    },
    {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: 'system:serviceaccount:kube-system:default',
        namespace: 'kube-system',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      secrets: [
        { name: 'system-token-xyz789' },
        { name: 'system-token-def456' }
      ],
      imagePullSecrets: [
        { name: 'registry-secret' }
      ],
      automountServiceAccountToken: true
    },
    {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: 'user-account',
        namespace: 'default',
        creationTimestamp: '2024-01-02T00:00:00Z'
      },
      secrets: [],
      imagePullSecrets: [],
      automountServiceAccountToken: false
    },
    {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: 'controller-manager',
        namespace: 'kube-system',
        creationTimestamp: '2024-01-01T00:00:00Z'
      },
      secrets: [
        { name: 'controller-token-ghi789' }
      ],
      imagePullSecrets: [],
      automountServiceAccountToken: true
    },
    {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: 'operator-account',
        namespace: 'operators',
        creationTimestamp: '2024-01-03T00:00:00Z'
      },
      secrets: [
        { name: 'operator-token-jkl012' }
      ],
      imagePullSecrets: [
        { name: 'operator-registry-secret' }
      ],
      automountServiceAccountToken: true
    }
  ]
}

export function createServiceAccountDelete() {
  return http.delete('/api/v1/namespaces/:namespace/serviceaccounts/:name', () => {
    return HttpResponse.json({})
  })
}

export function createServiceAccountsList() {
  return http.get('/api/v1/namespaces/:namespace/serviceaccounts', ({ request }) => {
    const url = new URL(request.url)
    const namespace = url.pathname.split('/')[4]
    
    if (namespace === 'default') {
      return HttpResponse.json({
        apiVersion: 'v1',
        kind: 'ServiceAccountList',
        items: createServiceAccountsListData().filter(sa => sa.metadata?.namespace === 'default')
      })
    }
    
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ServiceAccountList',
      items: createServiceAccountsListData()
    })
  })
}

export function createAllServiceAccountsList() {
  return http.get('/api/v1/serviceaccounts', () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ServiceAccountList',
      items: createServiceAccountsListData()
    })
  })
}

export function createServiceAccountsListError() {
  return http.get('/api/v1/namespaces/:namespace/serviceaccounts', () => {
    return HttpResponse.error()
  })
}

export function createServiceAccountsListSlow() {
  return http.get('/api/v1/namespaces/:namespace/serviceaccounts', () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          apiVersion: 'v1',
          kind: 'ServiceAccountList',
          items: createServiceAccountsListData()
        }))
      }, 2000)
    })
  })
}
