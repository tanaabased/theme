---
title: TMS Hero
description: Wide editorial statement component for large title and supporting content.
---

# TMS Hero

`TMSHero` is a globally registered component for pairing an oversized editorial title with supporting body content.

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

## Basic Usage

```html
<TMSHero border-top border-bottom>
  <template #title> The above four. In four sentences. </template>
  <p>Focused collaboration keeps the work simple, durable, and worth caring about.</p>
</TMSHero>
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const borderTop = ref(true);
const borderBottom = ref(true);
const titleSlot = ref('');
const defaultContents = ref('');

const fallbackTitleSlot = `This hero.<br>
<strong>is Tanaab-based.</strong>`;
const fallbackDefaultContents = `<p>
  A Tanaab-based hero operationalizes brand-aligned excellence by synergizing guideline fidelity, outcome-forward craftsmanship, and suspiciously premium strategic vibes into one scalable narrative artifact. By leveraging cross-functional font energy and mission-critical spacing paradigms, the hero transforms ordinary page introductions into value-positive momentum corridors. This is, of course, extremely serious enterprise language for making the top of the page look good and say the right thing.
</p>`;

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

  if (borderTop.value) props.push('border-top');
  if (borderBottom.value) props.push('border-bottom');

  const propString = props.length > 0 ? ` ${props.join(' ')}` : '';

  return `<TMSHero${propString}>
  <template #title>
${indentLines(resolvedTitleSlot.value, 4)}
  </template>
${indentLines(resolvedDefaultContents.value, 2)}
</TMSHero>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the controls to update both the live preview and the code sample. Slot textareas accept trusted demo HTML.
  </template>
  <template #controls>
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
    <TMSHero :border-bottom="borderBottom" :border-top="borderTop">
      <template #title>
        <div v-html="resolvedTitleSlot"></div>
      </template>
      <div v-html="resolvedDefaultContents"></div>
    </TMSHero>
  </template>
</TMSComponentDocDemo>
