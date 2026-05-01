---
title: TMS Logo
description: Inline SVG logo renderer with layout, link, color, and background controls.
---

# TMS Logo

`TMSLogo` renders the core TMS logo layouts as inline SVG. It owns the logo link target plus lightweight color and background overrides.

<script setup>
import TMSLogo from './TMSLogo.vue';

const logoPlaygroundSchema = {
  name: 'TMSLogo',
  props: {
    type: {
      kind: 'enum',
      options: ['left', 'right', 'centered', 'mark'],
      default: 'centered',
    },
    link: {
      kind: 'string',
      default: '/',
    },
    color: {
      kind: 'string',
      default: '',
    },
    background: {
      kind: 'string',
      default: 'none',
    },
  },
};
</script>

## Usage

<TMSComponentPlayground
  :component="TMSLogo"
  :schema="logoPlaygroundSchema"
  preview-fit="contained"
/>

## Props

| Prop         | Type                                        | Default      | Notes                                                                                          |
| ------------ | ------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `type`       | `'left' \| 'right' \| 'centered' \| 'mark'` | `'centered'` | Selects which logo layout is rendered.                                                         |
| `link`       | `string`                                    | `'/'`        | Applied to the root anchor `href`; the entire logo renders as a clickable link.                |
| `color`      | `string`                                    | `auto`       | Applied to `color` on the SVG element; defaults to white in dark mode and black in light mode. |
| `background` | `string`                                    | `'none'`     | Applied to `background-color` on the SVG element.                                              |
