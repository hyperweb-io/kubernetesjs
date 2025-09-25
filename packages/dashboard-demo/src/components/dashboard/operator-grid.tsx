'use client';

import Link from 'next/link';
import { useOperators } from '@/hooks/use-operators';
import { OperatorCard } from '@/components/operators/operator-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight } from 'lucide-react';

export function OperatorGrid() {
  const { data: operators, isLoading, error } = useOperators();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operators</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading operators...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operators</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load operators</p>
            <p className="text-sm text-gray-500">Check your cluster connection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const installedOperators = operators?.filter(op => op.status === 'installed') || [];
  const displayOperators = operators?.slice(0, 6) || []; // Show first 6 on dashboard

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Operators</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/operators" className="flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            {installedOperators.length} of {operators?.length || 0} operators installed
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayOperators.map((operator) => (
            <OperatorCard 
              key={operator.name} 
              operator={operator}
              compact={true}
            />
          ))}
        </div>
        
        {operators && operators.length > 6 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/operators">
                View all {operators.length} operators
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
