# Interweb Dashboard Implementation Plan

## Project Structure

```
packages/dashboard/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── operators/
│   │   │   ├── page.tsx          # Operators management
│   │   │   └── [operator]/
│   │   │       └── page.tsx      # Individual operator config
│   │   ├── databases/
│   │   │   ├── page.tsx          # Database clusters list
│   │   │   ├── create/
│   │   │   │   └── page.tsx      # Create database cluster
│   │   │   └── [cluster]/
│   │   │       ├── page.tsx      # Cluster overview
│   │   │       ├── backup/
│   │   │       │   └── page.tsx  # Backup management
│   │   │       └── config/
│   │   │           └── page.tsx  # Cluster configuration
│   │   ├── secrets/
│   │   │   ├── page.tsx          # Secrets list
│   │   │   ├── create/
│   │   │   │   └── page.tsx      # Create secret
│   │   │   └── [secret]/
│   │   │       └── page.tsx      # Secret details
│   │   ├── api/                  # API Routes
│   │   │   ├── cluster/
│   │   │   ├── operators/
│   │   │   ├── databases/
│   │   │   └── secrets/
│   │   └── globals.css
│   ├── components/               # React components
│   │   ├── ui/                   # Basic UI components
│   │   ├── layout/               # Layout components
│   │   ├── operators/            # Operator-specific components
│   │   ├── databases/            # Database-specific components
│   │   ├── secrets/              # Secret-specific components
│   │   └── charts/               # Monitoring charts
│   ├── lib/                      # Utilities and clients
│   │   ├── interweb-client.ts    # @interweb/client wrapper
│   │   ├── api.ts                # API client utilities
│   │   ├── utils.ts              # General utilities
│   │   └── types.ts              # TypeScript type definitions
│   └── hooks/                    # React hooks
│       ├── use-cluster-status.ts
│       ├── use-operators.ts
│       ├── use-databases.ts
│       └── use-secrets.ts
└── public/                       # Static assets
    ├── icons/
    └── images/
```

## Phase 1: Core Infrastructure Setup

### 1.1 Project Initialization

**Create Next.js Project with TypeScript**

```bash
cd packages/dashboard
npm init -y
npm install next@latest react@latest react-dom@latest typescript @types/react @types/node
npm install -D tailwindcss postcss autoprefixer eslint eslint-config-next
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @monaco-editor/react
```

**package.json configuration:**

```json
{
  "name": "@interweb/dashboard",
  "version": "0.0.1",
  "description": "Web dashboard for Interweb Kubernetes toolkit",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@interweb/client": "workspace:^",
    "@interweb/interwebjs": "workspace:^",
    "@interweb/manifests": "workspace:^"
  }
}
```

### 1.2 Base Layout Setup

**Create main layout (src/app/layout.tsx):**

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interweb Dashboard',
  description: 'Kubernetes cluster management and operations dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64">
              <Header />
              <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

**Create providers (src/app/providers.tsx):**

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        retry: 2,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 1.3 Interweb Client Integration

**Create client wrapper (src/lib/interweb-client.ts):**

```typescript
import { InterwebClient as K8s } from '@interweb/interwebjs';
import { SetupClient } from '@interweb/client';

export class DashboardClient {
  private k8sClient: K8s;
  private setupClient: SetupClient;

  constructor() {
    this.k8sClient = new K8s({ 
      restEndpoint: process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001' 
    } as any);
    this.setupClient = new SetupClient(this.k8sClient);
  }

  get k8s() { return this.k8sClient; }
  get setup() { return this.setupClient; }

  // Cluster operations
  async getClusterStatus() {
    // Implementation using k8sClient
  }

  async getNodes() {
    // Implementation using k8sClient
  }

  // Operator operations
  async installOperator(operatorName: string, config?: any) {
    const manifests = ManifestLoader.loadOperatorManifests(operatorName);
    return await this.setupClient.applyManifests(manifests);
  }

  async uninstallOperator(operatorName: string) {
    // Implementation
  }

  async getOperatorStatus(operatorName: string) {
    // Implementation
  }

  // Database operations (CloudNativePG)
  async createPostgresCluster(config: PostgresClusterConfig) {
    // Implementation
  }

  async deletePostgresCluster(name: string, namespace: string) {
    // Implementation
  }

  async getPostgresClusters(namespace?: string) {
    // Implementation
  }

  // Secret operations
  async createSecret(secret: SecretConfig) {
    // Implementation
  }

  async getSecrets(namespace?: string) {
    // Implementation
  }
}

// Types
export interface PostgresClusterConfig {
  name: string;
  namespace: string;
  replicas: number;
  version: string;
  storage: {
    size: string;
    storageClass: string;
  };
  resources?: {
    limits: {
      cpu: string;
      memory: string;
    };
  };
  backup?: {
    enabled: boolean;
    schedule?: string;
    retention?: string;
  };
}

export interface SecretConfig {
  name: string;
  namespace: string;
  type: 'Opaque' | 'kubernetes.io/dockerconfigjson' | 'kubernetes.io/tls';
  data: Record<string, string>;
}
```

## Phase 2: Dashboard Home Page

### 2.1 Cluster Status Overview

**Create dashboard home (src/app/page.tsx):**

```typescript
'use client';

import { ClusterOverview } from '@/components/dashboard/cluster-overview';
import { OperatorGrid } from '@/components/dashboard/operator-grid';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ResourceSummary } from '@/components/dashboard/resource-summary';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="btn-secondary">Refresh</button>
        </div>
      </div>

      <ClusterOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OperatorGrid />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceSummary />
        <RecentActivity />
      </div>
    </div>
  );
}
```

**Create cluster overview component (src/components/dashboard/cluster-overview.tsx):**

```typescript
'use client';

import { useClusterStatus } from '@/hooks/use-cluster-status';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClusterOverview() {
  const { data: cluster, isLoading } = useClusterStatus();

  if (isLoading) {
    return <div>Loading cluster status...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cluster Status
          <StatusIndicator status={cluster?.status || 'unknown'} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-500">Nodes</div>
            <div className="text-2xl font-semibold">{cluster?.nodeCount || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Pods</div>
            <div className="text-2xl font-semibold">{cluster?.podCount || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Services</div>
            <div className="text-2xl font-semibold">{cluster?.serviceCount || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Operators</div>
            <div className="text-2xl font-semibold">{cluster?.operatorCount || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.2 Operator Grid Component

**Create operator grid (src/components/dashboard/operator-grid.tsx):**

```typescript
'use client';

import { useOperators } from '@/hooks/use-operators';
import { OperatorCard } from '@/components/operators/operator-card';

export function OperatorGrid() {
  const { data: operators, isLoading } = useOperators();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Operators</h2>
      
      {isLoading ? (
        <div>Loading operators...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operators?.map((operator) => (
            <OperatorCard key={operator.name} operator={operator} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Phase 3: Operator Management

### 3.1 Operator Page

**Create operators page (src/app/operators/page.tsx):**

```typescript
'use client';

import { useState } from 'react';
import { useOperators } from '@/hooks/use-operators';
import { OperatorCard } from '@/components/operators/operator-card';
import { OperatorFilters } from '@/components/operators/operator-filters';
import { InstallOperatorDialog } from '@/components/operators/install-operator-dialog';

export default function OperatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: operators, isLoading } = useOperators();

  const filteredOperators = operators?.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Operators</h1>
        <InstallOperatorDialog />
      </div>

      <OperatorFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <div>Loading operators...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOperators?.map((operator) => (
            <OperatorCard key={operator.name} operator={operator} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3.2 Operator Card Component

**Create operator card (src/components/operators/operator-card.tsx):**

```typescript
'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useOperatorMutation } from '@/hooks/use-operators';
import { Settings, ExternalLink } from 'lucide-react';

interface OperatorCardProps {
  operator: {
    name: string;
    displayName: string;
    description: string;
    version: string;
    status: 'installed' | 'not-installed' | 'installing' | 'error';
    icon?: string;
    docsUrl?: string;
  };
}

export function OperatorCard({ operator }: OperatorCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const { installOperator, uninstallOperator } = useOperatorMutation();

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    try {
      if (checked) {
        await installOperator.mutateAsync(operator.name);
      } else {
        await uninstallOperator.mutateAsync(operator.name);
      }
    } finally {
      setIsToggling(false);
    }
  };

  const isInstalled = operator.status === 'installed';
  const isInstalling = operator.status === 'installing' || isToggling;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {operator.icon && (
              <img src={operator.icon} alt={operator.displayName} className="w-8 h-8" />
            )}
            <div>
              <CardTitle className="text-base">{operator.displayName}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                v{operator.version}
              </CardDescription>
            </div>
          </div>
          <StatusIndicator status={operator.status} />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {operator.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <Switch
            checked={isInstalled}
            onCheckedChange={handleToggle}
            disabled={isInstalling}
          />
          <span className="text-sm text-gray-600">
            {isInstalled ? 'Installed' : 'Not installed'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isInstalled && (
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          )}
          {operator.docsUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={operator.docsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
```

## Phase 4: Database Operations (CloudNativePG)

### 4.1 Database Clusters Page

**Create databases page (src/app/databases/page.tsx):**

```typescript
'use client';

import Link from 'next/link';
import { useDatabaseClusters } from '@/hooks/use-databases';
import { DatabaseClusterCard } from '@/components/databases/database-cluster-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DatabasesPage() {
  const { data: clusters, isLoading } = useDatabaseClusters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PostgreSQL Clusters</h1>
        <Button asChild>
          <Link href="/databases/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Cluster
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div>Loading database clusters...</div>
      ) : clusters?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No PostgreSQL clusters found</p>
          <Button asChild>
            <Link href="/databases/create">Create your first cluster</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters?.map((cluster) => (
            <DatabaseClusterCard key={`${cluster.namespace}/${cluster.name}`} cluster={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 4.2 Create Database Cluster Form

**Create database creation form (src/app/databases/create/page.tsx):**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDatabaseMutation } from '@/hooks/use-databases';
import { CreateClusterForm } from '@/components/databases/create-cluster-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateDatabasePage() {
  const router = useRouter();
  const { createCluster } = useDatabaseMutation();

  const handleSubmit = async (config: any) => {
    try {
      await createCluster.mutateAsync(config);
      router.push('/databases');
    } catch (error) {
      console.error('Failed to create cluster:', error);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create PostgreSQL Cluster</h1>
        <p className="text-gray-600">Set up a new CloudNativePG PostgreSQL cluster</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cluster Configuration</CardTitle>
          <CardDescription>
            Configure your PostgreSQL cluster settings. All fields with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateClusterForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Phase 5: API Routes Implementation

### 5.1 Operators API

**Create operators API (src/app/api/operators/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DashboardClient } from '@/lib/interweb-client';

const client = new DashboardClient();

export async function GET() {
  try {
    const operators = await client.getOperators();
    return NextResponse.json(operators);
  } catch (error) {
    console.error('Failed to fetch operators:', error);
    return NextResponse.json({ error: 'Failed to fetch operators' }, { status: 500 });
  }
}
```

**Create operator install API (src/app/api/operators/[operator]/install/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DashboardClient } from '@/lib/interweb-client';

const client = new DashboardClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { operator: string } }
) {
  try {
    const config = await request.json();
    const result = await client.installOperator(params.operator, config);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to install operator:', error);
    return NextResponse.json(
      { error: 'Failed to install operator' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { operator: string } }
) {
  try {
    const result = await client.uninstallOperator(params.operator);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to uninstall operator:', error);
    return NextResponse.json(
      { error: 'Failed to uninstall operator' }, 
      { status: 500 }
    );
  }
}
```

### 5.2 Database API

**Create databases API (src/app/api/databases/clusters/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DashboardClient } from '@/lib/interweb-client';

const client = new DashboardClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const namespace = searchParams.get('namespace');
    
    const clusters = await client.getPostgresClusters(namespace || undefined);
    return NextResponse.json(clusters);
  } catch (error) {
    console.error('Failed to fetch database clusters:', error);
    return NextResponse.json({ error: 'Failed to fetch clusters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    const result = await client.createPostgresCluster(config);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to create database cluster:', error);
    return NextResponse.json({ error: 'Failed to create cluster' }, { status: 500 });
  }
}
```

## Phase 6: React Hooks

### 6.1 Operators Hooks

**Create operators hooks (src/hooks/use-operators.ts):**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Operator {
  name: string;
  displayName: string;
  description: string;
  version: string;
  status: 'installed' | 'not-installed' | 'installing' | 'error';
  icon?: string;
  docsUrl?: string;
}

export function useOperators() {
  return useQuery<Operator[]>({
    queryKey: ['operators'],
    queryFn: async () => {
      const response = await fetch('/api/operators');
      if (!response.ok) throw new Error('Failed to fetch operators');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useOperatorMutation() {
  const queryClient = useQueryClient();

  const installOperator = useMutation({
    mutationFn: async (operatorName: string) => {
      const response = await fetch(`/api/operators/${operatorName}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error('Failed to install operator');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
  });

  const uninstallOperator = useMutation({
    mutationFn: async (operatorName: string) => {
      const response = await fetch(`/api/operators/${operatorName}/install`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to uninstall operator');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
  });

  return { installOperator, uninstallOperator };
}
```

### 6.2 Database Hooks

**Create database hooks (src/hooks/use-databases.ts):**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PostgresClusterConfig } from '@/lib/interweb-client';

interface DatabaseCluster {
  name: string;
  namespace: string;
  status: 'ready' | 'creating' | 'updating' | 'error';
  replicas: number;
  version: string;
  storage: string;
  created: string;
}

export function useDatabaseClusters(namespace?: string) {
  return useQuery<DatabaseCluster[]>({
    queryKey: ['database-clusters', namespace],
    queryFn: async () => {
      const params = namespace ? `?namespace=${namespace}` : '';
      const response = await fetch(`/api/databases/clusters${params}`);
      if (!response.ok) throw new Error('Failed to fetch database clusters');
      return response.json();
    },
    refetchInterval: 30000,
  });
}

export function useDatabaseMutation() {
  const queryClient = useQueryClient();

  const createCluster = useMutation({
    mutationFn: async (config: PostgresClusterConfig) => {
      const response = await fetch('/api/databases/clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to create cluster');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database-clusters'] });
    },
  });

  return { createCluster };
}
```

## Next Steps

1. **Execute Phase 1**: Set up the basic Next.js project structure and integrate with @interweb/client
2. **Build Core UI Components**: Create the basic UI component library (Button, Card, StatusIndicator, etc.)
3. **Implement Dashboard Home**: Build the cluster overview and operator grid
4. **Add Operator Management**: Complete the operator installation interface
5. **Build Database Operations**: Implement CloudNativePG cluster management
6. **Add Secrets Management**: Create the secrets creation and management interface
7. **Testing & Polish**: Add error handling, loading states, and comprehensive testing

This implementation plan provides a solid foundation for building the Interweb Dashboard with a clear progression from basic infrastructure to full functionality.
