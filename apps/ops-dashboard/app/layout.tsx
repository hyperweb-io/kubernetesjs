import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { AppLayout } from '@/components/app-layout';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kubernetes Dashboard',
  description: 'A modern dashboard for managing Kubernetes resources',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NuqsAdapter>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
