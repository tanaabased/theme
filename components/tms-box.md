---
title: TMS Box
description: Square box component for navigation and compact content blocks.
---

# TMS Box

`TMSBox` is a globally registered component for rendering a square Tanaab-based box with optional link behavior.

## Props

| Prop   | Type     | Default | Notes                                     |
| ------ | -------- | ------- | ----------------------------------------- |
| `link` | `string` | `''`    | Renders the box as a link when populated. |

## Slots

| Slot      | Notes        |
| --------- | ------------ |
| `default` | Box content. |

## Basic Usage

```vue
<TMSBox>Static box</TMSBox>
<TMSBox link="/styleguide/">Styleguide</TMSBox>
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const link = ref('');

const resolvedLink = computed(() => {
  const value = link.value?.trim();
  if (!value) return '';
  return value;
});

function quoteProp(value) {
  return JSON.stringify(value);
}

const demoCode = computed(() => {
  const props = [];

  if (resolvedLink.value) props.push(`link=${quoteProp(resolvedLink.value)}`);

  const propString = props.length > 0 ? ` ${props.join(' ')}` : '';

  return `<TMSBox${propString}>Styleguide</TMSBox>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the link to switch between static and linked box behavior.
  </template>
  <template #controls>
    <label>
      <span class="tms-visually-hidden">Link</span>
      <input v-model="link" type="text" placeholder="Link URL" />
    </label>
  </template>
  <template #preview>
    <TMSBox :link="resolvedLink">Styleguide</TMSBox>
  </template>
</TMSComponentDocDemo>
