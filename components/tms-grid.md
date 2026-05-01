---
title: TMS Grid
description: Responsive wrapper for arranging repeated content with density-aware child typography.
---

# TMS Grid

`TMSGrid` arranges repeated content in a responsive flex grid. The `columns` prop sets the widest layout, then the grid steps down at smaller breakpoints before stacking.

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

| Prop      | Type              | Default | Notes                                                   |
| --------- | ----------------- | ------- | ------------------------------------------------------- |
| `columns` | `1 \| 2 \| ... 6` | `1`     | Sets the maximum column count on the widest breakpoint. |

## Slots

| Slot      | Notes         |
| --------- | ------------- |
| `default` | Grid content. |

::: info
The examples use `TMSBox` to make the column behavior visible. `TMSGrid` can wrap any slotted content; each child owns its own visual treatment.
:::

## Variables

`TMSGrid` exposes layout and density variables that child components can opt into:

| Variable                      | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `--tms-grid-gap`              | Gap between grid children.                   |
| `--tms-grid-item-font-size`   | Suggested text size for grid-aware children. |
| `--tms-grid-item-line-height` | Suggested line height for grid-aware text.   |

`TMSBox` uses these variables when it is rendered inside `TMSGrid`, while preserving its standalone defaults outside a grid.

```scss
.my-grid-item {
  font-size: var(--tms-grid-item-font-size, 1.25rem);
  line-height: var(--tms-grid-item-line-height, 1.1);
}
```
