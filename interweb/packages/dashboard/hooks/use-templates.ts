'use client'

import { useQuery } from '@tanstack/react-query'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'

export type TemplateStatus = 'installed' | 'not-installed' | 'installing' | 'error'

export function useTemplateInstalled(templateId: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace)

  const query = useQuery({
    queryKey: ['template-status', templateId, ns],
    queryFn: async () => {
      const deploymentName = `${templateId}-deployment`
      const response = await fetch(`/api/templates/${templateId}?namespace=${ns}&name=${deploymentName}`)
      if (!response.ok) {
        throw new Error('Failed to fetch template status')
      }
      return response.json()
    },
    refetchInterval: 5000, // Poll every 5 seconds
  })

  const isLoading = query.isLoading
  const error = query.error
  
  // Map API status to our template status
  let status: TemplateStatus = 'not-installed'
  if (query.data) {
    switch (query.data.status) {
      case 'deployed':
        status = 'installed'
        break
      case 'deploying':
        status = 'installing'
        break
      case 'failed':
        status = 'error'
        break
      case 'not-found':
      default:
        status = 'not-installed'
        break
    }
  }

  const isInstalled = status === 'installed'

  const refetch = async () => {
    await query.refetch()
  }

  return { isInstalled, isLoading, error, refetch, namespace: ns, status }
}