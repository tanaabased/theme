<template>
  <section
    class="tms-section"
    :data-border-bottom="props.borderBottom"
    :data-border-top="props.borderTop"
    :data-orientation="props.orientation"
    :aria-labelledby="titleId"
  >
    <div :id="titleId" class="tms-section__title">
      <slot name="title" />
    </div>
    <div class="tms-section__content">
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
  orientation: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },
});

const titleId = useId();
</script>

<style scoped lang="scss">
@use '../styles/vars' as vars;

.tms-section {
  display: grid;
  grid-template-areas: 'title content';
  grid-template-columns: minmax(10rem, 0.28fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
  width: 100%;
  padding-block: clamp(2.5rem, 6vw, 4rem);
}

.tms-section[data-border-bottom='true'] {
  border-bottom: 1px solid var(--vp-c-divider);
}

.tms-section[data-border-top='true'] {
  border-top: 1px solid var(--vp-c-divider);
}

.tms-section[data-orientation='right'] {
  grid-template-areas: 'content title';
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.28fr);
}

.tms-section__title {
  grid-area: title;
  min-width: 0;
  color: var(--vp-c-text-1);
  font-family: var(--tanaab-font-family-heading);
  font-size: var(--tanaab-font-size-h4);
  font-weight: var(--tanaab-font-weight-heading);
  line-height: var(--tanaab-line-height-h4);
  letter-spacing: var(--tanaab-letter-spacing-section);
}

.tms-section__title :deep(:is(h1, h2, h3, h4, h5)) {
  font-size: var(--tanaab-font-size-h4);
  line-height: var(--tanaab-line-height-h4);
  letter-spacing: var(--tanaab-letter-spacing-section);
  margin: 0;
  border: 0;
  padding: 0;
  text-transform: none;
}

.tms-section__content {
  grid-area: content;
  min-width: 0;
  color: var(--vp-c-text-1);
  font-size: var(--tanaab-font-size-body-xl);
  letter-spacing: var(--tanaab-letter-spacing-section);
  line-height: var(--tanaab-line-height-body);
}

.tms-section__content :deep(:is(p, summary)) {
  font-size: var(--tanaab-font-size-body-xl);
  letter-spacing: var(--tanaab-letter-spacing-section);
  line-height: var(--tanaab-line-height-body);
}

.tms-section__content :deep(> :is(h1, h2, h3, h4, h5, h6, p, summary):first-child),
.tms-section__content :deep(> :first-child > :is(h1, h2, h3, h4, h5, h6, p, summary):first-child) {
  padding-top: 0;
  margin-top: 0;
}

.tms-section[data-orientation='right'] .tms-section__title {
  text-align: right;
}

@media (max-width: vars.$breakpoint-lg-max) {
  .tms-section,
  .tms-section[data-orientation='right'] {
    grid-template-areas:
      'title'
      'content';
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding-block: 2rem;
  }

  .tms-section[data-orientation='right'] .tms-section__title {
    text-align: start;
  }
}
</style>
