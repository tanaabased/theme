---
title: TMS Grid
description: Flex wrapper component for grouping Tanaab boxes and related content.
---

# TMS Grid

`TMSGrid` is a globally registered component for wrapping content in a responsive flex layout.
The `columns` prop sets the maximum column count on the widest viewport; dense grids scale down at smaller breakpoints before stacking to one column.

<script setup>
import TMSBox from './TMSBox.vue';
import TMSGrid from './TMSGrid.vue';

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

const gridPlaygroundSchema = {
  name: 'TMSGrid',
  props: {
    columns: {
      kind: 'enum',
      options: ['1', '2', '3', '4', '5', '6'],
      default: '3',
    },
  },
  controls: {
    boxCount: {
      kind: 'enum',
      options: ['auto', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      default: 'auto',
    },
  },
  slots: {
    default: {
      kind: 'repeat',
      component: TMSBox,
      componentName: 'TMSBox',
      props: {
        type: 'title',
      },
      items: boxes,
      countControl: 'boxCount',
      autoCountProp: 'columns',
    },
  },
};
</script>

## Usage

<TMSComponentPlayground :component="TMSGrid" :schema="gridPlaygroundSchema" />

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

## Variables

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
