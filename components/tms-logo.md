---
title: TMS Logo
description: Global logo component for Tanaab properties.
---

# TMS Logo

`TMSLogo` is a globally registered component for rendering any of the core TMS logo layouts as inline SVG.

## Props

| Prop         | Type                                        | Default      | Notes                                                                                          |
| ------------ | ------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `type`       | `'left' \| 'right' \| 'centered' \| 'mark'` | `'centered'` | Selects which `*_var.svg` file is rendered.                                                    |
| `background` | `string`                                    | `'none'`     | Applied to `background-color` on the SVG element.                                              |
| `color`      | `string`                                    | auto         | Applied to `color` on the SVG element; defaults to white in dark mode and black in light mode. |
| `link`       | `string`                                    | `'/'`        | Applied to the root anchor `href`; the entire logo renders as a clickable link.                |

## Basic Usage

```html
<TMSLogo />
<TMSLogo type="left" />
<TMSLogo type="mark" color="#00c88a" background="transparent" />
<TMSLogo type="mark" link="/styleguide/logo" />
```

## Demo

<script setup>
import { computed, ref } from 'vue';
import { useData } from 'vitepress';

const { isDark } = useData();

const type = ref('');
const colorMode = ref('');
const foregroundColor = ref('');
const backgroundColor = ref('');
const link = ref('');

const resolvedType = computed(() => type.value || 'centered');

const resolvedUseAutoColor = computed(() => {
  if (colorMode.value === '') return true;
  return colorMode.value;
});

const defaultForegroundColor = computed(() => (isDark.value ? '#ffffff' : '#000000'));

const resolvedBackground = computed(() => {
  if (resolvedUseAutoColor.value) return 'none';
  const value = backgroundColor.value?.trim();
  if (!value) return 'none';
  return value;
});

const resolvedColor = computed(() => {
  if (resolvedUseAutoColor.value) return undefined;
  const value = foregroundColor.value?.trim();
  return value || defaultForegroundColor.value;
});

const resolvedLink = computed(() => {
  const value = link.value?.trim();
  if (!value) return '/';
  return value;
});

function quoteProp(value) {
  return JSON.stringify(value);
}

const demoCode = computed(() => {
  const props = [];

  if (resolvedType.value !== 'centered') props.push(`type=${quoteProp(resolvedType.value)}`);
  if (resolvedBackground.value !== 'none') props.push(`background=${quoteProp(resolvedBackground.value)}`);
  if (resolvedColor.value) props.push(`color=${quoteProp(resolvedColor.value)}`);
  if (resolvedLink.value !== '/') props.push(`link=${quoteProp(resolvedLink.value)}`);

  if (props.length === 0) return '<TMSLogo />';
  return `<TMSLogo\n  ${props.join('\n  ')}\n/>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls-description>
    Adjust the controls to update both the live preview and the code sample.
  </template>
  <template #controls>
    <label>
      <span class="tms-visually-hidden">Type</span>
      <select v-model="type">
        <option value="">Type</option>
        <option value="left">left</option>
        <option value="right">right</option>
        <option value="centered">centered</option>
        <option value="mark">mark</option>
      </select>
    </label>
    <label>
      <span class="tms-visually-hidden">Color mode</span>
      <select v-model="colorMode">
        <option value="">Color mode</option>
        <option :value="true">auto (theme-aware default)</option>
        <option :value="false">custom colors</option>
      </select>
    </label>
    <label v-if="!resolvedUseAutoColor">
      <span class="tms-visually-hidden">Foreground color</span>
      <input v-model="foregroundColor" type="text" placeholder="Foreground color hex" />
    </label>
    <label v-if="!resolvedUseAutoColor">
      <span class="tms-visually-hidden">Background color</span>
      <input v-model="backgroundColor" type="text" placeholder="Background color hex" />
    </label>
    <label>
      <span class="tms-visually-hidden">Link</span>
      <input v-model="link" type="text" placeholder="Link URL" />
    </label>
  </template>
  <template #preview>
    <TMSLogo
      :type="resolvedType"
      :background="resolvedBackground"
      :color="resolvedColor"
      :link="resolvedLink"
    />
  </template>
</TMSComponentDocDemo>
