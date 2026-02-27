import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'The Splash Setup - Premium Software for Creators',
  description: 'Professional software and creative tools for content creators. Join 2,800+ creators worldwide.',
  openGraph: {
    title: 'The Splash Setup - Premium Software for Creators',
    description: 'Professional software and creative tools for content creators. Join 2,800+ creators.',
    url: 'https://appsto.software/links/the-splash-setup',
    siteName: 'Appsto',
    images: [
      {
        url: 'https://appsto.software/TSS/logo.png',
        width: 400,
        height: 400,
        alt: 'The Splash Setup',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'The Splash Setup - Premium Software for Creators',
    description: 'Professional software and creative tools for content creators.',
    images: ['https://appsto.software/TSS/logo.png'],
  },
};

export default function TheSplashSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
