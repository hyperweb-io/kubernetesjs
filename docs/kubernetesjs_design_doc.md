# KubernetesJS: Design Document

## Overview

KubernetesJS is a JavaScript‑native Kubernetes toolkit that combines a fully‑typed client, CLIs, and opinionated ops tooling for cluster setup, operator management, and application deployment. It replaces brittle bash workflows with modern CLIs and a programmatic API.

## Core Principles

- **JavaScript‑Native**: Use `kubernetesjs` directly instead of wrapping kubectl/helm
- **Configuration-Driven**: Simple YAML/JSON configs for setup and deployment
- **Developer-Focused**: Optimized for development workflows
- **Minimal Input**: Sensible defaults with override capabilities
- **Composable**: Modular architecture for extensibility

## Architecture

### Project Structure
```
kubernetesjs/
├── packages/
│   ├── cli/            # Low‑level CLI for typed K8s ops
│   ├── ops-cli/        # Ops CLI (formerly interweb CLI)
│   ├── client/         # Higher‑level client wrapper
│   ├── ops/            # Ops library (formerly interwebjs)
│   ├── manifests/      # Curated operator manifests/bundles
│   └── kubernetesjs/   # Core fully‑typed K8s client (SDK)
├── docs/
├── examples/
└── templates/         # Project scaffolding
```

### Core Components

#### 1. CLI Package (`@kubernetesjs/cli`)
- **Commands:**
  - Resource‑centric helpers around the typed client (e.g., inspect, diff, apply)
  - Codegen utilities and developer ergonomics
  - Focused on low‑level Kubernetes actions and DX

#### 2. Ops CLI (`@kubernetesjs/ops-cli`)
- **Purpose:** Higher‑level operational workflows (migrated from Interweb CLI)
- **Commands:**
  - `kjs setup` – Initialize cluster with operators
  - `kjs deploy` – Deploy applications
  - `kjs status` – Cluster and app status
  - `kjs destroy` – Cleanup resources
  - `kjs scaffold` – Generate project templates

#### 3. Client Package (`@kubernetesjs/client`)
- **Purpose:** Enhanced kubernetesjs wrapper
- **Features:**
  - Connection management
  - Error handling and retry logic
  - Resource watching
  - Custom resource definitions
  - Helm-like templating

#### 4. Ops Package (`@kubernetesjs/ops`)
- **Purpose:** Core ops library (migrated from InterwebJS)
- **Features:**
  - Resource management
  - Deployment orchestration
  - Configuration validation
  - Template rendering

#### 5. Manifests Package (`@kubernetesjs/manifests`)
- **Purpose:** Curated operator and platform manifests
- **Features:**
  - CloudNativePG management
  - Knative Serving setup
  - Cert-manager configuration
  - Ingress controller setup
  - Monitoring stack deployment

#### 6. KubernetesJS SDK (`kubernetesjs`)
- **Purpose:** Fully‑typed core client and SDK
- **Features:** Typed API surface, discovery, watch, codegen

## Configuration Files

### 1. Cluster Setup Config (`kjs.setup.yaml`)
```yaml
apiVersion: kjs.dev/v1
kind: ClusterSetup
metadata:
  name: dev-cluster
spec:
  operators:
    - name: knative-serving
      version: "v1.15.0"
      enabled: true
    - name: cloudnative-pg
      version: "1.25.2"
      enabled: true
    - name: cert-manager
      version: "v1.17.0"
      enabled: true
    - name: ingress-nginx
      enabled: true
  
  monitoring:
    enabled: false  # Optional
    prometheus:
      retention: "7d"
      storage: "10Gi"
    grafana:
      adminPassword: "admin"
      persistence: "5Gi"
  
  networking:
    ingressClass: "nginx"
    domain: "127.0.0.1.nip.io"  # Default for development
```

### 2. Application Deploy Config (`kjs.deploy.yaml`)
```yaml
apiVersion: kjs.dev/v1
kind: Application
metadata:
  name: postgres-api-app
spec:
  database:
    type: postgresql
    name: postgres-cluster
    namespace: postgres-db
    config:
      instances: 3
      storage: "10Gi"
      version: "16"
      multiTenant:
        enabled: true
        schemas:
          - name: tenant_acme
            sampleData: true
          - name: tenant_beta
            sampleData: true
    pooler:
      enabled: true
      instances: 2
  
  services:
    - name: backend-api
      type: knative
      image: 
        name: postgres-knative-backend-api
        tag: latest
        registry: localhost:5001
      environment:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-app-secret
              key: uri
      scaling:
        minScale: 0
        maxScale: 10
        concurrency: 100
  
  networking:
    domain: "127.0.0.1.nip.io"
```

## Implementation Plan

### Phase 1: Foundation
1. **Project Setup**
   - Initialize monorepo with packages
   - Setup build system (TypeScript, bundling)
   - Import relevant code from Starship

2. **Core Client**
   - Implement kubernetesjs wrapper
   - Add connection management
   - Create resource abstractions

3. **Basic CLI**
   - Implement `setup` command
   - Configuration loading and validation
   - Basic operator installation

### Phase 2: Operators & Templates
1. **Operator Management**
   - Knative Serving installation
   - CloudNativePG setup
   - Cert-manager configuration
   - Ingress controller management

2. **Template System**
   - YAML template rendering
   - Variable interpolation
   - Custom resource generation

3. **Deploy Command**
   - Database deployment
   - Knative service deployment
   - Secret management

### Phase 3: Enhanced Features
1. **Status & Monitoring**
   - Resource status checking
   - Health monitoring
   - Logs aggregation

2. **Development Workflow**
   - Hot reloading
   - Local development setup
   - Testing utilities

3. **Advanced Configuration**
   - Multi-environment support
   - GitOps integration
   - Custom resource definitions

## Technical Decisions

### Dependencies
- **kubernetesjs**: Core Kubernetes API client
- **yaml**: Configuration parsing
- **inquirer**: Interactive CLI prompts
- **chalk**: Terminal colors
- **ora**: Loading spinners
- **ajv**: JSON schema validation

### Configuration Strategy
- YAML-first configuration with JSON Schema validation
- Environment variable interpolation
- Hierarchical configuration (global → project → environment)
- Secrets management integration

### Error Handling
- Comprehensive error types
- Retry logic for transient failures
- Rollback capabilities
- Detailed error reporting

### Testing Strategy

#### Test Pyramid Structure
```
    E2E Tests (Few, Expensive)
   Integration Tests (Some, Medium)
  Unit Tests (Many, Fast, Cheap)
```

#### 1. Unit Tests
- **Scope**: Pure functions, configuration parsing, template rendering
- **Tools**: Jest, @testing-library for React-like testing
- **Coverage**: 80%+ for core packages
- **Speed**: < 30 seconds total

#### 2. Integration Tests
- **Scope**: Kubernetes API interactions, operator management
- **Tools**: Testcontainers, kind (Kubernetes in Docker)
- **Coverage**: Key workflows without full deployment
- **Speed**: 2-5 minutes per suite

#### 3. E2E Tests
- **Scope**: Complete workflows from CLI to running services
- **Tools**: Real/ephemeral clusters, Docker, shell execution
- **Coverage**: Critical user journeys
- **Speed**: 10-30 minutes per scenario

#### 4. CLI Tests
- **Scope**: Command parsing, user interactions, output formatting
- **Tools**: Jest, stdout/stderr capture
- **Coverage**: All CLI commands and error scenarios
- **Speed**: < 2 minutes total

## Migration Path from Current Scripts

### Current → KubernetesJS (ops-cli) Mapping

| Current Script | kjs Command | Configuration |
|---|---|---|
| `00-setup-cluster.sh` | `kjs setup --infrastructure` | `kjs.setup.yaml` (infrastructure section) |
| `01-install-operators.sh` | `kjs setup --operators` | `kjs.setup.yaml` (operators section) |
| `02-deploy-postgres.sh` | `kjs deploy --database` | `kjs.deploy.yaml` (database section) |
| `03-deploy-knative-app.sh` | `kjs deploy --services` | `kjs.deploy.yaml` (services section) |

### Migration Benefits
1. **Declarative**: Configuration over imperative scripts
2. **Idempotent**: Safe to run multiple times
3. **Consistent**: Same tool for all environments
4. **Extensible**: Easy to add new operators and services
5. **Type-Safe**: TypeScript for better developer experience

## Example Usage

```bash
# Low-level typed client CLI
k8s get pods -n default

# Ops CLI (higher-level workflows)
kjs setup
kjs deploy
kjs status
kjs destroy --confirm
```

## Next Steps

1. **Repository Setup**: Create monorepo structure
2. **Package Migration**: Import and adapt Starship packages
3. **Core Client**: Implement kubernetesjs wrapper
4. **CLI Foundation**: Basic command structure and config loading
5. **Operator Integration**: Start with Knative and PostgreSQL
6. **Testing**: Setup CI/CD and testing framework
7. **Documentation**: Usage guides and API documentation

This design aligns the KubernetesJS monorepo around a clear split between the core typed client (SDK + `@kubernetesjs/cli`) and opinionated operational tooling (`@kubernetesjs/ops-cli`, `@kubernetesjs/ops`, and `@kubernetesjs/manifests`) for a better developer experience.
