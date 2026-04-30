---
title: TMS Hero
description: Wide editorial statement component for large title and supporting content.
---

# TMS Hero

`TMSHero` is a globally registered component for pairing an oversized editorial title with supporting body content.

<script setup>
import TMSHero from './TMSHero.vue';

const heroPlaygroundSchema = {
  name: 'TMSHero',
  props: {
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
      default: 'Start big. <br><strong>Say something useful.</strong>',
    },
    default: {
      kind: 'html',
      default:
        '<p>A Tanaab-based hero converts first impressions into a disciplined brand-performance corridor, which is a majestic way of saying the top of the page should make its point quickly.</p>',
    },
  },
};

const heroPlaygroundInitialState = {
  props: {
    borderTop: true,
    borderBottom: true,
  },
};
</script>

## Usage

<TMSComponentPlayground
  :component="TMSHero"
  :schema="heroPlaygroundSchema"
  :initial-state="heroPlaygroundInitialState"
/>

## Props

| Prop           | Type      | Default | Notes                               |
| -------------- | --------- | ------- | ----------------------------------- |
| `borderBottom` | `boolean` | `false` | Adds a bottom divider when enabled. |
| `borderTop`    | `boolean` | `false` | Adds a top divider when enabled.    |

## Slots

| Slot      | Notes                     |
| --------- | ------------------------- |
| `#title`  | Oversized hero statement. |
| `default` | Supporting body content.  |

::: info
`TMSHero` automatically connects the section to its title with a generated `aria-labelledby` ID.
:::
