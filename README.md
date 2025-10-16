# Interweb

<p align="left" width="100%">
  <a href="https://github.com/hyperweb-io/interweb/actions/workflows/build.yml"><img height="20" src="https://github.com/hyperweb-io/interweb/actions/workflows/build.yml/badge.svg" alt="Build" /></a>
  <a href="https://github.com/hyperweb-io/interweb/actions/workflows/test-client.yml"><img height="20" src="https://github.com/hyperweb-io/interweb/actions/workflows/test-client.yml/badge.svg" alt="Integration Tests" /></a>
  <a href="https://github.com/hyperweb-io/interweb/actions/workflows/test-e2e-client.yml"><img height="20" src="https://github.com/hyperweb-io/interweb/actions/workflows/test-e2e-client.yml/badge.svg" alt="E2E Tests" /></a>
</p>

Interweb is a TypeScript toolkit for programmatic Kubernetes operations. It ships a curated set of operator manifests, a generated Kubernetes API client, and a high‑level client that applies manifests with kube‑native semantics (create/replace), CRD awareness, and sensible ordering.

Use Interweb to install core platform operators (ingress-nginx, cert-manager, Knative Serving, CloudNativePG, kube‑prometheus‑stack) and to manage app resources without shelling out to kubectl/helm.

## Packages
- @interweb/interwebjs: Generated, fetch‑based Kubernetes REST client (CJS + ESM)
- @interweb/client: High‑level SetupClient with CRD‑aware apply/delete, status helpers
- @interweb/manifests: Versioned YAML bundles for supported operators (with CRDs)
- @interweb/cli: Thin CLI wrapper around the client (optional)

## Quick Start (dev)
- Prereqs: Node 20+, pnpm, a Kubernetes cluster (Kind/Docker Desktop), kubectl
- Install: `pnpm install`
- Build all: `pnpm -r build`
- Start API proxy (in another shell): `kubectl proxy --port=8001 --accept-hosts='^.*$' --address='0.0.0.0'`

Apply an operator in code (example):

```ts
import { InterwebClient as K8s } from '@interweb/interwebjs';
import { SetupClient } from '@interweb/client/src/setup';
import { ManifestLoader } from '@interweb/manifests';

const api = new K8s({ restEndpoint: 'http://127.0.0.1:8001' } as any);
const setup = new SetupClient(api);

const manifests = ManifestLoader.loadOperatorManifests('ingress-nginx');
await setup.applyManifests(manifests);
```

## Testing
- Unit tests: `pnpm -r test`
- E2E (per‑operator, requires cluster + proxy):
  - `cd packages/client`
  - `OPERATOR=ingress-nginx K8S_API=http://127.0.0.1:8001 pnpm test -- __tests__/e2e.setup.operator.test.ts`

CI runs two workflows:
- Test Client Package: small smoke tests + targeted applies
- Client E2E (Per Operator): matrix job, one operator per Kind cluster

## Manifests Maintenance
- Update all bundles: `pnpm -w @interweb/manifests run pull:all`
- Notes:
  - Helm charts are rendered with `--include-crds` and a large buffer; a Namespace doc is auto‑prepended if a chart doesn’t ship one.
  - URL‑sourced bundles (e.g., Knative Serving) are combined without reformatting and de‑duplicated by (apiVersion, kind, name, namespace) to avoid duplicate CRDs.

## Apply Engine Highlights
- Create/replace semantics (idempotent)
- Phased ordering: CRDs → Namespaces → built‑in kinds → webhooks ready → custom kinds
- Waits for CRDs to be Established and for webhook Services to have endpoints
- Tolerates 409 conflicts on CRDs (install‑only behavior)

## Local Tips
- Verify proxy: `curl http://127.0.0.1:8001/api`
- Inspect a bundle: `less packages/manifests/operators/ingress-nginx.yaml`
- Apply just Namespaces/CRDs first if debugging timing on new clusters

## Credits

🛠 Built by [Interweb](https://interweb.co) — if you like our tools, please checkout and contribute [https://interweb.co](https://interweb.co)
