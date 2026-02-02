import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeProvider from '@/components/theme/ThemeProvider'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://appsto.software'),
  title: {
    default: 'Appsto - The Software Marketplace',
    template: '%s | Appsto'
  },
  description: 'The premier marketplace for student entrepreneurs and solo developers to buy and sell software tools like DeskSweep. Secure licensing, instant delivery, and exceptional support.',
  keywords: [
    'software marketplace',
    'student entrepreneur',
    'buy software',
    'sell software',
    'DeskSweep',
    'digital ocean',
    'saas marketplace',
    'desktop applications',
    'software licensing',
    'instant delivery',
    'file organization',
    'productivity tools',
    'indie software',
    'developer tools',
    'business applications',
    'cloud software'
  ],
  authors: [{ name: 'Appsto', url: 'https://appsto.software' }],
  creator: 'Muhammad Umar Javed',
  publisher: 'Appsto.Software',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/Favicon.png',
    apple: '/Favicon.png',
  },
  openGraph: {
    title: 'Appsto - The Software Marketplace',
    description: 'The premier marketplace for software tools. Buy and sell applications with secure licensing and instant delivery.',
    url: 'https://appsto.software',
    siteName: 'Appsto',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Appsto - Software Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appsto - The Software Marketplace',
    description: 'The premier marketplace for student entrepreneurs and solo developers to buy and sell software tools.',
    images: ['/Logo.png'],
  },
  alternates: {
    canonical: 'https://appsto.software',
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
