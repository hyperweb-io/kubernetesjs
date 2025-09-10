import { ManifestLoader } from '@interweb/manifests';

jest.setTimeout(10 * 60 * 1000); // up to 10 minutes for full operator

describe('manifests: test manifests', () => {

  // operator namespace map
  const operatorNamespaceMap = {
    'ingress-nginx': 'ingress-nginx',
    'cert-manager': 'cert-manager',
    'knative-serving': 'knative-serving',
    'cloudnative-pg': 'cnpg-system',
    'kube-prometheus-stack': 'monitoring',
  };

  it('test manifests for namespaces', async () => {
    for (const operator of Object.keys(operatorNamespaceMap)) {
      const manifests = ManifestLoader.loadOperatorManifests(operator);
      // check the manifest have a valid namespace object
      expect(manifests.some((m) => m.kind === 'Namespace')).toBe(true);
      const ns = manifests.find((m) => m.kind === 'Namespace');
      expect(ns).toBeDefined();
      expect(ns?.metadata?.name).toBe(operatorNamespaceMap[operator as keyof typeof operatorNamespaceMap]);
    }
  });
});
