'use client'

import { useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NamespaceSwitcher } from '@/components/namespace-switcher'
import { useKubernetes } from '../k8s/context'
import {
  Package,
  Server,
  Shield,
  Settings,
  Key,
  Copy,
  Activity,
  Home,
  Menu,
  X,
  FileCode2,
  Layers,
  Calendar,
  Clock,
  Gauge,
  ShieldCheck,
  Star,
  Cpu,
  Globe,
  Network,
  Link,
  HardDrive,
  Database,
  Paperclip,
  Bot,
  UserCheck,
  Users,
  Zap,
  BarChart,
  Grid3x3
} from 'lucide-react'

const navigationItems = [
  // Overview
  { id: 'overview', label: 'Overview', icon: Home, href: '/', section: 'overview' },
  { id: 'all', label: 'All Resources', icon: Grid3x3, href: '/all', section: 'overview' },
  
  // Workloads
  { id: 'workloads-header', label: 'Workloads', isHeader: true },
  { id: 'deployments', label: 'Deployments', icon: Package, href: '/deployments', section: 'workloads' },
  { id: 'replicasets', label: 'ReplicaSets', icon: Copy, href: '/replicasets', section: 'workloads' },
  { id: 'statefulsets', label: 'StatefulSets', icon: Layers, href: '/statefulsets', section: 'workloads' },
  { id: 'daemonsets', label: 'DaemonSets', icon: Shield, href: '/daemonsets', section: 'workloads' },
  { id: 'pods', label: 'Pods', icon: Activity, href: '/pods', section: 'workloads' },
  { id: 'jobs', label: 'Jobs', icon: Zap, href: '/jobs', section: 'workloads' },
  { id: 'cronjobs', label: 'CronJobs', icon: Calendar, href: '/cronjobs', section: 'workloads' },
  
  // Config & Storage
  { id: 'config-header', label: 'Config & Storage', isHeader: true },
  { id: 'configmaps', label: 'ConfigMaps', icon: Settings, href: '/configmaps', section: 'config' },
  { id: 'secrets', label: 'Secrets', icon: Key, href: '/secrets', section: 'config' },
  { id: 'pvcs', label: 'Persistent Volume Claims', icon: HardDrive, href: '/pvcs', section: 'config' },
  { id: 'pvs', label: 'Persistent Volumes', icon: Database, href: '/pvs', section: 'config' },
  { id: 'storageclasses', label: 'Storage Classes', icon: Database, href: '/storageclasses', section: 'config' },
  { id: 'volumeattachments', label: 'Volume Attachments', icon: Paperclip, href: '/volumeattachments', section: 'config' },
  
  // Network
  { id: 'network-header', label: 'Network', isHeader: true },
  { id: 'services', label: 'Services', icon: Server, href: '/services', section: 'network' },
  { id: 'ingresses', label: 'Ingresses', icon: Globe, href: '/ingresses', section: 'network' },
  { id: 'networkpolicies', label: 'Network Policies', icon: Shield, href: '/networkpolicies', section: 'network' },
  { id: 'endpoints', label: 'Endpoints', icon: Network, href: '/endpoints', section: 'network' },
  { id: 'endpointslices', label: 'Endpoint Slices', icon: Network, href: '/endpointslices', section: 'network' },
  
  // Access Control
  { id: 'rbac-header', label: 'Access Control', isHeader: true },
  { id: 'serviceaccounts', label: 'Service Accounts', icon: Bot, href: '/serviceaccounts', section: 'rbac' },
  { id: 'roles', label: 'Roles', icon: UserCheck, href: '/roles', section: 'rbac' },
  { id: 'rolebindings', label: 'Role Bindings', icon: Users, href: '/rolebindings', section: 'rbac' },
  
  // Cluster
  { id: 'cluster-header', label: 'Cluster', isHeader: true },
  { id: 'resourcequotas', label: 'Resource Quotas', icon: Gauge, href: '/resourcequotas', section: 'cluster' },
  { id: 'hpas', label: 'Horizontal Pod Autoscalers', icon: BarChart, href: '/hpas', section: 'cluster' },
  { id: 'pdbs', label: 'Pod Disruption Budgets', icon: ShieldCheck, href: '/pdbs', section: 'cluster' },
  { id: 'priorityclasses', label: 'Priority Classes', icon: Star, href: '/priorityclasses', section: 'cluster' },
  { id: 'runtimeclasses', label: 'Runtime Classes', icon: Cpu, href: '/runtimeclasses', section: 'cluster' },
  { id: 'events', label: 'Events', icon: Clock, href: '/events', section: 'cluster' },
  
  // Templates
  { id: 'templates-header', label: 'Templates', isHeader: true },
  { id: 'templates', label: 'YAML Templates', icon: FileCode2, href: '/templates', section: 'templates' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { config } = useKubernetes();
  // Find active section based on pathname
  const activeSection = navigationItems.find(item => !item.isHeader && item.href === pathname)?.label || 'Overview'

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">K8s Dashboard</h1>
        </div>
        <nav className="mt-8 pb-4">
          {navigationItems.map((item) => {
            if (item.isHeader) {
              return (
                <div key={item.id} className="px-4 py-2 mt-4 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
              )
            }
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <NextLink
                key={item.id}
                href={item.href}
                className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-accent transition-colors ${
                  isActive ? 'bg-accent border-l-4 border-primary' : ''
                }`}
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NextLink>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h2 className="ml-4 text-xl font-semibold">
              {activeSection}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Cluster: {config.restEndpoint}</span>
            <NamespaceSwitcher />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}