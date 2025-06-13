'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  Package,
  Server,
  Key,
  Settings,
  FileCode2,
  Copy,
  Activity,
  ArrowRight,
  Layers
} from 'lucide-react'

const resources = [

  {
    id: 'all',
    title: 'View All',
    description: 'See all resources in one dashboard',
    icon: Layers,
    href: '/i/all',
    color: 'text-gray-600'
  },
  {
    id: 'deployments',
    title: 'Deployments',
    description: 'Manage and monitor your deployments',
    icon: Package,
    href: '/i/deployments',
    color: 'text-blue-600'
  },
  {
    id: 'services',
    title: 'Services', 
    description: 'Manage your services and networking',
    icon: Server,
    href: '/i/services',
    color: 'text-green-600'
  },
  {
    id: 'secrets',
    title: 'Secrets',
    description: 'Manage sensitive data and credentials',
    icon: Key,
    href: '/i/secrets',
    color: 'text-yellow-600'
  },
  {
    id: 'configmaps',
    title: 'ConfigMaps',
    description: 'Manage application configuration data',
    icon: Settings,
    href: '/i/configmaps',
    color: 'text-purple-600'
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Manage and deploy resource templates',
    icon: FileCode2,
    href: '/i/templates',
    color: 'text-indigo-600'
  },
  {
    id: 'replicasets',
    title: 'ReplicaSets',
    description: 'Manage and monitor your replica sets',
    icon: Copy,
    href: '/i/replicasets',
    color: 'text-pink-600'
  },
  {
    id: 'pods',
    title: 'Pods',
    description: 'Monitor and manage individual pods',
    icon: Activity,
    href: '/i/pods',
    color: 'text-orange-600'
  }
]

export default function InfrastructureOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Infrastructure Overview</h1>
        <p className="text-muted-foreground mt-2">
          Manage your Kubernetes infrastructure resources.
          Select a resource type below to get started.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <Link key={resource.id} href={resource.href} legacyBehavior>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                  <div className={`p-3 rounded-lg bg-secondary ${resource.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {resource.description}
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              View detailed statistics for each resource type by navigating to their respective pages.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Namespace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Use the namespace switcher in the header to change the active namespace.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">API Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Connected to Kubernetes API. Ensure kubectl proxy is running on port 8001.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}