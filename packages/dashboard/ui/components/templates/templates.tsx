'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Cloud, Cpu } from 'lucide-react'
import { TemplateDialog } from './template-dialog'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  details: {
    image: string
    ports: number[]
    environment?: { [key: string]: string }
  }
}

const templates: Template[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'PostgreSQL database with pgvector extension for vector storage',
    icon: Database,
    details: {
      image: 'pyramation/pgvector:13.3-alpine',
      ports: [5432],
      environment: {
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'postgres',
        POSTGRES_DB: 'postgres'
      }
    }
  },
  {
    id: 'minio',
    name: 'MinIO',
    description: 'High-performance object storage compatible with S3 API',
    icon: Cloud,
    details: {
      image: 'minio/minio:latest',
      ports: [9000],
      environment: {
        MINIO_ROOT_USER: 'minioadmin',
        MINIO_ROOT_PASSWORD: 'minioadmin'
      }
    }
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run large language models locally with a simple API',
    icon: Cpu,
    details: {
      image: 'ollama/ollama:latest',
      ports: [11434]
    }
  }
]

export function TemplatesView() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeploy = (template: Template) => {
    setSelectedTemplate(template)
    setIsDialogOpen(true)
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Application Templates</h3>
        <p className="text-muted-foreground">
          Deploy pre-configured applications with a single click. These templates include best practices and sensible defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">Template</Badge>
                </div>
                <CardTitle className="mt-2">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Image:</span>
                    <span className="ml-2 text-muted-foreground">{template.details.image}</span>
                  </div>
                  <div>
                    <span className="font-medium">Ports:</span>
                    <span className="ml-2 text-muted-foreground">{template.details.ports.join(', ')}</span>
                  </div>
                  {template.details.environment && (
                    <div>
                      <span className="font-medium">Environment Variables:</span>
                      <ul className="mt-1 ml-4 text-muted-foreground">
                        {Object.entries(template.details.environment).map(([key, value]) => (
                          <li key={key} className="text-xs">
                            {key}: {key.includes('PASSWORD') ? '••••••••' : value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => handleDeploy(template)}
                >
                  Deploy {template.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedTemplate && (
        <TemplateDialog
          template={selectedTemplate}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  )
}