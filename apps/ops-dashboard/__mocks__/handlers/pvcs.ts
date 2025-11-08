import { http, HttpResponse } from 'msw';

export const createPVCsListData = () => [
  {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: 'pvc-1',
      namespace: 'default',
      creationTimestamp: '2024-01-01T00:00:00Z'
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      storageClassName: 'fast-ssd',
      resources: {
        requests: {
          storage: '10Gi'
        }
      },
      volumeName: 'pv-1'
    },
    status: {
      phase: 'Bound',
      capacity: {
        storage: '10Gi'
      }
    }
  },
  {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: 'pvc-2',
      namespace: 'default',
      creationTimestamp: '2024-01-02T00:00:00Z'
    },
    spec: {
      accessModes: ['ReadWriteMany'],
      storageClassName: 'slow-hdd',
      resources: {
        requests: {
          storage: '20Gi'
        }
      }
    },
    status: {
      phase: 'Pending'
    }
  },
  {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: 'pvc-3',
      namespace: 'kube-system',
      creationTimestamp: '2024-01-03T00:00:00Z'
    },
    spec: {
      accessModes: ['ReadOnlyMany'],
      storageClassName: 'shared-storage',
      resources: {
        requests: {
          storage: '5Gi'
        }
      },
      volumeName: 'pv-3'
    },
    status: {
      phase: 'Lost'
    }
  },
  {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: 'pvc-4',
      namespace: 'production',
      creationTimestamp: '2024-01-04T00:00:00Z'
    },
    spec: {
      accessModes: ['ReadWriteOncePod'],
      storageClassName: 'premium-ssd',
      resources: {
        requests: {
          storage: '50Gi'
        }
      },
      volumeName: 'pv-4'
    },
    status: {
      phase: 'Bound',
      capacity: {
        storage: '50Gi'
      }
    }
  }
];

export const createPVCsList = () => {
  return http.get('/api/v1/namespaces/:namespace/persistentvolumeclaims', () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaimList',
      items: createPVCsListData()
    });
  });
};

export const createAllPVCsList = () => {
  return http.get('/api/v1/persistentvolumeclaims', () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaimList',
      items: createPVCsListData()
    });
  });
};

export const createPVCDelete = () => {
  return http.delete('/api/v1/namespaces/:namespace/persistentvolumeclaims/:name', () => {
    return HttpResponse.json({});
  });
};

export const createPVCsListError = () => {
  return http.get('/api/v1/namespaces/:namespace/persistentvolumeclaims', () => {
    return HttpResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  });
};

export const createPVCsListSlow = () => {
  return http.get('/api/v1/namespaces/:namespace/persistentvolumeclaims', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaimList',
      items: createPVCsListData()
    });
  });
};
