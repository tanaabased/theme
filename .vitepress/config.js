import { default as isDevRelease } from '@lando/vitepress-theme-default-plus/is-dev-release';

import { defineConfig } from '../config.js';
import { version } from '../package.json';

const baseUrl = 'https://theme.tanaab.dev/';

// get version info
const semver = process?.env?.VPL_MVB_VERSION ? process.env.VPL_MVB_VERSION : `v${version}`;

const sidebarEnder = {
  text: semver,
  collapsed: true,
  items: [
    {
      text: 'Other Doc Versions',
      items: [
        { rel: 'mvb', text: 'stable', target: '_blank', link: '/stable/' },
        { rel: 'mvb', text: 'edge', target: '_blank', link: '/edge/' },
        { rel: 'mvb', text: '<strong>see all versions</strong>', link: '/' },
      ],
    },
    { text: 'Other Releases', link: 'https://github.com/tanaabased/theme/releases' },
  ],
};

const defaultSidebar = [
  {
    text: 'Branding',
    items: [
      { text: 'Principles', link: '/styleguide/principles' },
      { text: 'Colors', link: '/styleguide/colors' },
      { text: 'Logos', link: '/styleguide/logo' },
      { text: 'Typefaces', link: '/styleguide/typefaces' },
    ],
  },
  {
    text: 'Elements',
    items: [
      { text: 'Text', link: '/styleguide/text' },
      { text: 'Content Blocks', link: '/styleguide/content-blocks' },
      { text: 'Forms', link: '/styleguide/forms' },
      { text: 'Buttons', link: '/styleguide/buttons' },
      { text: 'Tables', link: '/styleguide/tables' },
      { text: 'Media', link: '/styleguide/media' },
    ],
  },
];

// if version is a stable or edge release then add in the release notes
if (!isDevRelease(semver)) {
  sidebarEnder.items.splice(1, 0, { text: 'Release Notes', link: `https://github.com/tanaabased/theme/releases/tag/v${semver}` });
}

export default defineConfig({
  appearance: { initialValue: 'dark' },
  lang: 'en-US',
  title: 'Tanaab',
  description: 'A Tanaab based theme and styleguide.',
  head: [
    ['link', { id: 'tanaab-favicon-svg', rel: 'icon', type: 'image/svg+xml', href: '/favicon-dark.svg' }],
    ['link', { id: 'tanaab-favicon-ico', rel: 'icon', type: 'image/x-icon', href: '/favicon-dark.ico' }],
    ['link', { id: 'tanaab-favicon-16', rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-dark-16x16.png' }],
    ['link', { id: 'tanaab-favicon-32', rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-dark-32x32.png' }],
    ['link', { id: 'tanaab-favicon-48', rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-dark-48x48.png' }],
    ['link', { id: 'tanaab-favicon-64', rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-dark-64x64.png' }],
    ['link', { id: 'tanaab-favicon-96', rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-dark-96x96.png' }],
    ['link', { id: 'tanaab-favicon-128', rel: 'icon', type: 'image/png', sizes: '128x128', href: '/favicon-dark-128x128.png' }],
    ['link', { id: 'tanaab-favicon-192', rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-dark-192x192.png' }],
    ['link', { id: 'tanaab-favicon-256', rel: 'icon', type: 'image/png', sizes: '256x256', href: '/favicon-dark-256x256.png' }],
    ['link', { id: 'tanaab-favicon-apple', rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-dark-180x180.png' }],
    ['link', { rel: 'mask-icon', href: '/favicon.svg', color: '#00C88A' }],
    ['meta', { name: 'theme-color', content: '#00C88A' }],
  ],
  robots: {
    host: baseUrl,
    sitemap: `${baseUrl}sitemap.xml`,
    disallowAll: false,
    allowAll: false,
    policy: [],
    policies: [{ userAgent: '*', disallow: ['/v/'], allow: '/' }],
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
    autometa: { canonicalUrl: baseUrl, image: baseUrl, twitter: '@tanaabased', x: '@tanaabased' },
    contributors: {
      merge: 'name',
      debotify: true,
      include: [
        {
          name: 'Mike Pirog',
          email: 'mike@tanaab.dev',
          title: 'Human',
          org: 'tanaab.dev',
          orgLink: 'https://www.tanaab.dev',
          links: [
            { icon: 'github', link: 'https://github.com/pirog' },
            { icon: 'x', link: 'https://x.com/pirogcommamike' },
          ],
          maintainer: true,
          mergeOnly: true,
        },
      ],
    },
    ga: { id: 'G-5FX6Z0BWFR' },
    editLink: { pattern: 'https://github.com/tanaabased/theme/edit/main/:path' },
    feed: { patterns: '*/**/*.md' },
    logo: { light: '/images/tms_mark.svg', dark: '/images/tms_mark_light.svg', alt: 'Tanaab Maneuvering Systems LLC' },
    multiVersionBuild: { base: '/v/', build: 'edge', cache: true, match: 'v[0-9].*', satisfies: '>=0.2.0' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tanaabased/theme' },
      { icon: 'x', link: 'https://x.com/tanaabased' },
    ],

    siteTitle: false,
    navbar: true,
    nav: [
      { text: 'Styleguide', link: '/styleguide/', activeMatch: '/styleguide|/overview' },
      { text: 'Components', link: '/components/', activeMatch: '/components' },
      { text: 'Containers', link: '/containers/', activeMatch: '/containers' },
      { text: 'Usage', link: '/usage/', activeMatch: '/usage|/development' },
    ],
    sidebarEnder,
    sidebar: {
      '/styleguide/': defaultSidebar,
      '/v/': defaultSidebar,
      '/': defaultSidebar,
      '/components/': [
        {
          text: 'Tanaab Based',
          items: [
            { text: 'Logo', link: '/components/tms-logo' },
            { text: 'Section', link: '/components/tms-section' },
          ],
        },
      ],
      '/containers/': [
        { text: 'Overview', link: '/containers/' },
        // {
        //   text: 'Page Shells',
        //   items: [
        //     { text: 'Site Header & Footer', link: '/containers/site-header-footer' },
        //     { text: 'Marketing Page', link: '/containers/marketing-page' },
        //     { text: 'Documentation Page', link: '/containers/documentation-page' },
        //   ],
        // },
        // {
        //   text: 'Content Regions',
        //   items: [
        //     { text: 'Hero Section', link: '/containers/hero-section' },
        //     { text: 'Feature Grid', link: '/containers/feature-grid' },
        //     { text: 'Content Well', link: '/containers/content-well' },
        //   ],
        // },
      ],
      '/usage/': [
        { text: 'Getting Started', link: '/usage/' },
        // {
        //   text: 'Adoption',
        //   items: [
        //     { text: 'Getting Started', link: '/usage/getting-started' },
        //     { text: 'Installation', link: '/usage/installation' },
        //     { text: 'Project Structure', link: '/usage/project-structure' },
        //   ],
        // },
        // {
        //   text: 'Implementation',
        //   items: [
        //     { text: 'Theming', link: '/usage/theming' },
        //     { text: 'Extending Components', link: '/usage/extending-components' },
        //     { text: 'Container Assembly', link: '/usage/container-assembly' },
        //   ],
        // },
        // {
        //   text: 'Operations',
        //   items: [
        //     { text: 'Versioning & Releases', link: '/usage/versioning-releases' },
        //     { text: 'Migration Notes', link: '/usage/migration-notes' },
        //   ],
        // },
      ],
    },
  },
});
