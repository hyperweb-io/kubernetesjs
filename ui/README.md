# Kubernetes Dashboard

A modern, user-friendly dashboard for managing Kubernetes resources built with Next.js, React, Tailwind CSS, and ShadCN UI.

## Features

- 🚀 **Real-time Monitoring**: View and manage your Kubernetes resources in real-time
- 📦 **Resource Management**: Full support for Deployments, Services, Secrets, ConfigMaps, and more
- 🎨 **Modern UI**: Beautiful, responsive interface built with ShadCN UI and Tailwind CSS
- 🔧 **kubectl-like Operations**: Perform common kubectl operations through an intuitive UI
- 🔒 **Secure**: Handles sensitive data like secrets with care

## Supported Resources

- ✅ Deployments - Scale, update, and manage application deployments
- ✅ Services - Manage networking and service discovery
- ✅ Secrets - Handle sensitive configuration data
- 🚧 ConfigMaps - Manage application configuration (coming soon)
- 🚧 ReplicaSets - Control replica sets (coming soon)
- 🚧 Pods - Direct pod management (coming soon)

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Access to a Kubernetes cluster
- kubectl proxy running (for local development)

## Installation

1. Install dependencies:
```bash
cd packages/kubernetes-dashboard
npm install
```

2. Start kubectl proxy to access your Kubernetes API:
```bash
kubectl proxy
```

This will start a proxy server on `http://localhost:8001` that the dashboard will use to communicate with your cluster.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

By default, the dashboard connects to `http://localhost:8001` (kubectl proxy). To connect to a different cluster or use authentication:

1. Update the `services/kubernetes-client.ts` file
2. Set your cluster endpoint and authentication token

## Development

### Project Structure

```
kubernetes-dashboard/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # ShadCN UI components
│   └── resources/   # Kubernetes resource components
├── services/        # Business logic and API clients
└── lib/            # Utility functions
```

### Adding New Resources

1. Create a new component in `components/resources/`
2. Add the resource to the navigation in `app/page.tsx`
3. Implement the resource-specific API calls in `services/kubernetes-client.ts`

## Building for Production

```bash
npm run build
npm start
```

## Security Considerations

- Never expose the dashboard publicly without proper authentication
- Use RBAC to limit dashboard permissions
- Consider using a service account with limited permissions
- Always use HTTPS in production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file in the root directory

## Acknowledgments

- Built on top of the excellent [kubernetesjs](https://github.com/hyperweb-io/kubernetesjs) client library
- UI components from [ShadCN UI](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)