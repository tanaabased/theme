<template>
  <div class="tms-component-playground">
    <div class="tms-component-playground__preview" aria-label="Component preview">
      <div class="tms-component-playground__preview-inner">
        <component :is="props.component" v-bind="previewProps">
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="rendersDefaultSlotHtml"
            class="tms-component-playground__slot-html"
            v-html="defaultSlotText"
          ></div>
          <!-- eslint-enable vue/no-v-html -->
          <template v-else>{{ defaultSlotText }}</template>
        </component>
      </div>
    </div>

    <div class="tms-component-playground__code-area">
      <div class="tms-component-playground__code language-html vp-adaptive-theme">
        <button
          class="copy"
          :class="{ copied }"
          type="button"
          :aria-label="copyLabel"
          :title="copyLabel"
          @click="copyCode"
        ></button>
        <span class="lang">html</span>

        <TMSInteractiveCode
          :code="generated.code"
          :regions="generated.regions"
          @select-enum="selectEnum"
          @toggle-boolean="toggleBoolean"
          @update-region="updateRegion"
        />
      </div>

      <div class="tms-component-playground__links">
        <a
          v-if="resolvedSourceHref"
          class="tms-component-playground__action tms-component-playground__source"
          :href="resolvedSourceHref"
          target="_blank"
          rel="noreferrer"
          aria-label="View component source"
        >
          source
        </a>
        <span
          v-if="resolvedSourceHref"
          class="tms-component-playground__separator"
          aria-hidden="true"
        >
          |
        </span>
        <button
          class="tms-component-playground__action tms-component-playground__reset"
          type="button"
          @click="resetPlayground"
        >
          reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useData } from 'vitepress';

import TMSInteractiveCode from './TMSInteractiveCode.vue';
import {
  createPlaygroundState,
  decodeRegionValue,
  generateComponentUsage,
  getPreviewProps,
} from './playground/codegen.js';

const props = defineProps({
  component: {
    type: [Object, String, Function],
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
  source: {
    type: [Boolean, String],
    default: true,
  },
  initialState: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['copy', 'update:state']);

const { page, theme } = useData();
const copied = ref(false);
const state = reactive(createPlaygroundState(props.schema, props.initialState));

const generated = computed(() => generateComponentUsage(props.schema, state));
const previewProps = computed(() => getPreviewProps(props.schema, state));
const defaultSlotDefinition = computed(() => props.schema?.slots?.default ?? null);
const defaultSlotText = computed(() => state.slots.default ?? '');
const rendersDefaultSlotHtml = computed(() => defaultSlotDefinition.value?.kind === 'html');
const copyLabel = computed(() => (copied.value ? 'Copied code' : 'Copy code'));

function replaceReactiveObject(target, source) {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  Object.assign(target, source);
}

function replacePlaygroundState(nextState) {
  replaceReactiveObject(state.props, nextState.props);
  replaceReactiveObject(state.slots, nextState.slots);
}

function resetPlayground() {
  replacePlaygroundState(createPlaygroundState(props.schema, props.initialState));
}

watch(
  () => [props.schema, props.initialState],
  () => {
    resetPlayground();
  },
  { deep: true },
);

watch(
  state,
  () => {
    emit('update:state', {
      props: { ...state.props },
      slots: { ...state.slots },
    });
  },
  { deep: true },
);

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

function updateRegion({ region, value }) {
  const decodedValue = decodeRegionValue(region, value);

  if (region.kind === 'slot-text') {
    state.slots[region.slot] = decodedValue;
    return;
  }

  if (region.kind !== 'prop-value') return;

  if (region.valueKind === 'number') {
    const numberValue = Number(decodedValue);
    state.props[region.prop] = Number.isFinite(numberValue) ? numberValue : 0;
    return;
  }

  state.props[region.prop] = decodedValue;
}

function toggleBoolean(prop) {
  state.props[prop] = !state.props[prop];
}

function selectEnum({ prop, value }) {
  state.props[prop] = value;
}

async function copyCode() {
  await navigator.clipboard.writeText(generated.value.code);
  copied.value = true;
  emit('copy', generated.value.code);

  window.setTimeout(() => {
    copied.value = false;
  }, 1400);
}
</script>

<style scoped lang="scss">
.tms-component-playground {
  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  min-width: 0;
  margin-top: 1rem;
}

.tms-component-playground__preview {
  display: grid;
  min-width: 0;
  min-height: 12rem;
  max-block-size: clamp(16rem, 45vh, 24rem);
  place-items: center;
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
}

.tms-component-playground__preview-inner {
  width: min(100%, clamp(12rem, 42vw, 20rem));
  max-width: 100%;
  min-width: 0;
}

.tms-component-playground__slot-html {
  display: block;
  width: 100%;
  min-width: 0;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  text-align: inherit;
  text-transform: inherit;
}

.tms-component-playground__code-area {
  display: grid;
  gap: 0.125rem;
  min-width: 0;
}

.tms-component-playground .tms-component-playground__code {
  position: relative;
  min-width: 0;
  margin: 0;
  overflow: visible;
}

.tms-component-playground__links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  min-width: 0;
}

.tms-component-playground__action,
.tms-component-playground__separator {
  color: var(--vp-code-lang-color);
  font-size: 12px;
  font-weight: 500;
  line-height: var(--tanaab-line-height-body);
}

.tms-component-playground__action {
  display: block;
  width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  user-select: none;
  transition:
    color 0.25s,
    opacity 0.25s;
}

.tms-component-playground__action:hover,
.tms-component-playground__action:focus-visible {
  color: var(--vp-c-brand-1);
}

.tms-component-playground__separator {
  user-select: none;
}

.tms-component-playground__code :deep(.tms-interactive-code) {
  min-width: 0;
}

.tms-component-playground__code :deep(.cm-editor) {
  background-color: transparent;
}

.tms-component-playground__code :deep(.cm-content) {
  padding: 20px 24px !important;
}

.tms-component-playground__code :deep(.cm-line) {
  line-height: var(--vp-code-line-height);
}

.tms-component-playground__code :deep(.cm-scroller) {
  overflow-x: auto;
}
</style>
