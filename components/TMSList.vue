<template>
  <section
    class="tms-list"
    :aria-labelledby="resolvedHeader ? headerId : undefined"
    :data-columns="resolvedColumns"
    :data-orientation="resolvedOrientation"
  >
    <div v-if="resolvedHeader" :id="headerId" class="tms-list__header">
      <a v-if="resolvedHeaderLink" :href="resolvedHeaderLink">{{ resolvedHeader }}</a>
      <span v-else>{{ resolvedHeader }}</span>
    </div>
    <ul class="tms-list__items">
      <slot v-if="hasDefaultSlot" />
      <li v-for="item in resolvedItems" v-else :key="item.key" class="tms-list__item">
        <a v-if="item.link" :href="item.link" v-bind="item.attrs">{{ item.label }}</a>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, useId, useSlots } from 'vue';

const props = defineProps({
  header: {
    type: String,
    default: '',
  },
  headerLink: {
    type: String,
    default: '',
  },
  columns: {
    type: [String, Number],
    default: 'none',
    validator: (value) => ['none', '2', '3'].includes(String(value).trim()),
  },
  items: {
    type: Array,
    default: () => [],
  },
  orientation: {
    type: String,
    default: 'column',
    validator: (value) => ['column', 'row'].includes(value),
  },
});

const allowedAttrs = new Set(['target', 'rel', 'download', 'title']);
const slots = useSlots();
const headerId = useId();

const hasDefaultSlot = computed(() => Boolean(slots.default));

const resolvedHeader = computed(() => props.header.trim());

const resolvedHeaderLink = computed(() => props.headerLink.trim());

const resolvedColumns = computed(() => {
  const columns = String(props.columns).trim();

  if (columns === '2' || columns === '3') return columns;
  return 'none';
});

const resolvedOrientation = computed(() => {
  if (props.orientation === 'row') return 'row';
  return 'column';
});

function isAllowedAttr(name) {
  if (allowedAttrs.has(name)) return true;
  return name.startsWith('aria-') || name.startsWith('data-');
}

function sanitizeAttrs(attrs = {}) {
  if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs)) return {};

  const sanitized = {};

  Object.entries(attrs).forEach(([name, value]) => {
    if (!isAllowedAttr(name) || value === undefined) return;
    sanitized[name] = value;
  });

  if (sanitized.target === '_blank' && !sanitized.rel) {
    sanitized.rel = 'noreferrer';
  }

  return sanitized;
}

const resolvedItems = computed(() =>
  props.items
    .map((item, index) => {
      const label = typeof item?.label === 'string' ? item.label.trim() : '';
      const link = typeof item?.link === 'string' ? item.link.trim() : '';

      return {
        attrs: link ? sanitizeAttrs(item?.attrs) : {},
        key: `${label}-${link}-${index}`,
        label,
        link,
      };
    })
    .filter((item) => item.label),
);
</script>

<style scoped lang="scss">
@use '../styles/vars' as vars;

.tms-list {
  --tms-list-link-hover-color: var(--tanaab-color-primary);
  --tms-list-item-padding-block-end: 0.45rem;
  --tms-list-item-padding-block-start: 1.05rem;
  --tms-list-padding-long: clamp(1.75rem, 3.2vw, 2.75rem);
  --tms-list-padding-short: clamp(1.25rem, 2.2vw, 2rem);

  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  box-sizing: border-box;
  width: 100%;
  padding: var(--tms-list-padding-short);
  padding-bottom: calc(var(--tms-list-padding-short) + 1em);
  background-color: var(--vp-sidebar-bg-color);
  color: var(--vp-c-text-1);
}

.tms-list__header {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-family: var(--tanaab-font-family-heading);
  font-size: var(--tanaab-font-size-h3);
  font-weight: var(--tanaab-font-weight-heading);
  line-height: var(--tanaab-line-height-h3);
  letter-spacing: var(--tanaab-letter-spacing-section);
  text-transform: none;
}

.tms-list__header a {
  color: inherit;
  text-decoration: none;
}

.tms-list__header a:hover,
.tms-list__header a:focus-visible {
  color: var(--tms-list-link-hover-color);
}

.tms-list__header a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 0.2em;
}

.tms-list__items {
  display: grid;
  gap: 0;
  min-width: 0;
  padding: 0;
  margin: 0;
  list-style: none;
}

.tms-list__item,
.tms-list__items :deep(> li) {
  min-width: 0;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-family: var(--tanaab-font-family-heading);
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  font-weight: var(--tanaab-font-weight-heading);
  line-height: 1.25;
  letter-spacing: var(--tanaab-letter-spacing-section);
}

.tms-list__item > a,
.tms-list__item > span,
.tms-list__items :deep(> li > a),
.tms-list__items :deep(> li > span) {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding-block: var(--tms-list-item-padding-block-start) var(--tms-list-item-padding-block-end);
  color: inherit;
  text-decoration: none;
}

.tms-list__item > a:hover,
.tms-list__item > a:focus-visible,
.tms-list__items :deep(> li > a:hover),
.tms-list__items :deep(> li > a:focus-visible) {
  color: var(--tms-list-link-hover-color);
}

.tms-list__item > a:focus-visible,
.tms-list__items :deep(> li > a:focus-visible) {
  outline: 2px solid currentColor;
  outline-offset: 0.2em;
}

.tms-list[data-orientation='row'] {
  grid-template-columns: minmax(9rem, 0.25fr) minmax(0, 1fr);
  align-items: start;
}

.tms-list[data-orientation='row'] .tms-list__items {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1rem, 4vw, 3rem);
  justify-content: flex-end;
}

.tms-list[data-orientation='row'] .tms-list__item,
.tms-list[data-orientation='row'] .tms-list__items :deep(> li) {
  width: auto;
  border-bottom: 0;
}

.tms-list[data-orientation='row'] .tms-list__item > a,
.tms-list[data-orientation='row'] .tms-list__item > span,
.tms-list[data-orientation='row'] .tms-list__items :deep(> li > a),
.tms-list[data-orientation='row'] .tms-list__items :deep(> li > span) {
  padding-block: 0;
}

.tms-list[data-columns='2'] .tms-list__items,
.tms-list[data-columns='3'] .tms-list__items {
  display: block;
  column-gap: clamp(2rem, 6vw, 5rem);
}

.tms-list[data-columns='2'] .tms-list__items {
  column-count: 2;
}

.tms-list[data-columns='3'] .tms-list__items {
  column-count: 3;
}

.tms-list[data-orientation='row'][data-columns='2'] .tms-list__items,
.tms-list[data-orientation='row'][data-columns='3'] .tms-list__items {
  margin-block-start: calc(-1 * var(--tms-list-item-padding-block-start));
}

.tms-list[data-columns='2'] .tms-list__item,
.tms-list[data-columns='2'] .tms-list__items :deep(> li),
.tms-list[data-columns='3'] .tms-list__item,
.tms-list[data-columns='3'] .tms-list__items :deep(> li) {
  width: 100%;
  border-bottom: 1px solid var(--vp-c-divider);
  break-inside: avoid;
}

.tms-list[data-columns='2'] .tms-list__item > a,
.tms-list[data-columns='2'] .tms-list__item > span,
.tms-list[data-columns='2'] .tms-list__items :deep(> li > a),
.tms-list[data-columns='2'] .tms-list__items :deep(> li > span),
.tms-list[data-columns='3'] .tms-list__item > a,
.tms-list[data-columns='3'] .tms-list__item > span,
.tms-list[data-columns='3'] .tms-list__items :deep(> li > a),
.tms-list[data-columns='3'] .tms-list__items :deep(> li > span) {
  padding-block: var(--tms-list-item-padding-block-start) var(--tms-list-item-padding-block-end);
}

@media (max-width: vars.$breakpoint-sm) {
  .tms-list[data-columns='2'] .tms-list__items,
  .tms-list[data-columns='3'] .tms-list__items {
    display: grid;
    column-count: auto;
    column-gap: 0;
    margin-block-start: 0;
  }

  .tms-list[data-orientation='row'] {
    grid-template-columns: 1fr;
  }

  .tms-list[data-orientation='row'] .tms-list__items {
    display: grid;
    gap: 0;
    justify-content: stretch;
  }

  .tms-list[data-orientation='row'] .tms-list__item,
  .tms-list[data-orientation='row'] .tms-list__items :deep(> li) {
    width: 100%;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .tms-list[data-orientation='row'] .tms-list__item > a,
  .tms-list[data-orientation='row'] .tms-list__item > span,
  .tms-list[data-orientation='row'] .tms-list__items :deep(> li > a),
  .tms-list[data-orientation='row'] .tms-list__items :deep(> li > span) {
    padding-block: var(--tms-list-item-padding-block-start) var(--tms-list-item-padding-block-end);
  }
}
</style>
