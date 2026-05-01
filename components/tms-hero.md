---
title: TMS Hero
description: Full-width editorial statement with supporting content and optional dividers.
---

# TMS Hero

`TMSHero` creates a full-width editorial opening with a large title and supporting content. Use it for page-level statements that need more presence than a normal section heading.

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
| `borderTop`    | `boolean` | `false` | Adds a top divider when enabled.    |
| `borderBottom` | `boolean` | `false` | Adds a bottom divider when enabled. |

## Slots

| Slot      | Notes                     |
| --------- | ------------------------- |
| `#title`  | Oversized hero statement. |
| `default` | Supporting body content.  |

## Variables

| Variable                   | Purpose                        |
| -------------------------- | ------------------------------ |
| `--tms-hero-gap`           | Gap between title and content. |
| `--tms-hero-padding-block` | Vertical padding for the hero. |

::: info
`TMSHero` automatically connects the section to its title with a generated `aria-labelledby` ID.
:::
