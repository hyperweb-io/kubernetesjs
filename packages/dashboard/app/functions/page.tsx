'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export default function FunctionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cloud Functions</h1>
        <p className="text-muted-foreground mt-2">
          Deploy and manage serverless functions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 gap-4">
            <div className="p-3 rounded-lg bg-secondary text-yellow-600">
              <Zap className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Serverless Functions</CardTitle>
              <CardDescription className="mt-1">
                Auto-scaling compute functions
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon - deploy functions without managing infrastructure
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}