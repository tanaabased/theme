<template>
  <div class="tms-component-playground" :data-preview-fit="resolvedPreviewFit">
    <div class="tms-component-playground__preview" aria-label="Component preview">
      <div class="tms-component-playground__preview-inner">
        <component :is="props.component" v-if="hasPreviewSlots" v-bind="previewProps">
          <template v-for="slot in namedPreviewSlots" #[slot.name]>
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="slot.rendersHtml"
              :key="`${slot.name}-html`"
              class="tms-component-playground__slot-html"
              v-html="slot.value"
            ></div>
            <!-- eslint-enable vue/no-v-html -->
            <template v-else>{{ slot.value }}</template>
          </template>

          <template v-if="defaultRepeatSlot">
            <component
              :is="defaultRepeatSlot.component"
              v-for="item in defaultRepeatSlot.items"
              :key="item.key"
              v-bind="defaultRepeatSlot.props"
            >
              {{ item.label }}
            </component>
          </template>

          <!-- eslint-disable vue/no-v-html -->
          <div
            v-else-if="hasDefaultSlot && rendersDefaultSlotHtml"
            class="tms-component-playground__slot-html"
            v-html="defaultSlotText"
          ></div>
          <!-- eslint-enable vue/no-v-html -->
          <template v-else-if="hasDefaultSlot">{{ defaultSlotText }}</template>
        </component>
        <component :is="props.component" v-else v-bind="previewProps" />
      </div>
    </div>

    <div class="tms-component-playground__code-area">
      <div class="tms-component-playground__code language-html vp-adaptive-theme">
        <button
          class="tms-component-playground__copy"
          :class="{ 'tms-component-playground__copy--copied': copied }"
          type="button"
          :aria-label="copyLabel"
          :title="copyLabel"
          @click.capture="copyCode"
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
  applyControlDerivedProps,
  createPlaygroundState,
  decodeRegionValue,
  generateComponentUsage,
  getPreviewProps,
  getRepeatSlotItems,
  setNestedValue,
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
  previewFit: {
    type: String,
    default: 'full',
  },
});

const emit = defineEmits(['copy', 'update:state']);

const { page, theme } = useData();
const copied = ref(false);
const state = reactive(createPlaygroundState(props.schema, props.initialState));

const generated = computed(() => generateComponentUsage(props.schema, state));
const previewProps = computed(() => getPreviewProps(props.schema, state));
const resolvedPreviewFit = computed(() => {
  return props.previewFit === 'contained' ? 'contained' : 'full';
});
const slotDefinitions = computed(() => Object.entries(props.schema?.slots ?? {}));
const defaultSlotDefinition = computed(() => props.schema?.slots?.default ?? null);
const defaultRepeatSlotDefinition = computed(() => {
  return defaultSlotDefinition.value?.kind === 'repeat' ? defaultSlotDefinition.value : null;
});
const defaultSlotText = computed(() => state.slots.default ?? '');
const hasDefaultSlot = computed(() => Boolean(defaultSlotDefinition.value));
const rendersDefaultSlotHtml = computed(() => defaultSlotDefinition.value?.kind === 'html');
const defaultRepeatSlot = computed(() => {
  const definition = defaultRepeatSlotDefinition.value;
  if (!definition) return null;

  return {
    component: definition.component,
    props: definition.props ?? {},
    items: getRepeatSlotItems(definition, state),
  };
});
const namedPreviewSlots = computed(() => {
  return slotDefinitions.value
    .filter(([slotName, definition]) => slotName !== 'default' && definition.kind !== 'repeat')
    .map(([name, definition]) => ({
      name,
      rendersHtml: definition.kind === 'html',
      value: state.slots[name] ?? '',
    }));
});
const hasPreviewSlots = computed(() => {
  return (
    namedPreviewSlots.value.length > 0 || Boolean(defaultRepeatSlot.value) || hasDefaultSlot.value
  );
});
const copyLabel = computed(() => (copied.value ? 'Copied code' : 'Copy code'));

function replaceReactiveObject(target, source) {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  Object.assign(target, source);
}

function replacePlaygroundState(nextState) {
  replaceReactiveObject(state.controls, nextState.controls);
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
      controls: { ...state.controls },
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

  if (region.kind === 'array-prop-field') {
    updateArrayPropField(region, decodedValue);
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

function updateArrayPropField(region, value) {
  if (!Array.isArray(state.props[region.prop])) {
    state.props[region.prop] = [];
  }

  if (
    !state.props[region.prop][region.index] ||
    typeof state.props[region.prop][region.index] !== 'object'
  ) {
    state.props[region.prop][region.index] = {};
  }

  setNestedValue(state.props[region.prop][region.index], region.path, value);
}

function toggleBoolean(prop) {
  state.props[prop] = !state.props[prop];
}

function selectEnum({ control, prop, region, value }) {
  if (region?.kind === 'array-prop-field') {
    updateArrayPropField(region, value);
    return;
  }

  if (control) {
    state.controls[control] = value;
    applyControlDerivedProps(props.schema, state, control);
    return;
  }

  state.props[prop] = value;
}

async function copyCode(event) {
  event?.preventDefault();
  event?.stopImmediatePropagation?.();
  event?.stopPropagation?.();

  await navigator.clipboard.writeText(generated.value.copyCode);
  copied.value = true;
  emit('copy', generated.value.copyCode);

  window.setTimeout(() => {
    copied.value = false;
  }, 1400);
}
</script>

<style scoped lang="scss">
.tms-component-playground {
  --tms-component-playground-preview-max-block-size: clamp(16rem, 45vh, 24rem);
  --tms-hero-gap: clamp(1.25rem, 3vw, 2rem);
  --tms-hero-padding-block: clamp(2rem, 5vw, 3.5rem);
  --tms-section-gap: clamp(1.25rem, 3vw, 2.5rem);
  --tms-section-padding-block: clamp(1.5rem, 3vw, 2.5rem);

  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  min-width: 0;
  margin-top: 1rem;
}

.tms-component-playground__preview {
  display: grid;
  min-width: 0;
  place-items: center;
  padding: 0 0 clamp(1rem, 3vw, 2rem);
  overflow: visible;
}

.tms-component-playground[data-preview-fit='contained'] .tms-component-playground__preview {
  min-height: 12rem;
  max-block-size: var(--tms-component-playground-preview-max-block-size);
  overflow: hidden;
}

.tms-component-playground__preview-inner {
  display: grid;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  place-items: center;
}

.tms-component-playground[data-preview-fit='contained'] .tms-component-playground__preview-inner {
  width: min(
    100%,
    clamp(12rem, 42vw, 20rem),
    var(--tms-component-playground-preview-max-block-size)
  );
  max-block-size: 100%;
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
  border: 2px solid transparent;
  overflow: visible;
  transition: border-color 0.2s ease;
}

.tms-component-playground .tms-component-playground__code:focus-within {
  border-color: var(--tanaab-form-control-focus-border);
}

.tms-component-playground__copy {
  direction: ltr;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 40px;
  height: 40px;
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: var(--tanaab-radius-base);
  background-color: var(--vp-code-copy-code-bg);
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 20px;
  cursor: pointer;
  opacity: 0;
  transition:
    border-color 0.25s,
    background-color 0.25s,
    opacity 0.25s;
}

.tms-component-playground__code:hover > .tms-component-playground__copy,
.tms-component-playground__copy:focus {
  opacity: 1;
}

.tms-component-playground__copy:hover,
.tms-component-playground__copy--copied {
  border-color: var(--vp-code-copy-code-hover-border-color);
  background-color: var(--vp-code-copy-code-hover-bg);
}

.tms-component-playground__copy--copied,
.tms-component-playground__copy:hover.tms-component-playground__copy--copied {
  border-radius: 0 var(--tanaab-radius-base) var(--tanaab-radius-base) 0;
  background-color: var(--vp-code-copy-code-hover-bg);
  background-image: var(--vp-icon-copied);
}

.tms-component-playground__copy--copied::before,
.tms-component-playground__copy:hover.tms-component-playground__copy--copied::before {
  position: relative;
  top: -1px;
  display: flex;
  width: fit-content;
  height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid var(--vp-code-copy-code-hover-border-color);
  border-right: 0;
  border-radius: var(--tanaab-radius-base) 0 0 var(--tanaab-radius-base);
  background-color: var(--vp-code-copy-code-hover-bg);
  color: var(--vp-code-copy-code-active-text);
  content: var(--vp-code-copy-copied-text-content);
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  transform: translateX(calc(-100% - 1px));
  white-space: nowrap;
}

.tms-component-playground__code:hover > .tms-component-playground__copy + .lang,
.tms-component-playground__copy:focus + .lang {
  opacity: 0;
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
