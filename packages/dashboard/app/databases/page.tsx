'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from 'lucide-react'

export default function DatabasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Databases</h1>
        <p className="text-muted-foreground mt-2">
          Manage your cloud databases and data services.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 gap-4">
            <div className="p-3 rounded-lg bg-secondary text-blue-600">
              <Database className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Cloud Databases</CardTitle>
              <CardDescription className="mt-1">
                High-level database abstractions
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - manage your databases without infrastructure complexity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}