import { defineConfig } from '../config.js';

const baseUrl = 'https://theme.tanaab.dev/';

export default defineConfig({
  lang: 'en-US',
  title: 'VIBES RISING',
  description: 'A Tanaab subtheme built on vitepress-theme-default-plus.',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64x64.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '128x128', href: '/favicon-128x128.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '256x256', href: '/favicon-256x256.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-192x192.png' }],
    ['meta', { name: 'theme-color', content: '#00C88A' }],
  ],
  robots: {
    host: baseUrl,
    sitemap: `${baseUrl}sitemap.xml`,
    disallowAll: false,
    allowAll: false,
    policy: [],
    policies: [
      {
        userAgent: '*',
        disallow: ['/v/'],
        allow: '/',
      },
    ],
  },
  sitemap: {
    hostname: baseUrl,
    lastmodDateOnly: false,
    transformItems: (items) => {
      for (const item of items) {
        item.priority = 0.5;
        item.changefreq = 'daily';
      }
      return items;
    },
  },
  themeConfig: {
    autometa: {
      canonicalUrl: baseUrl,
      image: baseUrl,
      // twitter: '@devwithlando',
      // x: '@devwithlando',
    },
  },
});
