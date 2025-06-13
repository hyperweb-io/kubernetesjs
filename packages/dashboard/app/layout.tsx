import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@interchain-ui/react/styles';
import { Providers } from './providers';
import { AppLayout } from '@/components/app-layout';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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
