import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/email-preview/',
      ],
    },
    sitemap: 'https://appsto.software/sitemap.xml',
  }
}
