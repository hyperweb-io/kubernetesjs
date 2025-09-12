'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Boxes,
  Database,
  Rocket,
  Key,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Operators', href: '/operators', icon: Boxes },
  { name: 'Databases', href: '/databases', icon: Database },
  { name: 'Applications', href: '/applications', icon: Rocket },
  { name: 'Secrets', href: '/secrets', icon: Key },
  { name: 'Monitoring', href: '/monitoring', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gray-900">Interweb</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                          isActive
                            ? 'bg-gray-50 text-primary'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        )}
                      >
                        <item.icon
                          className={cn(\n                            'h-6 w-6 shrink-0',\n                            isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'\n                          )}\n                          aria-hidden=\"true\"\n                        />\n                        {item.name}\n                      </Link>\n                    </li>\n                  );\n                })}\n              </ul>\n            </li>\n\n            {/* Footer */}\n            <li className=\"mt-auto\">\n              <div className=\"rounded-md bg-gray-50 p-3\">\n                <div className=\"text-xs text-gray-500 mb-1\">Cluster Context</div>\n                <div className=\"text-sm font-medium text-gray-900\">kubectl current-context</div>\n              </div>\n            </li>\n          </ul>\n        </nav>\n      </div>\n    </div>\n  );\n}"]}]
