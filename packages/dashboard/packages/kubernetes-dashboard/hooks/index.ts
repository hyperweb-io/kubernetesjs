// Export all hooks from a single entry point
export * from './useNamespaces'
export * from './useDeployments'
export * from './useServices'
export * from './useSecrets'
export * from './useConfigMaps'
export * from './usePods'

// Re-export context hook
export { useKubernetes } from '../contexts/KubernetesContext'