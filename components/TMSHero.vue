<template>
  <section
    class="tms-hero"
    :data-border-bottom="props.borderBottom"
    :data-border-top="props.borderTop"
    :aria-labelledby="titleId"
  >
    <div :id="titleId" class="tms-hero__title">
      <slot name="title" />
    </div>
    <div class="tms-hero__content">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { useId } from 'vue';

const props = defineProps({
  borderBottom: {
    type: Boolean,
    default: false,
  },
  borderTop: {
    type: Boolean,
    default: false,
  },
});

const titleId = useId();
</script>

<style scoped lang="scss">
.tms-hero {
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
  width: 100%;
  padding-block: clamp(4rem, 10vw, 8rem);
}

.tms-hero[data-border-bottom='true'] {
  border-bottom: 1px solid var(--vp-c-divider);
}

.tms-hero[data-border-top='true'] {
  border-top: 1px solid var(--vp-c-divider);
}

.tms-hero__title {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-family: var(--tanaab-font-family-body);
  font-size: clamp(2.75rem, 5vw, 3.75rem);
  font-weight: var(--tanaab-font-weight-body);
  line-height: 1.05;
  letter-spacing: var(--tanaab-letter-spacing-section);
  text-transform: none;
}

.tms-hero__content {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-family: var(--tanaab-font-family-body);
  font-size: var(--tanaab-font-size-body-xl);
  font-weight: var(--tanaab-font-weight-body);
  line-height: var(--tanaab-line-height-body);
  letter-spacing: var(--tanaab-letter-spacing-section);
}

.tms-hero__title :deep(:is(h1, h2, h3, h4, h5, h6)),
.tms-hero__content :deep(:is(h1, h2, h3, h4, h5, h6)) {
  padding: 0;
  margin: 0;
  border: 0;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  text-transform: inherit;
}

.tms-hero__content :deep(:is(p, summary)) {
  font-size: var(--tanaab-font-size-body-xl);
  letter-spacing: var(--tanaab-letter-spacing-section);
  line-height: var(--tanaab-line-height-body);
}

.tms-hero__title :deep(> :first-child),
.tms-hero__title :deep(> :first-child > :first-child),
.tms-hero__content :deep(> :first-child),
.tms-hero__content :deep(> :first-child > :first-child) {
  padding-top: 0;
  margin-top: 0;
}

.tms-hero__title :deep(> :last-child),
.tms-hero__title :deep(> :last-child > :last-child),
.tms-hero__content :deep(> :last-child),
.tms-hero__content :deep(> :last-child > :last-child) {
  margin-bottom: 0;
}
</style>
