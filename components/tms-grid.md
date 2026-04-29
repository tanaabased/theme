---
title: TMS Grid
description: Flex wrapper component for grouping Tanaab boxes and related content.
---

# TMS Grid

`TMSGrid` is a globally registered component for wrapping content in a responsive flex layout.
The `columns` prop sets the maximum column count on the widest viewport; dense grids scale down at smaller breakpoints before stacking to one column.

## Props

| Prop      | Type              | Default | Notes                                                 |
| --------- | ----------------- | ------- | ----------------------------------------------------- |
| `columns` | `1 \| 2 \| ... 6` | `1`     | Sets the maximum column count on the widest viewport. |

## Slots

| Slot      | Notes         |
| --------- | ------------- |
| `default` | Grid content. |

::: info
The examples use `TMSBox` to make the column behavior visible. `TMSGrid` can wrap any slotted content; each child owns its own visual treatment.
:::

## Basic Usage

```html
<TMSGrid>
  <TMSBox type="title">One</TMSBox>
  <TMSBox type="title">Two</TMSBox>
</TMSGrid>

<TMSGrid columns="3">
  <TMSBox type="title">One</TMSBox>
  <TMSBox type="title">Two</TMSBox>
  <TMSBox type="title">Three</TMSBox>
</TMSGrid>
```

## Grid-Aware Text

`TMSGrid` exposes density-aware text variables that child components can opt into:

| Variable                      | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `--tms-grid-item-font-size`   | Suggested text size for grid-aware children. |
| `--tms-grid-item-line-height` | Suggested line height for grid-aware text.   |

`TMSBox` uses these variables when it is rendered inside `TMSGrid`, while preserving its standalone defaults outside a grid.

```scss
.my-grid-item {
  font-size: var(--tms-grid-item-font-size, 1.25rem);
  line-height: var(--tms-grid-item-line-height, 1.1);
}
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const columns = ref('');
const boxCount = ref('auto');

const resolvedColumns = computed(() => columns.value || '1');

const resolvedBoxCount = computed(() => {
  if (boxCount.value === 'auto') return Number(resolvedColumns.value);
  return Number(boxCount.value);
});

const boxes = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
];

const visibleBoxes = computed(() => boxes.slice(0, resolvedBoxCount.value));

const demoCode = computed(() => {
  const propString = resolvedColumns.value !== '1' ? ` columns="${resolvedColumns.value}"` : '';
  const boxLines = visibleBoxes.value.map((box) => `  <TMSBox type="title">${box}</TMSBox>`).join('\n');

  return `<TMSGrid${propString}>
${boxLines}
</TMSGrid>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the columns and box count to update both the live preview and the code sample.
  </template>
  <template #controls>
    <label>
      <span class="tms-visually-hidden">Columns</span>
      <select v-model="columns">
        <option value="">Columns</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
    </label>
    <label>
      <span class="tms-visually-hidden">Box count</span>
      <select v-model="boxCount">
        <option value="auto">Auto</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
    </label>
  </template>
  <template #preview>
    <TMSGrid :columns="resolvedColumns">
      <TMSBox v-for="box in visibleBoxes" :key="box" type="title">{{ box }}</TMSBox>
    </TMSGrid>
  </template>
</TMSComponentDocDemo>
