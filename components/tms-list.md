---
title: TMS List
description: Labelled list component for grouped navigation and compact index content.
---

# TMS List

`TMSList` is a globally registered component for rendering labelled lists with consistent item spacing, dividers, and link behavior.

## Props

| Prop          | Type                                | Default    | Notes                                                 |
| ------------- | ----------------------------------- | ---------- | ----------------------------------------------------- |
| `header`      | `string`                            | `''`       | Visible list label rendered above or beside the list. |
| `headerLink`  | `string`                            | `''`       | Makes the list label clickable when populated.        |
| `items`       | `Array<TMSListItem>`                | `[]`       | Recommended list authoring path.                      |
| `orientation` | `'column' \| 'row'`                 | `'column'` | Controls list layout.                                 |
| `item.attrs`  | `Record<string, string \| boolean>` | `{}`       | Safe anchor attributes for linked items.              |

`item.attrs` supports `target`, `rel`, `download`, `title`, `aria-*`, and `data-*`. If `target` is `_blank` and `rel` is omitted, `rel="noreferrer"` is added automatically.

::: info
`TMSList` automatically labels its own region with the visible list label. Use a separate Markdown heading before the component when the list should appear in the page outline.
:::

## Slots

| Slot      | Notes                                                |
| --------- | ---------------------------------------------------- |
| `default` | Optional `<li>` children. Overrides `items` if used. |

## Basic Usage

```vue
<TMSList
  header="Strategy."
  :items="[
    { label: 'Business', link: '/strategy/business' },
    { label: 'Branding', link: '/strategy/branding' },
    { label: 'User Research', link: '/strategy/user-research' },
  ]"
/>

<TMSList
  header="Industry."
  orientation="row"
  :items="[
    { label: 'Finance', link: '/industries/finance' },
    { label: 'Healthcare', link: '/industries/healthcare' },
    { label: 'Tech', link: 'https://example.com/tech', attrs: { target: '_blank' } },
  ]"
/>

<TMSList header="Custom list.">
  <li><a href="/custom/one">Custom item</a></li>
  <li><a href="/custom/two">Another item</a></li>
</TMSList>
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const header = ref('');
const headerLink = ref('');
const orientation = ref('');
const itemsText = ref('');

const fallbackItemsText = `Business | /strategy/business
Branding | /strategy/branding
User Research | /strategy/user-research
Content Strategy | /strategy/content-strategy
SEO | https://example.com/seo | _blank`;

const resolvedHeader = computed(() => {
  const value = header.value.trim();
  return value || 'Strategy.';
});

const resolvedHeaderLink = computed(() => headerLink.value.trim());

const resolvedOrientation = computed(() => orientation.value || 'column');

const resolvedItemsText = computed(() => {
  const value = itemsText.value.trim();
  return value || fallbackItemsText;
});

const resolvedItems = computed(() =>
  resolvedItemsText.value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', link = '', target = ''] = line.split('|').map((part) => part.trim());
      const item = { label };

      if (link) item.link = link;
      if (target) item.attrs = { target };

      return item;
    })
    .filter((item) => item.label),
);

function quoteProp(value) {
  return JSON.stringify(value);
}

function formatObject(value) {
  return JSON.stringify(value, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
}

function formatBoundValue(value) {
  return formatObject(value)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `    ${line}`))
    .join('\n');
}

const demoCode = computed(() => {
  const props = [`header=${quoteProp(resolvedHeader.value)}`];

  if (resolvedHeaderLink.value) props.push(`header-link=${quoteProp(resolvedHeaderLink.value)}`);
  if (resolvedOrientation.value === 'row') props.push('orientation="row"');

  const propString = props.join('\n  ');
  const itemsString = formatBoundValue(resolvedItems.value);

  return `<TMSList
  ${propString}
  :items="${itemsString}"
/>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the controls to update the list. Items use one line per entry: label, URL, and optional target separated by pipes.
  </template>
  <template #controls>
    <label>
      <span class="tms-visually-hidden">Header</span>
      <input v-model="header" type="text" placeholder="Header" />
    </label>
    <label>
      <span class="tms-visually-hidden">Header link</span>
      <input v-model="headerLink" type="text" placeholder="Header link URL" />
    </label>
    <label>
      <span class="tms-visually-hidden">Orientation</span>
      <select v-model="orientation">
        <option value="">Orientation</option>
        <option value="column">column</option>
        <option value="row">row</option>
      </select>
    </label>
    <label>
      <span class="tms-visually-hidden">Items</span>
      <textarea v-model="itemsText" placeholder="Items"></textarea>
    </label>
  </template>
  <template #preview>
    <TMSList
      :header="resolvedHeader"
      :header-link="resolvedHeaderLink"
      :items="resolvedItems"
      :orientation="resolvedOrientation"
    />
  </template>
</TMSComponentDocDemo>
