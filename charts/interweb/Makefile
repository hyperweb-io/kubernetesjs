HELM ?= helm
KUBECTL ?= kubectl
CHART_DIR ?= $(CURDIR)
RELEASE ?= interweb
CNPG_NAMESPACE ?= cnpg-system
RELEASE_NAMESPACE ?= $(CNPG_NAMESPACE)
VALUES ?= $(CHART_DIR)/values.yaml

ifeq ($(VALUES),)
VALUES_FLAG :=
else
VALUES_FLAG := -f $(VALUES)
endif

.PHONY: ensure-repos update install-operators install-operators-helm install-cluster uninstall check-crds

ensure-repos:
	@$(HELM) repo add cloudnative-pg https://cloudnative-pg.github.io/charts >/dev/null 2>&1 || true
	@$(HELM) repo add minio-operator https://operator.min.io/ >/dev/null 2>&1 || true
	@$(HELM) repo update >/dev/null

update: ensure-repos
	$(HELM) dependency update $(CHART_DIR)

install-operators: update
	bash $(CHART_DIR)/scripts/01-install-operators.sh

install-operators-helm: update
	$(HELM) upgrade --install $(RELEASE) $(CHART_DIR) $(VALUES_FLAG) \
		--namespace $(RELEASE_NAMESPACE) --create-namespace \
		--set cnpg.cluster.enabled=false \
		--set cnpg.pooler.enabled=false \
		--set minio.tenant.enabled=false

install-cluster: update
	$(HELM) upgrade --install $(RELEASE) $(CHART_DIR) $(VALUES_FLAG) \
		--namespace $(RELEASE_NAMESPACE) --create-namespace

uninstall:
	$(HELM) uninstall $(RELEASE) --namespace $(RELEASE_NAMESPACE)

check-crds:
	@echo "CloudNativePG CRDs"
	@$(KUBECTL) get crd | grep postgresql.cnpg.io || echo "\t(none found)"
	@echo ""
	@echo "MinIO CRDs"
	@$(KUBECTL) get crd tenants.minio.min.io 2>/dev/null || echo "\ttenants.minio.min.io not found"
