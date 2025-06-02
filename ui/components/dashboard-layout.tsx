'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NamespaceSwitcher } from '@/components/namespace-switcher'
import { usePreferredNamespace } from '@/hooks'
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
  FileCode2
} from 'lucide-react'

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: Home, href: '/' },
  { id: 'deployments', label: 'Deployments', icon: Package, href: '/deployments' },
  { id: 'services', label: 'Services', icon: Server, href: '/services' },
  { id: 'secrets', label: 'Secrets', icon: Key, href: '/secrets' },
  { id: 'configmaps', label: 'ConfigMaps', icon: Settings, href: '/configmaps' },
  { id: 'templates', label: 'Templates', icon: FileCode2, href: '/templates' },
  { id: 'replicasets', label: 'ReplicaSets', icon: Copy, href: '/replicasets' },
  { id: 'pods', label: 'Pods', icon: Activity, href: '/pods' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { namespace } = usePreferredNamespace()
  
  // Find active section based on pathname
  const activeSection = navigationItems.find(item => item.href === pathname)?.label || 'Overview'

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">K8s Dashboard</h1>
        </div>
        <nav className="mt-8">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${
                  isActive ? 'bg-accent border-l-4 border-primary' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
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
            <span className="text-sm text-muted-foreground">Namespace: {namespace}</span>
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
