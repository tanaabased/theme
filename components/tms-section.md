---
title: TMS Section
description: Two-column section component for pairing a narrow title rail with main content.
---

# TMS Section

`TMSSection` is a globally registered component for pairing a concise section title with broader supporting content.

## Props

| Prop          | Type                | Default  | Notes                                             |
| ------------- | ------------------- | -------- | ------------------------------------------------- |
| `orientation` | `'left' \| 'right'` | `'left'` | Controls whether the title renders left or right. |

## Slots

| Slot      | Notes                           |
| --------- | ------------------------------- |
| `#title`  | Section title or label content. |
| `default` | Main section content.           |

## Basic Usage

```vue
<TMSSection>
  <template #title>
    What we do.
  </template>
  <p>We offer strategy, design, and development services across industries.</p>
</TMSSection>

<TMSSection orientation="right">
  <template #title>
    How we work.
  </template>
  <p>We keep the label rail on the right when the surrounding layout calls for it.</p>
</TMSSection>
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const orientation = ref('');

const resolvedOrientation = computed(() => orientation.value || 'left');

const demoCode = computed(() => {
  const orientationProp = resolvedOrientation.value === 'right' ? ' orientation="right"' : '';

  return `<TMSSection${orientationProp}>
  <template #title>
    What we do.
  </template>
  <p>
    We offer strategy, design, and development services across industries.
  </p>
</TMSSection>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the orientation to update both the live preview and the code sample.
  </template>
  <template #controls>
    <label>
      <span class="tms-visually-hidden">Orientation</span>
      <select v-model="orientation">
        <option value="">Orientation</option>
        <option value="left">left</option>
        <option value="right">right</option>
      </select>
    </label>
  </template>
  <template #preview>
    <TMSSection :orientation="resolvedOrientation">
      <template #title>
        What we do.
      </template>
      <p>
        We offer <a href="/styleguide/principles">strategy</a>, <a href="/styleguide/colors">design</a>,
        and <a href="/components/">development</a> services across industries.
      </p>
    </TMSSection>
  </template>
</TMSComponentDocDemo>
