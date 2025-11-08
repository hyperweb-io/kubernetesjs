'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, Key, Rocket } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Deploy Database',
      description: 'Create a PostgreSQL cluster',
      href: '/databases/create',
      icon: Database,
      color: 'bg-blue-500',
    },
    {
      title: 'Deploy Application',
      description: 'Deploy a new application',
      href: '/applications/create',
      icon: Rocket,
      color: 'bg-green-500',
    },
    {
      title: 'Create Secret',
      description: 'Store credentials securely',
      href: '/secrets/create',
      icon: Key,
      color: 'bg-purple-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="w-full justify-start h-auto p-4"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
