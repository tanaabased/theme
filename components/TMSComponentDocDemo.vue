<template>
  <div class="tms-component-doc-demo">
    <div class="tms-component-doc-demo__group">
      <h3 class="tms-component-doc-demo__title">Controls</h3>
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
      <div v-html="renderedCodeBlock"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
});

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
  gap: 1rem;
  margin-top: 1rem;
}

.tms-component-doc-demo__group {
  display: grid;
  gap: 0.75rem;
}

.tms-component-doc-demo__title {
  margin: 0;
}

.tms-component-doc-demo__description {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
}

.tms-component-doc-demo__controls {
  display: grid;
  gap: 0.75rem;
}

.tms-component-doc-demo__preview {
  display: flex;
  align-items: center;
  min-height: 180px;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.tms-component-doc-demo__controls :deep(label) {
  display: grid;
  gap: 0.35rem;
  font-size: 0.875rem;
}

.tms-component-doc-demo__controls :deep(span) {
  font-weight: 600;
}

.tms-component-doc-demo__controls :deep(input),
.tms-component-doc-demo__controls :deep(select) {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 0.5rem 0.625rem;
  font: inherit;
}
</style>
