import { InterwebClient as InterwebKubernetesClient } from '@kubernetesjs/ops';
import { SetupClient } from '@kubernetesjs/client';

export function createSetupClient(): SetupClient {
  const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001';
  // No need to force INTERWEB_MANIFESTS_DIR here; manifests resolves from package root now.
  const kube = new InterwebKubernetesClient({ restEndpoint } as any);
  return new SetupClient(kube as any);
}