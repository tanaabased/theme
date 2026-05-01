---
title: TMS List
description: Labelled list component for grouped navigation and compact index content.
---

# TMS List

`TMSList` is a globally registered component for rendering labelled lists with consistent item spacing, dividers, and link behavior.

<script setup>
import TMSList from './TMSList.vue';

const listItemSets = {
  balanced: [
    { label: 'Alignment rituals', link: '/styleguide/principles' },
    { label: 'Hero creation', link: '/components/tms-hero' },
    { label: 'Rectangle deployment', link: '/components/tms-grid' },
    { label: 'Square containment', link: '/components/tms-box' },
    {
      label: 'Commitment architecture',
      link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      attrs: { target: '_blank' },
    },
    {
      label: 'Final-frontier stakeholder expansion',
      link: 'https://www.youtube.com/watch?v=cWGQGJfNSUw',
      attrs: { target: '_blank' },
    },
    { label: 'Color discipline', link: '/styleguide/colors' },
    { label: 'Form theater', link: '/styleguide/forms' },
    { label: 'Logo jurisdiction', link: '/components/tms-logo' },
    {
      label: 'Enterprise morale',
      link: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      attrs: { target: '_blank' },
    },
  ],
  short: [
    { label: 'Brand', link: '/styleguide/principles' },
    { label: 'Logo', link: '/components/tms-logo' },
    { label: 'Box', link: '/components/tms-box' },
    { label: 'Grid', link: '/components/tms-grid' },
    { label: 'Hero', link: '/components/tms-hero' },
    { label: 'Section', link: '/components/tms-section' },
    { label: 'Forms', link: '/styleguide/forms' },
    { label: 'Colors', link: '/styleguide/colors' },
    { label: 'Tables', link: '/styleguide/tables' },
    {
      label: 'Engage',
      link: 'https://www.youtube.com/watch?v=cWGQGJfNSUw',
      attrs: { target: '_blank' },
    },
  ],
  long: [
    { label: 'Cross-functional alignment rituals', link: '/styleguide/principles' },
    { label: 'Boardroom hero-sector creation', link: '/components/tms-hero' },
    { label: 'Strategic rectangle deployment', link: '/components/tms-grid' },
    { label: 'Premium square-containment protocol', link: '/components/tms-box' },
    { label: 'Executive typeface governance', link: '/styleguide/typefaces' },
    { label: 'Stakeholder-friendly color discipline', link: '/styleguide/colors' },
    { label: 'Operational form confidence', link: '/styleguide/forms' },
    { label: 'Narrative table compliance', link: '/styleguide/tables' },
    {
      label: 'Unscheduled morale escalation',
      link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      attrs: { target: '_blank' },
    },
    {
      label: 'Final-frontier stakeholder expansion',
      link: 'https://www.youtube.com/watch?v=cWGQGJfNSUw',
      attrs: { target: '_blank' },
    },
  ],
  mixed: [
    { label: 'Alignment rituals', link: '/styleguide/principles' },
    { label: 'Logo', link: '/components/tms-logo' },
    { label: 'Strategic rectangle deployment', link: '/components/tms-grid' },
    { label: 'Box', link: '/components/tms-box' },
    { label: 'Hero creation', link: '/components/tms-hero' },
    { label: 'Operational form confidence', link: '/styleguide/forms' },
    { label: 'Tables', link: '/styleguide/tables' },
    { label: 'Stakeholder-friendly color discipline', link: '/styleguide/colors' },
    {
      label: 'Enterprise morale',
      link: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      attrs: { target: '_blank' },
    },
    {
      label: 'Engage',
      link: 'https://www.youtube.com/watch?v=cWGQGJfNSUw',
      attrs: { target: '_blank' },
    },
  ],
};

const listPlaygroundSchema = {
  name: 'TMSList',
  controls: {
    itemsPreset: {
      kind: 'enum',
      options: ['balanced', 'short', 'long', 'mixed'],
      default: 'balanced',
    },
    itemsCount: {
      kind: 'enum',
      options: ['3', '4', '5', '6', '7', '8', '9', '10'],
      default: '6',
    },
  },
  props: {
    header: {
      kind: 'string',
      default: 'Executive errands.',
    },
    headerLink: {
      kind: 'string',
      default: '/styleguide/principles',
    },
    columns: {
      kind: 'enum',
      options: ['none', '2', '3'],
      default: 'none',
    },
    orientation: {
      kind: 'enum',
      options: ['column', 'row'],
      default: 'column',
    },
    items: {
      kind: 'object-array',
      default: listItemSets.balanced.slice(0, 6),
      presets: listItemSets,
      presetControl: 'itemsPreset',
      countControl: 'itemsCount',
      fields: [
        {
          path: 'label',
          kind: 'string',
        },
        {
          path: 'link',
          kind: 'string',
          optional: true,
        },
        {
          path: 'attrs.target',
          kind: 'enum',
          options: ['', '_blank'],
          optional: true,
        },
      ],
    },
  },
};

</script>

## Usage

<TMSComponentPlayground :component="TMSList" :schema="listPlaygroundSchema" />

## Props

| Prop          | Type                                | Default    | Notes                                                 |
| ------------- | ----------------------------------- | ---------- | ----------------------------------------------------- |
| `header`      | `string`                            | `''`       | Visible list label rendered above or beside the list. |
| `headerLink`  | `string`                            | `''`       | Makes the list label clickable when populated.        |
| `items`       | `Array<TMSListItem>`                | `[]`       | Recommended list authoring path.                      |
| `item.attrs`  | `Record<string, string \| boolean>` | `{}`       | Safe anchor attributes for linked items.              |
| `orientation` | `'column' \| 'row'`                 | `'column'` | Controls list layout.                                 |
| `columns`     | `'none' \| '2' \| '3'`              | `'none'`   | Opts the item list into vertical multi-column layout. |

`item.attrs` supports `target`, `rel`, `download`, `title`, `aria-*`, and `data-*`. If `target` is `_blank` and `rel` is omitted, `rel="noreferrer"` is added automatically.

::: info
`TMSList` automatically labels its own region with the visible list label. Use a separate Markdown heading before the component when the list should appear in the page outline.
:::

## Slots

| Slot      | Notes                                                |
| --------- | ---------------------------------------------------- |
| `default` | Optional `<li>` children. Overrides `items` if used. |
