import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { DashboardLayout } from '@/components/dashboard-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kubernetes Dashboard',
  description: 'A modern dashboard for managing Kubernetes resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </Providers>
      </body>
    </html>
  )
}