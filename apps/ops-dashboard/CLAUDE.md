# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm --filter @interweb/dashboard dev` - Start development server on http://localhost:3000
- `pnpm --filter @interweb/dashboard build` - Build for production
- `pnpm --filter @interweb/dashboard start` - Start production server
- `pnpm --filter @interweb/dashboard lint` - Run ESLint checks
- `pnpm --filter @interweb/dashboard codegen` - Generate code from TypeScript schemas/configs

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
- `/api/k8s/[...path]` - Proxies requests to the Kubernetes API
- `/api/init` - Application initialization

### Styling
- Uses Tailwind CSS with custom design system
- Radix UI components for accessible primitives
- Light/dark theme support
- Responsive design with mobile-friendly sidebar

### Key Dependencies
- `kubernetesjs` - Kubernetes API client used across hooks and services
- `@tanstack/react-query` - Data fetching and caching layer
- `lucide-react` - Icon set used throughout the UI
- `tailwindcss` & `tailwindcss-animate` - Utility-first styling and animations

### new items
use agentic-kit to switch between providers, these files have the info you need:
- CLAUDE-agentic-kit.md
- CLAUDE-bradie.md
- CLAUDE-ollama.md
