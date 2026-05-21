import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cart', '/checkout', '/login', '/register', '/profile', '/orders', '/dashboard', '/order-confirmation'],
    },
    sitemap: 'https://samsumamart.co.ke/sitemap.xml',
  }
}
