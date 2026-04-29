<template>
  <component
    :is="resolvedLink ? 'a' : 'div'"
    class="tms-box"
    :data-linked="Boolean(resolvedLink)"
    :data-type="resolvedType"
    :href="resolvedLink || undefined"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  link: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'content',
  },
});

const resolvedLink = computed(() => {
  if (!props.link || props.link.trim().length === 0) return '';
  return props.link.trim();
});

const resolvedType = computed(() => {
  if (props.type === 'title') return 'title';
  return 'content';
});
</script>

<style scoped lang="scss">
.tms-box {
  display: flex;
  width: 100%;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--tms-box-padding, 1.5rem);
  background-color: var(--vp-sidebar-bg-color);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.tms-box[data-type='content'] {
  padding: clamp(3rem, 17%, 6rem);
  font-family: var(--tanaab-font-family-body);
  font-size: var(--tanaab-font-size-body-xl);
  font-weight: var(--tanaab-font-weight-body);
  letter-spacing: var(--tanaab-letter-spacing-section);
  line-height: var(--tanaab-line-height-h4);
  text-align: center;
  text-transform: none;
}

.tms-box[data-type='content'] :deep(:is(p, summary)) {
  font-size: var(--tanaab-font-size-body-xl);
  letter-spacing: var(--tanaab-letter-spacing-section);
  line-height: var(--tanaab-line-height-h4);
}

.tms-box :deep(:is(h1, h2, h3, h4, h5, h6)) {
  padding: 0;
  margin: 0;
  border: 0;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  text-transform: inherit;
}

.tms-box[data-type='content'] :deep(> :first-child),
.tms-box[data-type='content'] :deep(> :first-child > :first-child) {
  padding-top: 0;
  margin-top: 0;
}

.tms-box[data-type='content'] :deep(> :last-child),
.tms-box[data-type='content'] :deep(> :last-child > :last-child) {
  margin-bottom: 0;
}

.tms-box[data-type='title'] {
  font-family: var(--tanaab-font-family-heading);
  font-size: var(--tms-grid-item-font-size, clamp(1.25rem, 3vw, 2.1rem));
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: var(--tms-grid-item-line-height, 1.1);
  text-align: center;
  text-transform: uppercase;
}

.tms-box[data-linked='true']:hover,
.tms-box[data-linked='true']:focus-visible {
  background-color: var(--tanaab-color-primary);
  color: #fff;
}

.tms-box[data-linked='true']:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -2px;
}
</style>
