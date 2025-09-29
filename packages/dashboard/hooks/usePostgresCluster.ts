import { usePreferredNamespace } from "@/contexts/NamespaceContext"


export function usePostgresClusters(namespace?: string) {

  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useListPostgresqlCnpgIoV1NamespacedClusterQuery({ path: { namespace: ns }, query: {} })
}