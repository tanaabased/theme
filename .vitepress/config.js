import { defineConfig } from '../config.js';

const baseUrl = 'https://theme.tanaab.dev/';

export default defineConfig({
  appearance: {
    initialValue: 'dark',
  },
  lang: 'en-US',
  title: 'Theme & Stylesheet',
  description: 'A Tanaab based theme and styleguide.',
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
    navbar: true,
    nav: [
      { text: 'Styleguide', link: '/styleguide/' },
      { text: 'Components', link: '/components/' },
      { text: 'Containers', link: '/containers/' },
      { text: 'Usage', link: '/usage/' },
    ],
    sidebar: {
      '/styleguide/': [
        { text: 'Overview', link: '/styleguide/' },
        {
          text: 'Foundations',
          items: [
            { text: 'Brand Principles', link: '/styleguide/brand-principles' },
            { text: 'Color System', link: '/styleguide/color-system' },
            { text: 'Typography', link: '/styleguide/typography' },
            { text: 'Spacing & Rhythm', link: '/styleguide/spacing-rhythm' },
          ],
        },
        {
          text: 'Editorial',
          items: [
            { text: 'Voice & Tone', link: '/styleguide/voice-tone' },
            { text: 'Content Patterns', link: '/styleguide/content-patterns' },
            { text: 'Accessibility', link: '/styleguide/accessibility' },
          ],
        },
      ],
      '/components/': [
        { text: 'Overview', link: '/components/' },
        {
          text: 'Inputs',
          items: [
            { text: 'Buttons', link: '/components/buttons' },
            { text: 'Form Fields', link: '/components/form-fields' },
            { text: 'Selects & Toggles', link: '/components/selects-toggles' },
          ],
        },
        {
          text: 'Navigation',
          items: [
            { text: 'Navbar', link: '/components/navbar' },
            { text: 'Side Navigation', link: '/components/side-navigation' },
            { text: 'Breadcrumbs', link: '/components/breadcrumbs' },
          ],
        },
        {
          text: 'Content & Feedback',
          items: [
            { text: 'Cards', link: '/components/cards' },
            { text: 'Data Tables', link: '/components/data-tables' },
            { text: 'Alerts & Notices', link: '/components/alerts-notices' },
          ],
        },
      ],
      '/containers/': [
        { text: 'Overview', link: '/containers/' },
        {
          text: 'Page Shells',
          items: [
            { text: 'Site Header & Footer', link: '/containers/site-header-footer' },
            { text: 'Marketing Page', link: '/containers/marketing-page' },
            { text: 'Documentation Page', link: '/containers/documentation-page' },
          ],
        },
        {
          text: 'Content Regions',
          items: [
            { text: 'Hero Section', link: '/containers/hero-section' },
            { text: 'Feature Grid', link: '/containers/feature-grid' },
            { text: 'Content Well', link: '/containers/content-well' },
          ],
        },
      ],
      '/usage/': [
        { text: 'Overview', link: '/usage/' },
        {
          text: 'Adoption',
          items: [
            { text: 'Getting Started', link: '/usage/getting-started' },
            { text: 'Installation', link: '/usage/installation' },
            { text: 'Project Structure', link: '/usage/project-structure' },
          ],
        },
        {
          text: 'Implementation',
          items: [
            { text: 'Theming', link: '/usage/theming' },
            { text: 'Extending Components', link: '/usage/extending-components' },
            { text: 'Container Assembly', link: '/usage/container-assembly' },
          ],
        },
        {
          text: 'Operations',
          items: [
            { text: 'Versioning & Releases', link: '/usage/versioning-releases' },
            { text: 'Migration Notes', link: '/usage/migration-notes' },
          ],
        },
      ],
    },
    autometa: {
      canonicalUrl: baseUrl,
      image: baseUrl,
      twitter: '@tanaabased',
      x: '@tanaabased',
    },
    ga: {
      id: 'G-5FX6Z0BWFR',
    },
  },
});
