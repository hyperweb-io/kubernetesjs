# Interweb: Design Document

## Overview

Interweb is a JavaScript-native Kubernetes developer toolkit that simplifies cluster setup, operator management, and application deployment. It replaces bash-script-based workflows with a modern CLI and programmatic API.

## Core Principles

- **JavaScript-Native**: Use kubernetesjs directly instead of wrapping kubectl/helm
- **Configuration-Driven**: Simple YAML/JSON configs for setup and deployment
- **Developer-Focused**: Optimized for development workflows
- **Minimal Input**: Sensible defaults with override capabilities
- **Composable**: Modular architecture for extensibility

## Architecture

### Project Structure
```
interweb/
├── packages/
│   ├── cli/                    # Main CLI package
│   ├── client/                 # Kubernetes client wrapper
│   ├── interwebjs/            # Core library (from starshipjs)
│   ├── operators/             # Operator management
│   ├── config/                # Configuration management
│   └── templates/             # Deployment templates
├── docs/
├── examples/
└── templates/                 # Project scaffolding
```

### Core Components

#### 1. CLI Package (`@interweb/cli`)
- **Commands:**
  - `interweb setup` - Initialize cluster with operators
  - `interweb deploy` - Deploy applications
  - `interweb status` - Cluster and app status
  - `interweb destroy` - Cleanup resources
  - `interweb scaffold` - Generate project templates

#### 2. Client Package (`@interweb/client`)
- **Purpose:** Enhanced kubernetesjs wrapper
- **Features:**
  - Connection management
  - Error handling and retry logic
  - Resource watching
  - Custom resource definitions
  - Helm-like templating

#### 3. InterwebJS Package (`@interweb/interwebjs`)
- **Purpose:** Core library (evolved from starshipjs)
- **Features:**
  - Resource management
  - Deployment orchestration
  - Configuration validation
  - Template rendering

#### 4. Operators Package (`@interweb/operators`)
- **Purpose:** Operator lifecycle management
- **Features:**
  - CloudNativePG management
  - Knative Serving setup
  - Cert-manager configuration
  - Ingress controller setup
  - Monitoring stack deployment

#### 5. Config Package (`@interweb/config`)
- **Purpose:** Configuration management
- **Features:**
  - Schema validation
  - Environment interpolation
  - Multi-environment support
  - Secret management

## Configuration Files

### 1. Cluster Setup Config (`interweb.setup.yaml`)
```yaml
apiVersion: interweb.dev/v1
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

### 2. Application Deploy Config (`interweb.deploy.yaml`)
```yaml
apiVersion: interweb.dev/v1
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

### Current → Interweb Mapping

| Current Script | Interweb Command | Configuration |
|---|---|---|
| `00-setup-cluster.sh` | `interweb setup --infrastructure` | `interweb.setup.yaml` (infrastructure section) |
| `01-install-operators.sh` | `interweb setup --operators` | `interweb.setup.yaml` (operators section) |
| `02-deploy-postgres.sh` | `interweb deploy --database` | `interweb.deploy.yaml` (database section) |
| `03-deploy-knative-app.sh` | `interweb deploy --services` | `interweb.deploy.yaml` (services section) |

### Migration Benefits
1. **Declarative**: Configuration over imperative scripts
2. **Idempotent**: Safe to run multiple times
3. **Consistent**: Same tool for all environments
4. **Extensible**: Easy to add new operators and services
5. **Type-Safe**: TypeScript for better developer experience

## Example Usage

```bash
# Initialize a new project
interweb init my-app

# Setup cluster with operators
interweb setup

# Deploy application
interweb deploy

# Check status
interweb status

# Scale service
interweb scale backend-api --min 2 --max 20

# View logs
interweb logs backend-api --follow

# Destroy everything
interweb destroy --confirm
```

## Next Steps

1. **Repository Setup**: Create monorepo structure
2. **Package Migration**: Import and adapt Starship packages
3. **Core Client**: Implement kubernetesjs wrapper
4. **CLI Foundation**: Basic command structure and config loading
5. **Operator Integration**: Start with Knative and PostgreSQL
6. **Testing**: Setup CI/CD and testing framework
7. **Documentation**: Usage guides and API documentation

This design provides a solid foundation for building Interweb as a modern, JavaScript-native alternative to your current bash scripts while maintaining the same functionality and improving developer experience.