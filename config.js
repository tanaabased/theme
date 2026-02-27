import { defineConfig as defineBaseConfig } from '@lando/vitepress-theme-default-plus/config';

const defaults = {
  appearance: false,
  lang: 'en-US',
  head: [['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }]],
  feed: {
    patterns: ['*.md', '*/**/*.md'],
  },
  themeConfig: {
    collections: false,
    contributors: false,
    editLink: false,
    lastUpdated: false,
    navbar: false,
    sidebar: {},
    siteTitle: false,
  },
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(base, overrides) {
  if (!isPlainObject(base) || !isPlainObject(overrides)) return overrides ?? base;

  const merged = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (isPlainObject(value) && isPlainObject(base[key])) merged[key] = mergeDeep(base[key], value);
    else merged[key] = value;
  }

  return merged;
}

export function defineConfig(config = {}) {
  const merged = mergeDeep(defaults, config);
  if (Array.isArray(config.head)) merged.head = [...defaults.head, ...config.head];
  return defineBaseConfig(merged);
}

export default defineConfig;
