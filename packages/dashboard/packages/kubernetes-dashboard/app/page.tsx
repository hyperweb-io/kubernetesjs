'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DeploymentsView } from '@/components/resources/deployments'
import { ServicesView } from '@/components/resources/services'
import { SecretsView } from '@/components/resources/secrets'
import { ConfigMapsView } from '@/components/resources/configmaps'
import { TemplatesView } from '@/components/templates/templates'
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
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'deployments', label: 'Deployments', icon: Package },
  { id: 'services', label: 'Services', icon: Server },
  { id: 'secrets', label: 'Secrets', icon: Key },
  { id: 'configmaps', label: 'ConfigMaps', icon: Settings },
  { id: 'templates', label: 'Templates', icon: FileCode2 },
  { id: 'replicasets', label: 'ReplicaSets', icon: Copy },
  { id: 'pods', label: 'Pods', icon: Activity },
]

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${
                  activeSection === item.id ? 'bg-accent border-l-4 border-primary' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </button>
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
            <h2 className="ml-4 text-xl font-semibold capitalize">
              {activeSection.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Cluster: local</span>
            <span className="text-sm text-muted-foreground">Namespace: default</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Welcome to Kubernetes Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              This dashboard provides a user-friendly interface for managing your Kubernetes resources.
              Select a resource type from the sidebar to get started.
            </p>
            
            {activeSection === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {navigationItems.slice(1).map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="bg-background rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="w-8 h-8 text-primary mr-3" />
                        <h4 className="font-semibold">{item.label}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Manage and monitor your {item.label.toLowerCase()}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {activeSection === 'deployments' && <DeploymentsView />}
            {activeSection === 'services' && <ServicesView />}
            {activeSection === 'secrets' && <SecretsView />}
            {activeSection === 'configmaps' && <ConfigMapsView />}
            {activeSection === 'templates' && <TemplatesView />}
            
            {activeSection !== 'overview' && activeSection !== 'deployments' && activeSection !== 'services' && activeSection !== 'secrets' && activeSection !== 'configmaps' && activeSection !== 'templates' && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeSection} management interface coming soon...
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}