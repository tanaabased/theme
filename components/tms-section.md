---
title: TMS Section
description: Two-column section component for pairing a narrow title rail with main content.
---

# TMS Section

`TMSSection` is a globally registered component for pairing a concise section title with broader supporting content.

<script setup>
import TMSSection from './TMSSection.vue';

const sectionPlaygroundSchema = {
  name: 'TMSSection',
  props: {
    orientation: {
      kind: 'enum',
      options: ['left', 'right'],
      default: 'left',
    },
    borderTop: {
      kind: 'boolean',
      default: false,
    },
    borderBottom: {
      kind: 'boolean',
      default: false,
    },
  },
  slots: {
    title: {
      kind: 'html',
      default: 'Useful theater.',
    },
    default: {
      kind: 'html',
      default:
        '<p>A Tanaab-based section gives important copy a dedicated lane, then lets the typography perform a modest amount of executive theater.</p>',
    },
  },
};
</script>

## Usage

<TMSComponentPlayground :component="TMSSection" :schema="sectionPlaygroundSchema" />

## Props

| Prop           | Type                | Default  | Notes                                                     |
| -------------- | ------------------- | -------- | --------------------------------------------------------- |
| `borderBottom` | `boolean`           | `false`  | Adds a bottom divider when enabled.                       |
| `borderTop`    | `boolean`           | `false`  | Adds a top divider when enabled.                          |
| `orientation`  | `'left' \| 'right'` | `'left'` | Controls which side the title rail uses on wider layouts. |

On stacked layouts, the title always renders above the content and aligns to the start.

## Slots

| Slot      | Notes                           |
| --------- | ------------------------------- |
| `#title`  | Section title or label content. |
| `default` | Main section content.           |

::: info
`TMSSection` automatically connects the section to its title with a generated `aria-labelledby` ID.
:::
