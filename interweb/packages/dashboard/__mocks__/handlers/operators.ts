import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"

export interface OperatorInfo {
  name: string
  displayName: string
  status: 'installed' | 'not-installed' | 'installing' | 'error'
  version?: string
  description?: string
  docsUrl?: string
}

export const createOperatorsListData = (): OperatorInfo[] => {
  return [
    {
      name: 'cert-manager',
      displayName: 'Cert Manager',
      status: 'installed',
      version: 'v1.13.0',
      description: 'Certificate management for Kubernetes',
      docsUrl: 'https://cert-manager.io/docs'
    },
    {
      name: 'cloudnative-pg',
      displayName: 'CloudNativePG',
      status: 'installed',
      version: 'v1.22.0',
      description: 'CloudNative PostgreSQL operator',
      docsUrl: 'https://cloudnative-pg.io/docs'
    },
    {
      name: 'nginx-ingress',
      displayName: 'NGINX Ingress Controller',
      status: 'not-installed',
      description: 'NGINX Ingress Controller',
      docsUrl: 'https://kubernetes.github.io/ingress-nginx'
    },
    {
      name: 'prometheus',
      displayName: 'Prometheus',
      status: 'installing',
      description: 'Prometheus monitoring operator',
      docsUrl: 'https://prometheus.io/docs'
    },
    {
      name: 'grafana',
      displayName: 'Grafana',
      status: 'error',
      description: 'Grafana operator',
      version: 'v4.0.0',
      docsUrl: 'https://grafana.com/docs'
    }
  ]
}

export const createOperatorsList = (operators: OperatorInfo[] = createOperatorsListData()) => {
  return http.get('/api/operators', () => {
    return HttpResponse.json(operators)
  })
}

export const createOperatorsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get('/api/operators', () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createOperatorsListNetworkError = () => {
  return http.get('/api/operators', () => {
    return HttpResponse.error()
  })
}

export const createInstallOperator = (operatorName: string) => {
  return http.post(`/api/operators/${operatorName}/install`, () => {
    return HttpResponse.json({ 
      success: true, 
      message: `Operator ${operatorName} installed successfully` 
    })
  })
}

export const createInstallOperatorError = (operatorName: string, status: number = 500, message: string = 'Installation failed') => {
  return http.post(`/api/operators/${operatorName}/install`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createUninstallOperator = (operatorName: string) => {
  return http.delete(`/api/operators/${operatorName}/install`, () => {
    return HttpResponse.json({ 
      success: true, 
      message: `Operator ${operatorName} uninstalled successfully` 
    })
  })
}

export const createUninstallOperatorError = (operatorName: string, status: number = 500, message: string = 'Uninstallation failed') => {
  return http.delete(`/api/operators/${operatorName}/install`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createInstallOperatorSlow = (operatorName: string, delay: number = 2000) => {
  return http.post(`/api/operators/${operatorName}/install`, async () => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return HttpResponse.json({ 
      success: true, 
      message: `Operator ${operatorName} installed successfully` 
    })
  })
}
