# @interweb/dashboard

A web-based dashboard for managing Kubernetes clusters using the Interweb toolkit.

## Features

- **Cluster Overview**: Real-time cluster status and resource monitoring
- **Operator Management**: Install and manage Kubernetes operators with toggle switches
- **Database Operations**: Create and manage CloudNativePG PostgreSQL clusters
- **Secrets Management**: Create and manage Kubernetes secrets
- **Application Deployment**: Deploy and manage applications (coming soon)

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- A Kubernetes cluster (kind, Docker Desktop, cloud providers)
- kubectl configured and authenticated
- kubectl proxy running on port 8001

### Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start kubectl proxy** (in a separate terminal):
   ```bash
   kubectl proxy --port=8001 --accept-hosts='^.*$' --address='0.0.0.0'
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open the dashboard**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

## Architecture

The dashboard is built with:
- **Next.js 14** with App Router for server-side rendering and routing
- **TypeScript** for type safety
- **Tailwind CSS** + **Radix UI** for styling and components
- **TanStack Query** for data fetching and caching
- **Monaco Editor** for YAML editing

### Integration with Interweb

The dashboard integrates with the existing Interweb packages:
- `@interweb/client` - Kubernetes operations
- `@interweb/interwebjs` - Generated Kubernetes API client
- `@interweb/manifests` - Operator manifest management

## Supported Operators

- **NGINX Ingress Controller** - Load balancing and ingress
- **cert-manager** - TLS certificate management
- **Knative Serving** - Serverless application platform
- **CloudNativePG** - PostgreSQL database operator
- **Prometheus Stack** - Monitoring and observability

## Database Management

The dashboard provides comprehensive PostgreSQL cluster management through CloudNativePG:

- Create clusters with custom configurations
- Scale replicas up/down
- Configure backup schedules
- Monitor cluster health and replication
- Manage database connections and users

## Security

- **Authentication**: Uses kubectl proxy for Kubernetes API authentication
- **Authorization**: Respects Kubernetes RBAC permissions
- **Secrets**: Managed through Kubernetes API only, no local storage
- **Network**: Communicates with Kubernetes API through localhost proxy only

## Troubleshooting

### Common Issues

1. **"Failed to fetch cluster status"**
   - Ensure kubectl proxy is running: `kubectl proxy --port=8001`
   - Verify kubectl is authenticated: `kubectl cluster-info`

2. **"Failed to install operator"**
   - Check RBAC permissions: `kubectl auth can-i create deployments`
   - Verify cluster connectivity

3. **Dashboard won't load**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed: `pnpm install`

### Logs

Check the Next.js server logs for detailed error information:
```bash
pnpm dev  # Development mode shows detailed logs
```

## Contributing

See the main [Interweb contributing guide](../../CONTRIBUTING.md) for development setup and contribution guidelines.
