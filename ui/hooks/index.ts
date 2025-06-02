// Export all hooks from a single entry point
export * from './useNamespaces'
export * from './useDeployments'
export * from './useServices'
export * from './useSecrets'
export * from './useConfigMaps'
export * from './usePods'
export * from './useDaemonSets'
export * from './useReplicaSets'
export * from './useJobs'

// Re-export context hook
export { usePreferredNamespace } from '../contexts/NamespaceContext'
