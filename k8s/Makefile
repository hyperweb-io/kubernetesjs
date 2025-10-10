KUBECTL ?= kubectl
K8S_DIR ?= $(CURDIR)
CLIENT_DIR ?= $(abspath $(K8S_DIR)/../packages/client)

.PHONY: setup install teardown uninstall check-crds

setup:
	npm --prefix $(CLIENT_DIR) run operators:setup

teardown:
	npm --prefix $(CLIENT_DIR) run operators:teardown

install:
	$(KUBECTL) apply -f $(K8S_DIR)/cnpg-cluster.yaml
	$(KUBECTL) apply -f $(K8S_DIR)/minio-tenant.yaml

uninstall:
	$(KUBECTL) delete -f $(K8S_DIR)/minio-tenant.yaml --ignore-not-found
	$(KUBECTL) delete -f $(K8S_DIR)/cnpg-cluster.yaml --ignore-not-found
	npm --prefix $(CLIENT_DIR) run operators:teardown

check-crds:
	@echo "CloudNativePG CRDs" && \
	$(KUBECTL) get crd | grep postgresql.cnpg.io || echo "\t(none found)"; \
	echo ""; \
	echo "MinIO CRDs" && \
	$(KUBECTL) get crd tenants.minio.min.io 2>/dev/null || echo "\ttenants.minio.min.io not found"
