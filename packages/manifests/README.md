# @interweb/manifests

Utilities and pinned Kubernetes operator manifests used by Interweb.

Usage
- List operators: `pnpm --filter @interweb/manifests run pull -- --list`
- Pull all: `pnpm --filter @interweb/manifests run pull -- --all`
- Pull one: `pnpm --filter @interweb/manifests run pull -- --operator knative-serving --version v1.15.0`
- Generate JS manifests: `pnpm --filter @interweb/manifests run codegen`

Layout
- Operators live under `operators/` (outside `src`, not published).
- Unversioned files like `operators/knative-serving.yaml` point to the latest version we have.
- Versioned files are stored at `operators/<name>/<version>.yaml`.

Supported operators
- cloudnative-pg: 1.25.2 (upstream release YAML)
- knative-serving: v1.15.0 (CRDs, core, and kourier combined)
- cert-manager: v1.17.0 (helm-rendered with CRDs enabled)
- ingress-nginx: 4.11.2 chart (helm-rendered)
- minio-operator: 7.1.1 (helm-rendered)

Notes
- Only generated artifacts are included in the published package. The raw `operators/` YAML is local-only and gitignored.
- To bump versions, update the sources in `scripts/pull-manifests.ts`, run `pnpm pull` (or `pull:all`) which writes to `operators/`, then run `pnpm codegen` to refresh `src/generated/*`.
