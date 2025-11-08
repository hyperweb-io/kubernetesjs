'use client'

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TemplateFilters } from '@/components/admin/template-filters'
import { templates, type Template } from '@/components/templates/templates'
import { TemplateCard } from '@/components/admin/template-card'

type TemplateStatus = 'all' | 'installed' | 'not-installed' | 'installing' | 'error'

export default function AdminTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [globalStatusFilter, setGlobalStatusFilter] = useState<TemplateStatus>('all')
  const [templateStatuses, setTemplateStatuses] = useState<Map<string, TemplateStatus>>(new Map())

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return templates.filter((tpl) => {
      const matchesSearch = tpl.name.toLowerCase().includes(term) || tpl.description.toLowerCase().includes(term)
      
      // Apply global status filter if not 'all'
      if (globalStatusFilter !== 'all') {
        const templateStatus = templateStatuses.get(tpl.id) || 'not-installed'
        if (templateStatus !== globalStatusFilter) {
          return false
        }
      }
      
      return matchesSearch
    })
  }, [searchTerm, globalStatusFilter, templateStatuses])

  const updateTemplateStatus = useCallback((templateId: string, status: TemplateStatus) => {
    setTemplateStatuses(prev => new Map(prev).set(templateId, status))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Deploy and manage application templates</p>
        </div>
      </div>

      <TemplateFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={globalStatusFilter}
        onStatusFilterChange={(v) => setGlobalStatusFilter(v as TemplateStatus)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template: Template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            onStatusChange={updateTemplateStatus}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && templates.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 mb-2">No templates match your filters</p>
              <p className="text-sm text-gray-500">Try adjusting your search term or status filter</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}