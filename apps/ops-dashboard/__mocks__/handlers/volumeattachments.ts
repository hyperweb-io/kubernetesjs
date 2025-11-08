import { http, HttpResponse } from 'msw'
import { type RequestHandler } from 'msw'

// Sample Volume Attachment data
export const createVolumeAttachmentsListData = () => [
  {
    metadata: {
      name: 'attachment-1',
      creationTimestamp: '2024-01-15T10:30:00Z',
      uid: 'attachment-1-uid'
    },
    spec: {
      attacher: 'csi.kubernetes.io',
      nodeName: 'worker-node-1',
      source: {
        persistentVolumeName: 'pv-1'
      }
    },
    status: {
      attached: true,
      attachError: null,
      detachError: null
    }
  },
  {
    metadata: {
      name: 'attachment-2',
      creationTimestamp: '2024-01-15T11:00:00Z',
      uid: 'attachment-2-uid'
    },
    spec: {
      attacher: 'csi.kubernetes.io',
      nodeName: 'worker-node-2',
      source: {
        persistentVolumeName: 'pv-2'
      }
    },
    status: {
      attached: false,
      attachError: {
        message: 'Failed to attach volume'
      },
      detachError: null
    }
  },
  {
    metadata: {
      name: 'attachment-3',
      creationTimestamp: '2024-01-15T11:30:00Z',
      uid: 'attachment-3-uid'
    },
    spec: {
      attacher: 'csi.kubernetes.io',
      nodeName: 'worker-node-1',
      source: {
        persistentVolumeName: 'pv-3'
      }
    },
    status: {
      attached: true,
      attachError: null,
      detachError: {
        message: 'Failed to detach volume'
      }
    }
  }
]

// Volume Attachment handlers
export const createVolumeAttachmentDelete = (): RequestHandler =>
  http.delete('/apis/storage.k8s.io/v1/volumeattachments/:name', ({ params }) => {
    const { name } = params
    return HttpResponse.json({ 
      message: `Volume attachment ${name} deleted successfully` 
    })
  })

export const createVolumeAttachmentsList = (): RequestHandler =>
  http.get('/apis/storage.k8s.io/v1/volumeattachments', () => {
    return HttpResponse.json({
      apiVersion: 'storage.k8s.io/v1',
      kind: 'VolumeAttachmentList',
      items: createVolumeAttachmentsListData()
    })
  })

// Error handlers
export const createVolumeAttachmentsError = (): RequestHandler =>
  http.get('/apis/storage.k8s.io/v1/volumeattachments', () => {
    return HttpResponse.json(
      { error: 'Failed to fetch volume attachments' },
      { status: 500 }
    )
  })

export const createVolumeAttachmentsSlow = (): RequestHandler =>
  http.get('/apis/storage.k8s.io/v1/volumeattachments', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return HttpResponse.json({
      apiVersion: 'storage.k8s.io/v1',
      kind: 'VolumeAttachmentList',
      items: createVolumeAttachmentsListData()
    })
  })
