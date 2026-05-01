<template>
  <Layout :class="headerClass">
    <template #layout-top>
      <Alert
        v-if="alert"
        :key="alertKey"
        :content="alert.content"
        :closeable="alert.closeable"
        :type="alert.type"
      />
    </template>

    <template #sidebar-nav-before>
      <div class="tanaab-sidebar-brand">
        <TMSLogo
          class="tanaab-sidebar-brand-logo"
          color="var(--tanaab-color-primary)"
          type="left"
        />
      </div>
    </template>

    <template #sidebar-nav-after>
      <div v-if="sidebarEnder !== false" class="sidebar-end">
        <VPSideBarItem :depth="0" :item="sidebarEnder" />
      </div>
    </template>

    <template #doc-before>
      <div v-if="header !== ''" class="collection-header">
        <PostHeader v-if="header === 'post'" />
        <CollectionHeader v-else />
      </div>
    </template>

    <template #aside-ads-before>
      <Tags :key="tagsKey" />
      <Jobs :key="jobsKey" />
      <Sponsors :key="sponsorsKey" />
    </template>

    <template #doc-footer-before>
      <Tags v-if="header === 'post'" :key="tagsKey" />
      <div v-if="mailchimp" class="newsletter-wrapper">
        <MailChimp v-bind="mailchimp" />
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { useData } from 'vitepress';
import { computed, ref, watch } from 'vue';

import DefaultTheme from 'vitepress/theme';
import VPSideBarItem from 'vitepress/dist/client/theme-default/components/VPSidebarItem.vue';

import Alert from '@lando/vitepress-theme-default-plus/components/VPLAlert.vue';
import CollectionHeader from '@lando/vitepress-theme-default-plus/components/VPLCollectionHeader.vue';
import MailChimp from '@lando/vitepress-theme-default-plus/components/VPLMailChimp.vue';
import PostHeader from '@lando/vitepress-theme-default-plus/components/VPLPostHeader.vue';
import Tags from '@lando/vitepress-theme-default-plus/components/VPLCollectionItemTags.vue';

const { Layout } = DefaultTheme;

let alertKey = ref(0);
let jobsKey = ref(0);
let sponsorsKey = ref(0);
let tagsKey = ref(0);
const { frontmatter, isDark, page, theme } = useData();

const alert = computed(() => frontmatter.value.alert ?? theme.value.alert ?? false);
const header = computed(() => frontmatter.value.collection || '');
const headerClass = computed(() =>
  frontmatter.value.collection ? `collection-${frontmatter.value.collection}` : '',
);
const mailchimp = computed(() =>
  frontmatter.value?.mailchimp?.action ? frontmatter.value.mailchimp : false,
);
const sidebarEnder = computed(() => theme.value.sidebarEnder ?? false);

const faviconSizes = [16, 32, 48, 64, 96, 128, 192, 256];

const setFaviconHref = (id, href) => {
  const doc = typeof globalThis === 'undefined' ? undefined : globalThis.document;
  if (!doc) return;

  const link = doc.getElementById(id);
  if (link) link.setAttribute('href', href);
};

const syncFavicons = (isDarkMode) => {
  const mode = isDarkMode ? 'dark' : 'light';

  setFaviconHref('tanaab-favicon-svg', `/favicon-${mode}.svg`);
  setFaviconHref('tanaab-favicon-ico', `/favicon-${mode}.ico`);
  setFaviconHref('tanaab-favicon-apple', `/favicon-${mode}-180x180.png`);

  for (const size of faviconSizes) {
    setFaviconHref(`tanaab-favicon-${size}`, `/favicon-${mode}-${size}x${size}.png`);
  }
};

watch(
  isDark,
  (value) => {
    syncFavicons(value);
  },
  { immediate: true },
);

watch(
  () => page.value.relativePath,
  () => {
    alertKey.value = page.value.relativePath;
    jobsKey.value = page.value.relativePath;
    sponsorsKey.value = page.value.relativePath;
    tagsKey.value = page.value.relativePath;
  },
);
</script>

<style lang="scss" scoped>
.newsletter-wrapper {
  border-top: 1px solid var(--vp-c-divider);
  padding: 16px 0;
}

.tanaab-sidebar-brand {
  display: none;
}

@media (min-width: 960px) {
  .tanaab-sidebar-brand {
    display: block;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .tanaab-sidebar-brand-logo {
    display: block;
    width: 100%;
    height: auto;
  }
  .tms-logo {
    margin-left: -12px;
  }

  :deep(.VPNavBarTitle.has-sidebar .logo) {
    display: none;
  }
}
</style>
