<template>
  <div class="tms-component-doc-demo">
    <div class="tms-component-doc-demo__group">
      <h3 class="tms-component-doc-demo__title tms-visually-hidden">Preview</h3>
      <div class="tms-component-doc-demo__preview">
        <slot name="preview" />
      </div>
    </div>

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

    <div v-if="props.code" class="tms-component-doc-demo__group">
      <h3 class="tms-component-doc-demo__title tms-visually-hidden">Code</h3>
      <div class="tms-component-doc-demo__code-block" v-html="renderedCodeBlock"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useData } from 'vitepress';

const shikiThemes = {
  light: 'github-light',
  dark: 'github-dark',
};

let highlighterPromise;

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
const renderedCodeBlock = ref('');
let renderSequence = 0;

function getHighlighter() {
  highlighterPromise ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/html.mjs'),
    import('shiki/themes/github-light.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ]).then(
    ([
      { createHighlighterCore },
      { createJavaScriptRegexEngine },
      html,
      githubLight,
      githubDark,
    ]) => {
      return createHighlighterCore({
        themes: [githubLight.default, githubDark.default],
        langs: [html.default],
        engine: createJavaScriptRegexEngine(),
      });
    },
  );

  return highlighterPromise;
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
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

function renderSourceLink(sourceHref) {
  if (!sourceHref) {
    return '';
  }

  return `<a class="tms-component-doc-demo__source" href="${escapeAttribute(sourceHref)}" target="_blank" rel="noreferrer" aria-label="View component source">source</a>`;
}

function renderPlainCodeBlock(code, sourceHref) {
  return `<div class="language-html vp-adaptive-theme"><button type="button" title="Copy Code" aria-label="Copy code" class="copy"></button><span class="lang">html</span><pre class="vp-code"><code>${escapeHtml(code)}</code></pre>${renderSourceLink(sourceHref)}</div>`;
}

async function renderHighlightedCodeBlock(code, sourceHref) {
  const highlighter = await getHighlighter();

  const highlighted = highlighter.codeToHtml(code, {
    lang: 'html',
    themes: shikiThemes,
    defaultColor: false,
  });

  const pre = highlighted.replace(
    '<pre class="shiki shiki-themes github-light github-dark"',
    '<pre class="shiki shiki-themes github-light github-dark vp-code"',
  );

  return `<div class="language-html vp-adaptive-theme"><button type="button" title="Copy Code" aria-label="Copy code" class="copy"></button><span class="lang">html</span>${pre}${renderSourceLink(sourceHref)}</div>`;
}

watch(
  [() => props.code, resolvedSourceHref],
  async ([code, sourceHref]) => {
    const sequence = ++renderSequence;

    if (!code) {
      renderedCodeBlock.value = '';
      return;
    }

    renderedCodeBlock.value = renderPlainCodeBlock(code, sourceHref);
    const highlighted = await renderHighlightedCodeBlock(code, sourceHref);

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

.tms-component-doc-demo__group + .tms-component-doc-demo__group {
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
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

.tms-component-doc-demo__code-block {
  min-width: 0;
  max-width: 100%;
}

.tms-component-doc-demo__code-block :deep(.language-html) {
  position: relative;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 75px;
  margin-inline: 0;
  overflow-x: hidden;
}

.tms-component-doc-demo__code-block :deep(.vp-code) {
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  white-space: pre;
}

.tms-component-doc-demo__code-block :deep(.vp-code code),
.tms-component-doc-demo__code-block :deep(.vp-code .line) {
  white-space: inherit;
}

.tms-component-doc-demo__code-block :deep(.tms-component-doc-demo__source) {
  position: absolute;
  display: block;
  width: max-content;
  bottom: 2px;
  right: 8px;
  z-index: 2;
  color: var(--vp-code-lang-color);
  font-size: 12px;
  font-weight: 500;
  line-height: var(--tanaab-line-height-body);
  text-decoration: none;
  transition:
    color 0.25s,
    opacity 0.25s;
  user-select: none;
}

.tms-component-doc-demo__code-block :deep(.tms-component-doc-demo__source:hover),
.tms-component-doc-demo__code-block :deep(.tms-component-doc-demo__source:focus-visible) {
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
