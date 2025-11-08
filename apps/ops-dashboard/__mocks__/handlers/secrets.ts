import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { V1Secret } from "@kubernetesjs/ops"

export const createSecretsListData = (): V1Secret[] => {
  return [
    {
      metadata: {
        name: 'test-secret-1',
        namespace: 'default',
        uid: 'secret-1'
      },
      type: 'Opaque',
      data: {
        'username': 'dGVzdA==', // base64 encoded 'test'
        'password': 'cGFzc3dvcmQ=' // base64 encoded 'password'
      }
    },
    {
      metadata: {
        name: 'test-secret-2',
        namespace: 'default',
        uid: 'secret-2'
      },
      type: 'kubernetes.io/dockerconfigjson',
      data: {
        '.dockerconfigjson': 'eyJhdXRocyI6eyJleGFtcGxlLmNvbSI6eyJ1c2VybmFtZSI6InRlc3QiLCJwYXNzd29yZCI6InRlc3QiLCJhdXRoIjoiWlZObGNtNWhiV1V0WldGdGFXNW5aUzVqYjIwPSJ9fX0=' // base64 encoded docker config
      }
    },
    {
      metadata: {
        name: 'test-secret-3',
        namespace: 'kube-system',
        uid: 'secret-3'
      },
      type: 'kubernetes.io/tls',
      data: {
        'tls.crt': 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t', // base64 encoded cert
        'tls.key': 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t' // base64 encoded key
      }
    }
  ]
}

export const createSecretsList = (secrets: V1Secret[] = createSecretsListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/secrets`, ({ params }) => {
    const namespace = params.namespace as string
    const namespaceSecrets = secrets.filter(secret => secret.metadata?.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'SecretList',
      items: namespaceSecrets
    })
  })
}

export const createAllSecretsList = (secrets: V1Secret[] = createSecretsListData()) => {
  return http.get(`${API_BASE}/api/v1/secrets`, () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'SecretList',
      items: secrets
    })
  })
}

export const createSecretsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/secrets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllSecretsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/secrets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createSecretsListSlow = (secrets: V1Secret[] = createSecretsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/secrets`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceSecrets = secrets.filter(secret => secret.metadata?.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'SecretList',
      items: namespaceSecrets
    })
  })
}

export const deleteSecretHandler = (name: string, namespace: string) => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/secrets/:name`, ({ params }) => {
    if (params.name === name && params.namespace === namespace) {
      return HttpResponse.json({}, { status: 200 })
    }
    return HttpResponse.json({ error: 'Secret not found' }, { status: 404 })
  })
}

export const deleteSecretErrorHandler = (name: string, namespace: string, status: number = 500, message: string = 'Deletion failed') => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/secrets/:name`, ({ params }) => {
    if (params.name === name && params.namespace === namespace) {
      return HttpResponse.json({ error: message }, { status })
    }
    return HttpResponse.json({ error: 'Secret not found' }, { status: 404 })
  })
}

export const createSecretHandler = (secret: V1Secret) => {
  return http.post(`${API_BASE}/api/v1/namespaces/:namespace/secrets`, () => {
    return HttpResponse.json(secret, { status: 201 })
  })
}

export const createSecretErrorHandler = (status: number = 400, message: string = 'Creation failed') => {
  return http.post(`${API_BASE}/api/v1/namespaces/:namespace/secrets`, () => {
    return HttpResponse.json({ error: message }, { status })
  })
}

export const createSecretsListNetworkError = () => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/secrets`, () => {
    return HttpResponse.error()
  })
}

// Get single secret handler
export const getSecret = (secret: V1Secret) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/secrets/:name`, ({ params }) => {
    const name = params.name as string
    const namespace = params.namespace as string
    if (name === secret.metadata?.name && namespace === secret.metadata?.namespace) {
      return HttpResponse.json(secret)
    }
    return HttpResponse.json({ error: 'Secret not found' }, { status: 404 })
  })
}

// Update secret handler
export const updateSecret = () => {
  return http.put(`${API_BASE}/api/v1/namespaces/:namespace/secrets/:name`, async ({ request, params }) => {
    const body = await request.json() as V1Secret
    const name = params.name as string
    const namespace = params.namespace as string
    
    return HttpResponse.json({
      ...body,
      metadata: {
        ...body.metadata,
        name,
        namespace,
        resourceVersion: '12345',
        uid: `secret-${name}`
      }
    })
  })
}

// Update secret error handler
export const updateSecretError = (status: number = 500, message: string = 'Update failed') => {
  return http.put(`${API_BASE}/api/v1/namespaces/:namespace/secrets/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}