# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` - Start development server on http://localhost:3000
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint checks
- `yarn codegen` - Generate code from TypeScript schemas/configs

## Prerequisites for Development

The application requires a running Kubernetes cluster and kubectl proxy:
```bash
kubectl proxy --port=8001 --accept-hosts='^.*$' --address='0.0.0.0'
```

## Architecture Overview

### Core Structure
This is a Next.js 14 React application that provides a modern dashboard for managing Kubernetes resources. The app uses a multi-layered provider architecture:

1. **KubernetesProvider** (`k8s/context.tsx`) - Manages the Kubernetes client connection and configuration, wraps the entire app with TanStack Query for data fetching
2. **NamespaceProvider** (`contexts/NamespaceContext.tsx`) - Handles global namespace state across all components  
3. **ConfirmProvider** (`hooks/useConfirm.tsx`) - Provides confirmation dialogs for destructive operations

### Key Components
- **DashboardLayout** (`components/dashboard-layout.tsx`) - Main layout with collapsible sidebar navigation, theme toggle, and integrated AI chat
- **Resources** (`components/resources/`) - Individual resource management components for each Kubernetes resource type
- **IDE Components** (`components/ide/`) - File explorer, terminal, and AI chat for integrated development experience

### Data Layer
- **Kubernetes Client** - Uses `kubernetesjs` library for API communication
- **TanStack Query** - Handles data fetching, caching, and synchronization
- **Custom Hooks** (`hooks/`) - Resource-specific hooks (useDeployments, usePods, etc.) that wrap TanStack Query

### Navigation & Routing
The sidebar navigation is organized into collapsible sections:
- Overview & All Resources
- Workloads (Deployments, Pods, Jobs, etc.)
- Config & Storage (ConfigMaps, Secrets, PVCs, etc.)
- Network (Services, Ingresses, Network Policies, etc.)
- Access Control (Service Accounts, Roles, Role Bindings)
- Cluster (Resource Quotas, HPAs, Events, etc.)

### API Routes
- `/api/k8s/[...path]` - Proxies requests to Kubernetes API
- `/api/ide/fs/` - File system operations for IDE functionality
- `/api/init` - Application initialization

### Styling
- Uses Tailwind CSS with custom design system
- Radix UI components for accessible primitives
- Light/dark theme support
- Responsive design with mobile-friendly sidebar

### Key Dependencies
- `@kubernetesjs/react` & `kubernetesjs` - Kubernetes API client
- `@tanstack/react-query` - Data fetching and state management
- `@monaco-editor/react` - Code editor for YAML editing
- `xterm` - Terminal emulator for IDE functionality

### new items
use agentic-kit to switch between providers, these files have the info you need:
- CLAUDE-agentic-kit.md
- CLAUDE-bradie.md
- CLAUDE-ollama.md
