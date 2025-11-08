'use client';

import { usePathname } from 'next/navigation';

import { DashboardLayout } from './dashboard-layout';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  onChatToggle: () => void;
  chatVisible: boolean;
  chatLayoutMode: 'floating' | 'snapped';
  chatWidth: number;
}

// Determine layout mode purely from route
function getModeFromRoute(pathname: string): 'smart-objects' | 'infra' | 'admin' {
  if (pathname === '/d' || pathname.startsWith('/d/')) {
    return 'smart-objects';
  }
  if (pathname === '/i' || pathname.startsWith('/i/')) {
    return 'infra';
  }
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'admin';
  }
  // Legacy routes without prefix default to infra
  return 'infra';
}

export function AdaptiveLayout(props: AdaptiveLayoutProps) {
  const pathname = usePathname();
  const mode = getModeFromRoute(pathname);

  // Use dashboard layout with mode for everything else
  return <DashboardLayout {...props} mode={mode} />;
}
