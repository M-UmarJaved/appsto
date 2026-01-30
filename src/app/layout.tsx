import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeProvider from '@/components/theme/ThemeProvider'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Appsto - Premium SaaS Marketplace | Enterprise Software Solutions',
  description: 'Discover, purchase, and manage enterprise-grade SaaS applications in one secure marketplace. Instant license delivery, flexible pricing, and 24/7 support. Trusted by 10,000+ professionals worldwide.',
  keywords: [
    'saas marketplace',
    'enterprise software',
    'software licensing',
    'business applications',
    'cloud software',
    'productivity tools',
    'software subscription',
    'perpetual license',
    'instant delivery',
    'secure software',
    'professional tools',
    'business software',
    'saas platform',
    'software solutions',
    'enterprise apps'
  ],
  authors: [{ name: 'Appsto' }],
  icons: {
    icon: '/Favicon.png',
  },
  openGraph: {
    title: 'Appsto - Premium SaaS Marketplace for Enterprise Software',
    description: 'Your trusted platform for discovering and purchasing enterprise-grade SaaS applications. Secure licensing, instant delivery, and exceptional support for businesses worldwide.',
    url: 'https://appsto.software',
    siteName: 'Appsto',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#F9FAFB] dark:bg-[#0B1220]`}>
        <ThemeProvider>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
