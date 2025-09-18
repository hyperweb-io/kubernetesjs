import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import dynamic from 'next/dynamic';
// Avoid SSR for icon-heavy client components to prevent hydration mismatches
const Sidebar = dynamic(() => import('@/components/layout/sidebar').then(m => m.Sidebar), { ssr: false });
const Header = dynamic(() => import('@/components/layout/header').then(m => m.Header), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interweb Dashboard',
  description: 'Kubernetes cluster management and operations dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64">
              <Header />
              <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
