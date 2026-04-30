---
title: TMS Logo
description: Global logo component for Tanaab properties.
---

# TMS Logo

`TMSLogo` is a globally registered component for rendering any of the core TMS logo layouts as inline SVG.

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
    background: {
      kind: 'string',
      default: 'none',
    },
    color: {
      kind: 'string',
      default: '',
    },
    link: {
      kind: 'string',
      default: '/',
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
| `type`       | `'left' \| 'right' \| 'centered' \| 'mark'` | `'centered'` | Selects which `*_var.svg` file is rendered.                                                    |
| `background` | `string`                                    | `'none'`     | Applied to `background-color` on the SVG element.                                              |
| `color`      | `string`                                    | `auto`       | Applied to `color` on the SVG element; defaults to white in dark mode and black in light mode. |
| `link`       | `string`                                    | `'/'`        | Applied to the root anchor `href`; the entire logo renders as a clickable link.                |
