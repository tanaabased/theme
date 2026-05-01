---
title: TMS Section
description: Title-rail content section with orientation and optional dividers.
---

# TMS Section

`TMSSection` pairs a concise title rail with broader supporting content. Use it for structured page sections that need clear hierarchy without a full hero treatment.

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
| `orientation`  | `'left' \| 'right'` | `'left'` | Controls which side the title rail uses on wider layouts. |
| `borderTop`    | `boolean`           | `false`  | Adds a top divider when enabled.                          |
| `borderBottom` | `boolean`           | `false`  | Adds a bottom divider when enabled.                       |

On stacked layouts, the title always renders above the content and aligns to the start.

## Slots

| Slot      | Notes                           |
| --------- | ------------------------------- |
| `#title`  | Section title or label content. |
| `default` | Main section content.           |

## Variables

| Variable                      | Purpose                             |
| ----------------------------- | ----------------------------------- |
| `--tms-section-gap`           | Gap between title rail and content. |
| `--tms-section-padding-block` | Vertical padding for the section.   |

::: info
`TMSSection` automatically connects the section to its title with a generated `aria-labelledby` ID.
:::
