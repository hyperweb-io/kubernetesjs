import { 
  useListBatchV1NamespacedJobQuery,
  useListBatchV1JobForAllNamespacesQuery,
  useReadBatchV1NamespacedJobQuery,
  useDeleteBatchV1NamespacedJobMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useJobs(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allJobsQuery = useListBatchV1JobForAllNamespacesQuery({
    query: {},
  })

  const namespacedJobsQuery = useListBatchV1NamespacedJobQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allJobsQuery
  } else {
    return namespacedJobsQuery
  }
}

export function useJob(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadBatchV1NamespacedJobQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useDeleteJob() {
  return useDeleteBatchV1NamespacedJobMutation()
}
