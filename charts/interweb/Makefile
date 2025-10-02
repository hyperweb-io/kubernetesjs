HELM ?= helm
CHART_DIR ?= $(CURDIR)
RELEASE ?= interweb
NAMESPACE ?= minio-operator
VALUES ?= $(CHART_DIR)/values.yaml

ifeq ($(VALUES),)
VALUES_FLAG :=
else
VALUES_FLAG := -f $(VALUES)
endif

.PHONY: ensure-repos update install-operators install-cluster uninstall

ensure-repos:
	@$(HELM) repo add cloudnative-pg https://cloudnative-pg.github.io/charts >/dev/null 2>&1 || true
	@$(HELM) repo add minio-operator https://operator.min.io/ >/dev/null 2>&1 || true
	@$(HELM) repo update >/dev/null

update: ensure-repos
	$(HELM) dependency update $(CHART_DIR)

install-operators: update
	$(HELM) upgrade --install $(RELEASE) $(CHART_DIR) $(VALUES_FLAG) \
		--namespace $(NAMESPACE) --create-namespace \
		--set cnpg.cluster.enabled=false \
		--set cnpg.pooler.enabled=false \
		--set minio.tenant.enabled=false

install-cluster: update
	$(HELM) upgrade --install $(RELEASE) $(CHART_DIR) $(VALUES_FLAG) \
		--namespace $(NAMESPACE) --create-namespace

uninstall:
	$(HELM) uninstall $(RELEASE) --namespace $(NAMESPACE)
