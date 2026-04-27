<template>
  <section class="tms-section" :data-orientation="props.orientation">
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
  padding-block: clamp(2.5rem, 6vw, 4rem);
  border-top: 1px solid var(--vp-c-divider);
}

.tms-section[data-orientation='right'] {
  grid-template-areas: 'content title';
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.28fr);
}

.tms-section__title {
  grid-area: title;
  color: var(--vp-c-text-1);
  font-family: var(--tanaab-font-family-heading);
  font-size: var(--tanaab-font-size-h3);
  font-weight: var(--tanaab-font-weight-heading);
  line-height: var(--tanaab-line-height-h3);
}

.tms-section__content {
  grid-area: content;
  min-width: 0;
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
