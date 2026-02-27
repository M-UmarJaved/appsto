import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ustad of Hacks - Premium Software & Tech Tools',
  description: 'Get professional software and productivity tools. Join 2,400+ tech enthusiasts using our tools.',
  openGraph: {
    title: 'Ustad of Hacks - Premium Software & Tech Tools',
    description: 'Get professional software and productivity tools. Join 2,400+ tech enthusiasts.',
    url: 'https://appsto.software/links/ustad-of-hacks',
    siteName: 'Appsto',
    images: [
      {
        url: 'https://appsto.software/UOH/logo.png',
        width: 400,
        height: 400,
        alt: 'Ustad of Hacks',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Ustad of Hacks - Premium Software & Tech Tools',
    description: 'Get professional software and productivity tools.',
    images: ['https://appsto.software/UOH/logo.png'],
  },
};

export default function UstadOfHacksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
