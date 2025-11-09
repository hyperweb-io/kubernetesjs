import { http, HttpResponse } from 'msw';

export const createRoleBindingsListData = () => [
  {
    metadata: {
      name: 'admin-binding',
      namespace: 'default',
      uid: 'admin-binding-uid',
      creationTimestamp: '2024-01-01T00:00:00Z'
    },
    roleRef: {
      kind: 'Role',
      name: 'admin'
    },
    subjects: [
      {
        kind: 'User',
        name: 'admin-user',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ]
  },
  {
    metadata: {
      name: 'service-account-binding',
      namespace: 'kube-system',
      uid: 'service-account-binding-uid',
      creationTimestamp: '2024-01-02T00:00:00Z'
    },
    roleRef: {
      kind: 'ClusterRole',
      name: 'system:node'
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'kubelet',
        namespace: 'kube-system',
        apiGroup: ''
      }
    ]
  },
  {
    metadata: {
      name: 'group-binding',
      namespace: 'default',
      uid: 'group-binding-uid',
      creationTimestamp: '2024-01-03T00:00:00Z'
    },
    roleRef: {
      kind: 'Role',
      name: 'viewer'
    },
    subjects: [
      {
        kind: 'Group',
        name: 'developers',
        apiGroup: 'rbac.authorization.k8s.io'
      },
      {
        kind: 'User',
        name: 'developer1',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ]
  },
  {
    metadata: {
      name: 'cluster-admin-binding',
      namespace: 'default',
      uid: 'cluster-admin-binding-uid',
      creationTimestamp: '2024-01-04T00:00:00Z'
    },
    roleRef: {
      kind: 'ClusterRole',
      name: 'cluster-admin'
    },
    subjects: [
      {
        kind: 'User',
        name: 'cluster-admin',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ]
  }
];

export const createClusterRoleBindingsListData = () => [
  {
    metadata: {
      name: 'cluster-admin-binding',
      uid: 'cluster-admin-binding-uid',
      creationTimestamp: '2024-01-01T00:00:00Z'
    },
    roleRef: {
      kind: 'ClusterRole',
      name: 'cluster-admin'
    },
    subjects: [
      {
        kind: 'User',
        name: 'cluster-admin',
        apiGroup: 'rbac.authorization.k8s.io'
      }
    ]
  },
  {
    metadata: {
      name: 'system-node-binding',
      uid: 'system-node-binding-uid',
      creationTimestamp: '2024-01-02T00:00:00Z'
    },
    roleRef: {
      kind: 'ClusterRole',
      name: 'system:node'
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'kubelet',
        namespace: 'kube-system',
        apiGroup: ''
      }
    ]
  },
  {
    metadata: {
      name: 'system-controller-binding',
      uid: 'system-controller-binding-uid',
      creationTimestamp: '2024-01-03T00:00:00Z'
    },
    roleRef: {
      kind: 'ClusterRole',
      name: 'system:controller'
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'controller-manager',
        namespace: 'kube-system',
        apiGroup: ''
      }
    ]
  }
];

export const createRoleBindingDelete = () =>
  http.delete('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/rolebindings/:name', ({ params }) => {
    const { namespace, name } = params;
    return HttpResponse.json({
      metadata: {
        name,
        namespace,
        deletionTimestamp: new Date().toISOString()
      }
    });
  });

export const createClusterRoleBindingDelete = () =>
  http.delete('/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/:name', ({ params }) => {
    const { name } = params;
    return HttpResponse.json({
      metadata: {
        name,
        deletionTimestamp: new Date().toISOString()
      }
    });
  });

export const createRoleBindingsList = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/rolebindings', ({ request }) => {
    const url = new URL(request.url);
    const namespace = url.pathname.split('/')[4];
    
    const data = createRoleBindingsListData().filter(binding => 
      binding.metadata.namespace === namespace
    );
    
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBindingList',
      items: data
    });
  });

export const createAllRoleBindingsList = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/rolebindings', () => {
    const data = createRoleBindingsListData();
    
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBindingList',
      items: data
    });
  });

export const createClusterRoleBindingsList = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/clusterrolebindings', () => {
    const data = createClusterRoleBindingsListData();
    
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRoleBindingList',
      items: data
    });
  });

export const createRoleBindingsListError = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/rolebindings', () => {
    return HttpResponse.json(
      { error: 'Network request failed' },
      { status: 500 }
    );
  });

export const createRoleBindingsListSlow = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/namespaces/:namespace/rolebindings', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBindingList',
      items: []
    });
  });

export const createClusterRoleBindingsListError = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/clusterrolebindings', () => {
    return HttpResponse.json(
      { error: 'Network request failed' },
      { status: 500 }
    );
  });

export const createClusterRoleBindingsListSlow = () =>
  http.get('/apis/rbac.authorization.k8s.io/v1/clusterrolebindings', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return HttpResponse.json({
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRoleBindingList',
      items: []
    });
  });
