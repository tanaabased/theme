<template>
  <div class="tms-component-doc-demo">
    <div class="tms-component-doc-demo__group">
      <h3 class="tms-component-doc-demo__title tms-visually-hidden">Controls</h3>
      <p class="tms-component-doc-demo__description">
        <slot name="controls-description">
          Adjust the controls to update both the live preview and the code sample.
        </slot>
      </p>
      <div class="tms-component-doc-demo__controls">
        <slot name="controls" />
      </div>
    </div>

    <div class="tms-component-doc-demo__group">
      <h3 class="tms-component-doc-demo__title">Preview</h3>
      <div class="tms-component-doc-demo__preview">
        <slot name="preview" />
      </div>
    </div>

    <div v-if="props.code" class="tms-component-doc-demo__group">
      <h3 class="tms-component-doc-demo__title">Code</h3>
      <div class="tms-component-doc-demo__code" v-html="renderedCodeBlock"></div>
      <small v-if="resolvedSourceHref" class="tms-component-doc-demo__source">
        <a :href="resolvedSourceHref" target="_blank" rel="noreferrer">source file</a>
      </small>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useData } from 'vitepress';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  source: {
    type: [Boolean, String],
    default: true,
  },
});

const { page, theme } = useData();

const shikiThemes = {
  light: 'github-light',
  dark: 'github-dark',
};

let highlighterPromise;
let renderSequence = 0;

function getHighlighter() {
  highlighterPromise ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/vue.mjs'),
    import('shiki/themes/github-light.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ]).then(
    ([
      { createHighlighterCore },
      { createJavaScriptRegexEngine },
      vue,
      githubLight,
      githubDark,
    ]) => {
      return createHighlighterCore({
        themes: [githubLight.default, githubDark.default],
        langs: [vue.default],
        engine: createJavaScriptRegexEngine(),
      });
    },
  );

  return highlighterPromise;
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderPlainCodeBlock(code) {
  return `<div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="vp-code"><code>${escapeHtml(code)}</code></pre></div>`;
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//.test(value);
}

function normalizeRepository(value) {
  return typeof value === 'string' ? value.replace(/\/$/, '') : '';
}

function toPascalComponentName(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => {
      const normalized = part.toLowerCase();

      if (normalized === 'tms') {
        return 'TMS';
      }

      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join('');
}

function inferSourcePath(relativePath) {
  if (!relativePath?.startsWith('components/') || !relativePath.endsWith('.md')) {
    return '';
  }

  const fileName = relativePath.split('/').pop()?.replace(/\.md$/, '') ?? '';
  const componentName = toPascalComponentName(fileName);

  return componentName ? `components/${componentName}.vue` : '';
}

function resolveSourcePath() {
  if (props.source === false || props.source === '') {
    return '';
  }

  if (typeof props.source === 'string') {
    return props.source;
  }

  return inferSourcePath(page.value.relativePath);
}

async function renderCodeBlock(code) {
  const highlighter = await getHighlighter();

  const highlighted = highlighter.codeToHtml(code, {
    lang: 'vue',
    themes: shikiThemes,
    defaultColor: false,
  });

  const pre = highlighted.replace(
    '<pre class="shiki shiki-themes github-light github-dark"',
    '<pre class="shiki shiki-themes github-light github-dark vp-code"',
  );

  return `<div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span>${pre}</div>`;
}

const renderedCodeBlock = ref(props.code ? renderPlainCodeBlock(props.code) : '');

const resolvedSourceHref = computed(() => {
  const sourcePath = resolveSourcePath();

  if (!sourcePath) {
    return '';
  }

  if (isAbsoluteUrl(sourcePath)) {
    return sourcePath;
  }

  const repository = normalizeRepository(theme.value.repository);

  if (!repository) {
    return '';
  }

  return `${repository}/blob/main/${sourcePath.replace(/^\/+/, '')}`;
});

watch(
  () => props.code,
  async (value) => {
    const sequence = ++renderSequence;

    if (!value) {
      renderedCodeBlock.value = '';
      return;
    }

    renderedCodeBlock.value = renderPlainCodeBlock(value);
    const highlighted = await renderCodeBlock(value);

    if (sequence === renderSequence) {
      renderedCodeBlock.value = highlighted;
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.tms-component-doc-demo {
  display: grid;
  gap: 2rem;
  min-width: 0;
  margin-top: 1rem;
}

.tms-component-doc-demo__group {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.tms-component-doc-demo__title {
  margin: 0;
}

.tms-component-doc-demo__description {
  margin: 0;
}

.tms-component-doc-demo__controls {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.tms-component-doc-demo__preview {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 180px;
}

.tms-component-doc-demo__code {
  min-width: 0;
  max-width: 100%;
}

.tms-component-doc-demo__code :deep(.language-vue),
.tms-component-doc-demo__code :deep(.vp-code),
.tms-component-doc-demo__code :deep(code) {
  min-width: 0;
  max-width: 100%;
}

.tms-component-doc-demo__code :deep(.vp-code),
.tms-component-doc-demo__code :deep(code),
.tms-component-doc-demo__code :deep(.line) {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  word-break: break-word;
}

.tms-component-doc-demo__source {
  display: block;
  margin-top: -0.75rem;
  color: var(--vp-c-text-2);
  font-size: var(--tanaab-font-size-body-sm);
  line-height: var(--tanaab-line-height-body);
}

.tms-component-doc-demo__source a {
  color: inherit;
}

.tms-component-doc-demo__source a:hover {
  color: var(--vp-c-brand-1);
}

.tms-component-doc-demo__controls :deep(label) {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
}

.tms-component-doc-demo__controls :deep(label:has(input[type='checkbox'])) {
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.75rem;
}
</style>
