import { http, HttpResponse } from 'msw';

export const createStorageClassesListData = () => [
  {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: 'fast-ssd',
      creationTimestamp: '2024-01-01T00:00:00Z',
      annotations: {
        'storageclass.kubernetes.io/is-default-class': 'true'
      }
    },
    provisioner: 'kubernetes.io/aws-ebs',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    parameters: {
      type: 'gp3',
      fsType: 'ext4'
    }
  },
  {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: 'slow-hdd',
      creationTimestamp: '2024-01-02T00:00:00Z'
    },
    provisioner: 'kubernetes.io/azure-disk',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: false,
    parameters: {
      storageaccounttype: 'Standard_LRS',
      kind: 'managed'
    }
  },
  {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: 'nfs-storage',
      creationTimestamp: '2024-01-03T00:00:00Z'
    },
    provisioner: 'kubernetes.io/nfs',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: true,
    parameters: {
      server: 'nfs.example.com',
      path: '/exports'
    }
  },
  {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: 'local-storage',
      creationTimestamp: '2024-01-04T00:00:00Z'
    },
    provisioner: 'kubernetes.io/local',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: false,
    parameters: {
      type: 'ssd'
    }
  }
];

export const createStorageClassDelete = () =>
  http.delete('/apis/storage.k8s.io/v1/storageclasses/:name', ({ params }) => {
    const { name } = params;
    return HttpResponse.json({
      apiVersion: 'storage.k8s.io/v1',
      kind: 'StorageClass',
      metadata: { name }
    });
  });

export const createStorageClassesList = () =>
  http.get('/apis/storage.k8s.io/v1/storageclasses', () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'StorageClassList',
      items: createStorageClassesListData()
    });
  });

export const createStorageClassesListError = () =>
  http.get('/apis/storage.k8s.io/v1/storageclasses', () => {
    return HttpResponse.error();
  });

export const createStorageClassesListSlow = () =>
  http.get('/apis/storage.k8s.io/v1/storageclasses', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'StorageClassList',
      items: createStorageClassesListData()
    });
  });
