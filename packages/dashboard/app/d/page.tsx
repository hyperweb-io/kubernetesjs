'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  Database,
  Zap,
  Link as LinkIcon,
  FileCode2,
  Globe,
  Settings,
  ArrowRight,
  Activity,
  TrendingUp,
  Users
} from 'lucide-react'

const smartObjects = [
  {
    id: 'databases',
    title: 'Databases',
    description: 'Manage your databases and data storage',
    icon: Database,
    href: '/d/databases',
    color: 'text-blue-600',
    status: 'Available'
  },
  {
    id: 'functions',
    title: 'Cloud Functions',
    description: 'Serverless functions and microservices',
    icon: Zap,
    href: '/d/functions',
    color: 'text-yellow-600',
    status: 'Available'
  },
  {
    id: 'chains',
    title: 'Blockchains',
    description: 'Connected blockchain networks',
    icon: LinkIcon,
    href: '/d/chains',
    color: 'text-purple-600',
    status: 'Available'
  },
  {
    id: 'contracts',
    title: 'Smart Contracts',
    description: 'Deployed smart contracts and ABIs',
    icon: FileCode2,
    href: '/d/contracts',
    color: 'text-green-600',
    status: 'Available'
  },
  {
    id: 'relayers',
    title: 'Relayers',
    description: 'Cross-chain communication relayers',
    icon: Globe,
    href: '/d/relayers',
    color: 'text-indigo-600',
    status: 'Available'
  },
  {
    id: 'registry',
    title: 'Registry',
    description: 'Service and contract registry',
    icon: Database,
    href: '/d/registry',
    color: 'text-pink-600',
    status: 'Available'
  }
]

export default function SmartObjectsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Objects Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          High-level management interface for your distributed applications, databases, and blockchain infrastructure.
        </p>
      </div>
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Function Executions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Chains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">All networks healthy</p>
          </CardContent>
        </Card>
      </div>
      {/* Smart Objects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Cloud Services</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {smartObjects.slice(0, 2).map((object) => {
            const Icon = object.icon
            return (
              <Link key={object.id} href={object.href} legacyBehavior>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                    <div className={`p-3 rounded-lg bg-secondary ${object.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{object.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {object.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Blockchain Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Blockchain Infrastructure</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {smartObjects.slice(2).map((object) => {
            const Icon = object.icon
            return (
              <Link key={object.id} href={object.href} legacyBehavior>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                    <div className={`p-3 rounded-lg bg-secondary ${object.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{object.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {object.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                All systems operational. View detailed metrics in individual service pages.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Latest deployments, function executions, and blockchain transactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}