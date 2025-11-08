import { http, HttpResponse } from 'msw'

export const createPVsListData = () => [
  {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: 'pv-1',
      creationTimestamp: '2024-01-01T00:00:00Z'
    },
    spec: {
      capacity: { storage: '10Gi' },
      accessModes: ['ReadWriteOnce'],
      storageClassName: 'fast-ssd',
      persistentVolumeReclaimPolicy: 'Retain',
      volumeMode: 'Filesystem',
      claimRef: {
        namespace: 'default',
        name: 'pvc-1'
      }
    },
    status: {
      phase: 'Bound'
    }
  },
  {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: 'pv-2',
      creationTimestamp: '2024-01-02T00:00:00Z'
    },
    spec: {
      capacity: { storage: '20Gi' },
      accessModes: ['ReadWriteMany'],
      storageClassName: 'slow-hdd',
      persistentVolumeReclaimPolicy: 'Delete',
      volumeMode: 'Filesystem'
    },
    status: {
      phase: 'Available'
    }
  },
  {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: 'pv-3',
      creationTimestamp: '2024-01-03T00:00:00Z'
    },
    spec: {
      capacity: { storage: '5Gi' },
      accessModes: ['ReadOnlyMany'],
      storageClassName: 'shared-storage',
      persistentVolumeReclaimPolicy: 'Retain',
      volumeMode: 'Block'
    },
    status: {
      phase: 'Released'
    }
  },
  {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: 'pv-4',
      creationTimestamp: '2024-01-04T00:00:00Z'
    },
    spec: {
      capacity: { storage: '50Gi' },
      accessModes: ['ReadWriteOncePod'],
      storageClassName: 'premium-ssd',
      persistentVolumeReclaimPolicy: 'Retain',
      volumeMode: 'Filesystem'
    },
    status: {
      phase: 'Failed'
    }
  }
]

export const createPVsList = () => {
  return http.get('/api/v1/persistentvolumes', () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PersistentVolumeList',
      items: createPVsListData()
    })
  })
}

export const createPVDelete = () => {
  return http.delete('/api/v1/persistentvolumes/:name', () => {
    return HttpResponse.json({})
  })
}

export const createPVsListError = () => {
  return http.get('/api/v1/persistentvolumes', () => {
    return HttpResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    )
  })
}

export const createPVsListSlow = () => {
  return http.get('/api/v1/persistentvolumes', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'PersistentVolumeList',
      items: createPVsListData()
    })
  })
}
