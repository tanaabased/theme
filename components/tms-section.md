---
title: TMS Section
description: Two-column section component for pairing a narrow title rail with main content.
---

# TMS Section

`TMSSection` is a globally registered component for pairing a concise section title with broader supporting content.

## Props

| Prop           | Type                | Default  | Notes                                                     |
| -------------- | ------------------- | -------- | --------------------------------------------------------- |
| `borderBottom` | `boolean`           | `false`  | Adds a bottom divider when enabled.                       |
| `borderTop`    | `boolean`           | `false`  | Adds a top divider when enabled.                          |
| `orientation`  | `'left' \| 'right'` | `'left'` | Controls which side the title rail uses on wider layouts. |

On stacked layouts, the title always renders above the content and aligns to the start.

## Slots

| Slot      | Notes                           |
| --------- | ------------------------------- |
| `#title`  | Section title or label content. |
| `default` | Main section content.           |

::: info
`TMSSection` automatically connects the section to its title with a generated `aria-labelledby` ID.
:::

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

<TMSSection border-top border-bottom>
  <template #title>
    Framed section.
  </template>
  <p>Opt into dividers only when the surrounding composition needs them.</p>
</TMSSection>
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const orientation = ref('');
const borderTop = ref(false);
const borderBottom = ref(false);
const titleSlot = ref('');
const defaultContents = ref('');

const fallbackTitleSlot = 'A Tanaab-based title.';
const fallbackDefaultContents = `<p>
  With some Tanaab-based content that includes a Tanaab-based <a href="/styleguide/principles">link</a>. And other <strong>strong</strong>, <small>small</small> and <em>italic</em> words.
</p>`;

const resolvedOrientation = computed(() => orientation.value || 'left');

const resolvedTitleSlot = computed(() => {
  const value = titleSlot.value.trim();
  return value || fallbackTitleSlot;
});

const resolvedDefaultContents = computed(() => {
  const value = defaultContents.value.trim();
  return value || fallbackDefaultContents;
});

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

  if (resolvedOrientation.value === 'right') props.push('orientation="right"');
  if (borderTop.value) props.push('border-top');
  if (borderBottom.value) props.push('border-bottom');

  const propString = props.length > 0 ? ` ${props.join(' ')}` : '';

  return `<TMSSection${propString}>
  <template #title>
${indentLines(resolvedTitleSlot.value, 4)}
  </template>
${indentLines(resolvedDefaultContents.value, 2)}
</TMSSection>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the controls to update both the live preview and the code sample. Slot textareas accept trusted demo HTML.
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
    <label>
      <input v-model="borderTop" type="checkbox" />
      <span>Border top</span>
    </label>
    <label>
      <input v-model="borderBottom" type="checkbox" />
      <span>Border bottom</span>
    </label>
    <label>
      <span class="tms-visually-hidden">Title slot</span>
      <textarea v-model="titleSlot" placeholder="Title slot"></textarea>
    </label>
    <label>
      <span class="tms-visually-hidden">Default contents</span>
      <textarea v-model="defaultContents" placeholder="Default contents"></textarea>
    </label>
  </template>
  <template #preview>
    <TMSSection
      :border-bottom="borderBottom"
      :border-top="borderTop"
      :orientation="resolvedOrientation"
    >
      <template #title>
        <div v-html="resolvedTitleSlot"></div>
      </template>
      <div v-html="resolvedDefaultContents"></div>
    </TMSSection>
  </template>
</TMSComponentDocDemo>
