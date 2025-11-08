import type { Secret } from '@kubernetesjs/ops';
import { useQueryClient } from '@tanstack/react-query';

import { usePreferredNamespace } from '../contexts/NamespaceContext';
import {
  useCreateCoreV1NamespacedSecret,
  useDeleteCoreV1NamespacedSecret,
  useListCoreV1NamespacedSecretQuery,
  useListCoreV1SecretForAllNamespacesQuery,
  useReadCoreV1NamespacedSecretQuery,
  useReplaceCoreV1NamespacedSecret,
} from '../k8s/index';

// Query keys
const SECRETS_KEY = ['secrets'] as const;

export function useSecrets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace();
  const ns = namespace || defaultNamespace;

  if (ns === '_all') {
    return useListCoreV1SecretForAllNamespacesQuery({ query: {} });
  }
  return useListCoreV1NamespacedSecretQuery({ path: { namespace: ns }, query: {} });
}

export function useSecret(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace();
  const ns = namespace || defaultNamespace;

  return useReadCoreV1NamespacedSecretQuery({ path: { namespace: ns, name }, query: {} });
}

export function useCreateSecret() {
  const { namespace: defaultNamespace } = usePreferredNamespace();
  const queryClient = useQueryClient();
  const base = useCreateCoreV1NamespacedSecret();
  return {
    ...base,
    mutate: (
      { secret, namespace }: { secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: secret },
        {
          ...opts,
          onSuccess: (data, variables, onMutateResult, context) => {
            // Invalidate the secrets list queries
            queryClient.invalidateQueries({
              queryKey: ['api_v1_namespaces_namespace_secrets', namespace || defaultNamespace]
            });
            queryClient.invalidateQueries({
              queryKey: ['api_v1_secrets']
            });
            opts?.onSuccess?.(data, variables, onMutateResult, context);
          }
        }
      ),
    mutateAsync: (
      { secret, namespace }: { secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: secret },
        {
          ...opts,
          onSuccess: (data, variables, onMutateResult, context) => {
            // Invalidate the secrets list queries
            queryClient.invalidateQueries({
              queryKey: ['api_v1_namespaces_namespace_secrets', namespace || defaultNamespace]
            });
            queryClient.invalidateQueries({
              queryKey: ['api_v1_secrets']
            });
            opts?.onSuccess?.(data, variables, onMutateResult, context);
          }
        }
      ),
  };
}

export function useUpdateSecret() {
  const { namespace: defaultNamespace } = usePreferredNamespace();
  const base = useReplaceCoreV1NamespacedSecret();
  return {
    ...base,
    mutate: (
      { name, secret, namespace }: { name: string; secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: secret },
        opts
      ),
    mutateAsync: (
      { name, secret, namespace }: { name: string; secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: secret },
        opts
      ),
  };
}

export function useDeleteSecret() {
  const { namespace: defaultNamespace } = usePreferredNamespace();
  const queryClient = useQueryClient();
  const base = useDeleteCoreV1NamespacedSecret();
  return {
    ...base,
    mutate: (
      { name, namespace }: { name: string; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {} },
        {
          ...opts,
          onSuccess: (data, variables, onMutateResult, context) => {
            // Invalidate the secrets list queries
            queryClient.invalidateQueries({
              queryKey: ['api_v1_namespaces_namespace_secrets', namespace || defaultNamespace]
            });
            queryClient.invalidateQueries({
              queryKey: ['api_v1_secrets']
            });
            opts?.onSuccess?.(data, variables, onMutateResult, context);
          }
        }
      ),
    mutateAsync: (
      { name, namespace }: { name: string; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {} },
        {
          ...opts,
          onSuccess: (data, variables, onMutateResult, context) => {
            // Invalidate the secrets list queries
            queryClient.invalidateQueries({
              queryKey: ['api_v1_namespaces_namespace_secrets', namespace || defaultNamespace]
            });
            queryClient.invalidateQueries({
              queryKey: ['api_v1_secrets']
            });
            opts?.onSuccess?.(data, variables, onMutateResult, context);
          }
        }
      ),
  };
}
