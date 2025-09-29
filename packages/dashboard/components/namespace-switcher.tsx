'use client'

import { useNamespaces } from '@/hooks'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NamespaceSwitcher() {
  const { namespace, setNamespace } = usePreferredNamespace()
  const { data, isLoading, error, refetch } = useNamespaces()

  const namespaces = data?.items?.map(item => item.metadata?.name).filter(Boolean) || []

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Namespace:</label>
      <Select
        value={namespace}
        onValueChange={setNamespace}
        disabled={isLoading || !!error}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select namespace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">
            <div className="flex items-center gap-2">
              All Namespaces
              <Badge variant="outline" className="text-xs">
                All
              </Badge>
            </div>
          </SelectItem>
          {namespaces.map((ns) => (
            <SelectItem key={ns} value={ns!}>
              <div className="flex items-center gap-2">
                {ns}
                {ns === 'default' && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
                {(ns === 'kube-system' || ns === 'kube-public') && (
                  <Badge variant="outline" className="text-xs">
                    System
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => refetch()}
        disabled={isLoading}
        className="h-8 w-8"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )
}