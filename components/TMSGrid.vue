<template>
  <div class="tms-grid" :data-columns="resolvedColumns">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  columns: {
    type: [Number, String],
    default: 1,
    validator: (value) => {
      const columns = Number(value);
      return Number.isInteger(columns) && columns >= 1 && columns <= 6;
    },
  },
});

const resolvedColumns = computed(() => {
  const columns = Number(props.columns);
  if (Number.isInteger(columns) && columns >= 1 && columns <= 6) return columns;
  return 1;
});
</script>

<style scoped lang="scss">
@use '../styles/vars' as vars;

.tms-grid {
  --tms-grid-column-width: 100%;
  --tms-grid-gap: clamp(1rem, 3vw, 1.5rem);
  --tms-grid-item-font-size: clamp(1.75rem, 8vw, 2.5rem);
  --tms-grid-item-line-height: 1.05;

  display: flex;
  flex-wrap: wrap;
  gap: var(--tms-grid-gap);
  justify-content: flex-start;
  width: 100%;
}

.tms-grid :deep(> *) {
  flex: 0 0 var(--tms-grid-column-width);
  width: var(--tms-grid-column-width);
  max-width: var(--tms-grid-column-width);
  min-width: 0;
}

@media (min-width: vars.$breakpoint-xs) {
  .tms-grid[data-columns='2'],
  .tms-grid[data-columns='3'],
  .tms-grid[data-columns='4'],
  .tms-grid[data-columns='5'],
  .tms-grid[data-columns='6'] {
    --tms-grid-column-width: calc((100% - var(--tms-grid-gap)) / 2);
    --tms-grid-item-font-size: clamp(1.35rem, 4vw, 1.8rem);
    --tms-grid-item-line-height: 1.08;
  }
}

@media (min-width: vars.$breakpoint-lg) {
  .tms-grid[data-columns='3'] {
    --tms-grid-gap: clamp(0.875rem, 2vw, 1.25rem);
    --tms-grid-item-font-size: clamp(1.2rem, 2vw, 1.55rem);
    --tms-grid-item-line-height: 1.08;
    --tms-grid-column-width: calc((100% - (var(--tms-grid-gap) + var(--tms-grid-gap))) / 3);
  }

  .tms-grid[data-columns='4'],
  .tms-grid[data-columns='5'],
  .tms-grid[data-columns='6'] {
    --tms-grid-gap: clamp(0.875rem, 2vw, 1.25rem);
    --tms-grid-item-font-size: clamp(1rem, 1.6vw, 1.35rem);
    --tms-grid-item-line-height: 1.1;
    --tms-grid-column-width: calc(
      (100% - (var(--tms-grid-gap) + var(--tms-grid-gap) + var(--tms-grid-gap))) / 4
    );
  }
}

@media (min-width: vars.$breakpoint-xl) {
  .tms-grid[data-columns='5'] {
    --tms-grid-gap: clamp(0.75rem, 1.5vw, 1rem);
    --tms-grid-item-font-size: clamp(0.95rem, 1.1vw, 1.2rem);
    --tms-grid-item-line-height: 1.1;
    --tms-grid-column-width: calc(
      (
          100% -
            (var(--tms-grid-gap) + var(--tms-grid-gap) + var(--tms-grid-gap) + var(--tms-grid-gap))
        ) /
        5
    );
  }

  .tms-grid[data-columns='6'] {
    --tms-grid-gap: clamp(0.75rem, 1.5vw, 1rem);
    --tms-grid-item-font-size: clamp(0.9rem, 1vw, 1.1rem);
    --tms-grid-item-line-height: 1.1;
    --tms-grid-column-width: calc(
      (
          100% -
            (
              var(--tms-grid-gap) + var(--tms-grid-gap) + var(--tms-grid-gap) +
                var(--tms-grid-gap) + var(--tms-grid-gap)
            )
        ) /
        6
    );
  }
}
</style>
