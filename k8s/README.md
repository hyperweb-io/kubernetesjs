# Interweb Data Plane Setup

This folder now provides a Makefile-driven workflow for installing the Interweb data-plane operators and applying the core Kubernetes resources (CloudNativePG cluster + MinIO tenant) without relying on a Helm release.

## Getting Started

1. **Install the operators** (CloudNativePG & MinIO). This runs the client package script which installs supported operators via manifests and the MinIO operator via Helm:

```shell
make -C k8s setup
```

2. **Apply the CNPG cluster and MinIO tenant manifests** from the `k8s/` folder:

```shell
make -C k8s install
```

3. **Tear everything down** (tenant, cluster, operators) when finished:

```shell
make -C k8s uninstall
```

## Makefile Shortcuts

```shell
# Install operators (idempotent)
make -C k8s setup

# Apply CNPG cluster + PgBouncer + MinIO tenant manifests
make -C k8s install

# Remove manifests and uninstall operators
make -C k8s uninstall
```

## Manifests in `k8s/`

- `cnpg-cluster.yaml` – creates the `postgres-db` namespace, credentials, a CloudNativePG `Cluster`, and a single-instance PgBouncer `Pooler` sized for local development.
- `minio-tenant.yaml` – creates the `minio` namespace, credentials secret, and a single-pool MinIO `Tenant` with 2 Gi of storage.

These manifests assume the corresponding operators (CloudNativePG and MinIO) are already installed. Adjust storage classes, resource requests, and credentials before using outside of local clusters.

## Notes

- `make setup` delegates to `packages/client/scripts/setup-operators.ts`, which ensures the CloudNativePG operator is applied via manifests and installs the MinIO operator via Helm.
- Secrets included in the manifests (`postgres*` and `interweb-minio-creds`) contain development defaults—replace them or source from a secret manager for production environments.
- The legacy Helm chart files remain for reference but are no longer used in this workflow.
