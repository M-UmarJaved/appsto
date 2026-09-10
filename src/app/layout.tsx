import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ThemeProvider from '@/components/theme/ThemeProvider'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: false,
})

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
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '96x96', type: 'image/png' },
      { url: '/Favicon.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.removeItem('theme');document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white text-[#060C17]`}>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Load Paddle.js v2 */}
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
