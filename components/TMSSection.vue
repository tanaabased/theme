<template>
  <section
    class="tms-section"
    :data-border-bottom="props.borderBottom"
    :data-border-top="props.borderTop"
    :data-orientation="props.orientation"
  >
    <div class="tms-section__title">
      <slot name="title" />
    </div>
    <div class="tms-section__content">
      <slot />
    </div>
  </section>
</template>

<script setup>
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
</script>

<style scoped lang="scss">
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
  font-size: var(--tanaab-font-size-h3);
  font-weight: var(--tanaab-font-weight-heading);
  line-height: var(--tanaab-line-height-h3);
}

.tms-section[data-orientation='right'] .tms-section__title {
  text-align: right;
}

.tms-section__content {
  grid-area: content;
  min-width: 0;
}

.tms-section__content :deep(> :first-child),
.tms-section__content :deep(> :first-child > :first-child) {
  padding-top: 0;
  margin-top: 0;
}

@media (max-width: 767px) {
  .tms-section,
  .tms-section[data-orientation='right'] {
    grid-template-areas:
      'title'
      'content';
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding-block: 2rem;
  }
}
</style>
