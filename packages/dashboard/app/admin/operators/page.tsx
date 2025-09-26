'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { OperatorFilters } from '@/components/admin/operator-filters';
import { useOperators } from '@/hooks/use-operators';
import { OperatorCard } from '@/components/admin/operator-card';

export default function OperatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: operators, isLoading, error } = useOperators();

  const filteredOperators = operators?.filter(op => {
    const matchesSearch = op.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operators</h1>
          <p className="text-gray-600">
            Install and manage Kubernetes operators for your cluster
          </p>
        </div>
      </div>

      <OperatorFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading operators...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load operators</p>
              <p className="text-sm text-gray-500">
                Check your cluster connection and try again
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOperators?.map((operator) => (
              <OperatorCard key={operator.name} operator={operator} />
            ))}
          </div>

          {filteredOperators?.length === 0 && operators && operators.length > 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">No operators match your filters</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search term or status filter
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}