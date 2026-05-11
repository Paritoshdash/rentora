import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Rentora — Smart Property Management', template: '%s | Rentora' },
  description: 'Manage your rental properties, tenants, rent collection, expenses, and reports — free forever.',
  keywords: 'property management, rent collection, landlord software, tenant management, rental management India',
  openGraph: {
    title: 'Rentora — Smart Property Management',
    description: 'The all-in-one rental management platform for modern landlords. Free forever.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
