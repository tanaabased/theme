---
title: TMS Box
description: Square box component for navigation and compact content blocks.
---

# TMS Box

`TMSBox` is a globally registered component for rendering a square Tanaab-based box with optional link behavior.

## Props

| Prop   | Type                   | Default     | Notes                                     |
| ------ | ---------------------- | ----------- | ----------------------------------------- |
| `link` | `string`               | `''`        | Renders the box as a link when populated. |
| `type` | `'content' \| 'title'` | `'content'` | Controls the slot typography treatment.   |

## Slots

| Slot      | Notes        |
| --------- | ------------ |
| `default` | Box content. |

## Basic Usage

```vue
<TMSBox>Content for the box.</TMSBox>
<TMSBox type="title" link="/styleguide/">Styleguide</TMSBox>
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const link = ref('');
const type = ref('');
const slotContent = ref('');

const resolvedType = computed(() => type.value || 'content');

const resolvedLink = computed(() => {
  const value = link.value?.trim();
  if (!value) return '';
  return value;
});

const fallbackSlotContent = computed(() => {
  if (resolvedType.value === 'title') return 'Title';
  return '<h2><strong>Default content</strong><p>for the box.</p></h2>';
});

const resolvedSlotContent = computed(() => {
  const value = slotContent.value?.trim();
  if (!value) return fallbackSlotContent.value;
  return value;
});

function quoteProp(value) {
  return JSON.stringify(value);
}

function indentLines(value, spaces) {
  const prefix = ' '.repeat(spaces);
  return value
    .trim()
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

const demoCode = computed(() => {
  const props = [];

  if (resolvedType.value === 'title') props.push('type="title"');
  if (resolvedLink.value) props.push(`link=${quoteProp(resolvedLink.value)}`);

  const propString = props.length > 0 ? ` ${props.join(' ')}` : '';

  return `<TMSBox${propString}>
${indentLines(resolvedSlotContent.value, 2)}
</TMSBox>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the type, link, and slot content to update the box. The slot textarea accepts trusted demo HTML.
  </template>
  <template #controls>
    <label>
      <span class="tms-visually-hidden">Type</span>
      <select v-model="type">
        <option value="">Type</option>
        <option value="content">content</option>
        <option value="title">title</option>
      </select>
    </label>
    <label>
      <span class="tms-visually-hidden">Link</span>
      <input v-model="link" type="text" placeholder="Link URL" />
    </label>
    <label>
      <span class="tms-visually-hidden">Slot content</span>
      <textarea v-model="slotContent" placeholder="Slot content"></textarea>
    </label>
  </template>
  <template #preview>
    <TMSBox :link="resolvedLink" :type="resolvedType">
      <div v-html="resolvedSlotContent"></div>
    </TMSBox>
  </template>
</TMSComponentDocDemo>
