---
title: TMS Box
description: Square content and link block for compact navigation or editorial calls.
---

# TMS Box

`TMSBox` renders a responsive square for compact content, title tiles, or linked navigation. Use it when the container shape is part of the presentation.

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

<TMSComponentPlayground
  :component="TMSBox"
  :schema="boxPlaygroundSchema"
  preview-fit="contained"
/>

## Props

| Prop   | Type                   | Default     | Notes                                     |
| ------ | ---------------------- | ----------- | ----------------------------------------- |
| `type` | `'content' \| 'title'` | `'content'` | Controls the slot typography treatment.   |
| `link` | `string`               | `''`        | Renders the box as a link when populated. |

## Slots

| Slot      | Notes        |
| --------- | ------------ |
| `default` | Box content. |

## Variables

| Variable            | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `--tms-box-padding` | Base padding hook for box variants that use the root box padding. |
