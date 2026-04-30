---
title: TMS Box
description: Square box component for navigation and compact content blocks.
---

# TMS Box

`TMSBox` is a globally registered component for rendering a square Tanaab-based box with optional link behavior.

<script setup>
import TMSBox from './TMSBox.vue';

const boxPlaygroundSchema = {
  name: 'TMSBox',
  props: {
    type: {
      kind: 'enum',
      options: ['content', 'title'],
      default: 'content',
    },
    link: {
      kind: 'string',
      default: '',
    },
  },
  slots: {
    default: {
      kind: 'html',
      default: 'Strategic rectangle behavior.',
    },
  },
};
</script>

## Usage

<TMSComponentPlayground :component="TMSBox" :schema="boxPlaygroundSchema" />

## Props

| Prop   | Type                   | Default     | Notes                                     |
| ------ | ---------------------- | ----------- | ----------------------------------------- |
| `link` | `string`               | `''`        | Renders the box as a link when populated. |
| `type` | `'content' \| 'title'` | `'content'` | Controls the slot typography treatment.   |

## Slots

| Slot      | Notes        |
| --------- | ------------ |
| `default` | Box content. |
