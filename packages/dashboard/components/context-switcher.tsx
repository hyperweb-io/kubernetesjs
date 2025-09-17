'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Layers, 
  Server, 
  Code
} from 'lucide-react'

type RouteMode = 'smart-objects' | 'infra' | 'editor'

const modeConfig = {
  'smart-objects': {
    label: 'Smart Objects',
    icon: Layers,
    color: 'text-purple-600',
    route: '/d'
  },
  'infra': {
    label: 'Infrastructure', 
    icon: Server,
    color: 'text-blue-600',
    route: '/i'
  },
  'editor': {
    label: 'Editor',
    icon: Code,
    color: 'text-green-600',
    route: '/editor'
  }
}

// Determine current mode from route
function getModeFromRoute(pathname: string): RouteMode {
  if (pathname === '/editor') return 'editor'
  if (pathname === '/d' || pathname.startsWith('/d/')) return 'smart-objects'
  if (pathname === '/i' || pathname.startsWith('/i/')) return 'infra'
  return 'infra' // Default
}

interface ContextSwitcherProps {
  variant?: 'sidebar' | 'header' | 'compact'
}

export function ContextSwitcher({ variant = 'sidebar' }: ContextSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const currentMode = getModeFromRoute(pathname)
  const currentConfig = modeConfig[currentMode]

  const handleModeChange = (newMode: RouteMode) => {
    const config = modeConfig[newMode]
    router.push(config.route)
  }

  // Compact version - just an icon that opens dropdown
  if (variant === 'compact') {
    return (
      <div className="px-2 pb-2">
        <Select
          value={currentMode}
          onValueChange={handleModeChange}
        >
          <SelectTrigger className="w-12 h-12 p-0 border-none bg-transparent hover:bg-accent flex items-center justify-center [&>svg:last-child]:hidden">
            <currentConfig.icon className={`w-5 h-5 ${currentConfig.color}`} />
          </SelectTrigger>
          <SelectContent align="start" side="right">
            {Object.entries(modeConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <SelectItem key={key} value={key as RouteMode}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // Regular versions
  const containerClasses = variant === 'sidebar' 
    ? "px-4 pb-4 border-b" 
    : ""
  
  const triggerClasses = variant === 'sidebar'
    ? "w-full"
    : "w-[180px]"

  return (
    <div className={containerClasses}>
      <Select
        value={currentMode}
        onValueChange={handleModeChange}
      >
        <SelectTrigger className={triggerClasses}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(modeConfig).map(([key, config]) => {
            const Icon = config.icon
            return (
              <SelectItem key={key} value={key as RouteMode}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}