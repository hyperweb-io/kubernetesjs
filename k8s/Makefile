KUBECTL ?= kubectl
K8S_DIR ?= $(CURDIR)
CLIENT_DIR ?= $(abspath $(K8S_DIR)/../packages/client)

.PHONY: install-operators install-cluster uninstall check-crds

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
