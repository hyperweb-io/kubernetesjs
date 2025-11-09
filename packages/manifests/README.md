# @kubernetesjs/manifests

Utilities and pinned Kubernetes operator manifests used by Interweb.

Usage

- List operators: `pnpm --filter @kubernetesjs/manifests run pull -- --list`
- Pull all: `pnpm --filter @kubernetesjs/manifests run pull -- --all`
- Pull one: `pnpm --filter @kubernetesjs/manifests run pull -- --operator knative-serving --version v1.15.0`
- Generate JS manifests: `pnpm --filter @kubernetesjs/manifests run codegen`

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

## Testing

- `pnpm run tests:unit` – validates generated manifests against the source YAML

## Credits

🛠 Built by [Interweb](https://interweb.co) — if you like our tools, please checkout and contribute [https://interweb.co](https://interweb.co)
