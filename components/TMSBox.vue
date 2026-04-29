<template>
  <component
    :is="resolvedLink ? 'a' : 'div'"
    class="tms-box"
    :data-linked="Boolean(resolvedLink)"
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
});

const resolvedLink = computed(() => {
  if (!props.link || props.link.trim().length === 0) return '';
  return props.link.trim();
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
  padding: 1.5rem;
  background-color: var(--vp-sidebar-bg-color);
  color: var(--vp-c-text-1);
  font-family: var(--tanaab-font-family-heading);
  font-size: var(--tms-grid-item-font-size, clamp(1.25rem, 3vw, 2.1rem));
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: var(--tms-grid-item-line-height, 1.1);
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition:
    background-color 180ms ease,
    color 180ms ease;
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
