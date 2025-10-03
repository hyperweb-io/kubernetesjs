# Interweb Helm Chart

This chart bundles the core data-plane dependencies required by Interweb:

- **CloudNativePG operator** (as a chart dependency) and a managed PostgreSQL cluster with an optional PgBouncer pooler.
- **MinIO operator** (as a chart dependency) and a dedicated tenant in the `minio` namespace.

## Getting Started

1. Pull chart dependencies for the operators:

   ```shell
   helm dependency update charts/interweb
   ```

2. Review and override values as needed:

   ```shell
   helm show values charts/interweb > interweb-values.yaml
   # edit interweb-values.yaml to use production-ready credentials and storage classes
   ```

3. Install the chart:

 ```shell
  helm install interweb charts/interweb -f interweb-values.yaml
  ```

   If the install reports missing CRDs, wait a few seconds for the CloudNativePG and MinIO operator charts to finish registering their CRDs, then re-run the install command as an upgrade:

   ```shell
   helm upgrade --install interweb charts/interweb -f interweb-values.yaml
   ```

### Makefile shortcuts

Inside `charts/interweb` there is a `Makefile` with helpers for the two-step workflow:

```shell
# Step 1: install only the operators (installs CRDs, skips CNPG cluster/tenant)
make -C charts/interweb install-operators

# Step 2: once the operators are ready, install the database cluster and MinIO tenant
make -C charts/interweb install-cluster

# Optional: override the CNPG / release namespace (defaults to `cnpg-system`)
make -C charts/interweb install-operators RELEASE_NAMESPACE=my-operators CNPG_NAMESPACE=my-operators
make -C charts/interweb install-cluster RELEASE_NAMESPACE=my-operators CNPG_NAMESPACE=my-operators

# Prefer the Helm-native flow? Use the `install-operators-helm` target instead of the script wrapper
make -C charts/interweb install-operators-helm RELEASE_NAMESPACE=cnpg-system

# Inspect the CRDs currently installed by both operators
make -C charts/interweb check-crds
```

## Values Overview

Key sections in `values.yaml`:

- `cnpg.operator.enabled`: toggles the CloudNativePG operator dependency.
- `cnpg.namespace` / `minio.namespace`: namespace management for the cluster and tenant.
- `cnpg.secrets`: credentials for the PostgreSQL superuser and application user (use strong secrets in production).
- `cnpg.cluster`: instance count, image, storage, and bootstrap SQL for the database.
- `cnpg.pooler`: PgBouncer configuration, including connection parameters and pod resources.
- `minio.credsSecret`: root credentials for the MinIO tenant.
- `minio.tenant`: tenant sizing, storage, bucket bootstrap, and optional console ingress.

## Notes

- The dependency versions in `Chart.yaml` are aligned with the versions used in the existing setup scripts (CloudNativePG v1.25.x and MinIO Operator v5). Update these as newer compatible releases become available.
- Defaults in `values.yaml` favour a lightweight, single-node footprint for running on a developer Kubernetes (kind, k3d, etc.). Scale instances, storage sizes, and container resources upward for staging or production clusters.
- The chart defers creating CNPG/MinIO custom resources until their CRDs are visible to the API server. If they are skipped on the first installation attempt, re-run `helm upgrade --install interweb charts/interweb` once the operators report ready.
- Secrets in `values.yaml` are development defaults. Replace them or source them from an external secret management solution before deploying anywhere other than local environments.
- `helm lint charts/interweb` will surface template validation errors and highlight missing dependencies if `helm dependency update` has not been run.
