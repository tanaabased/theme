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

```vue
<TMSLogo />
<TMSLogo type="left" />
<TMSLogo type="mark" color="#00c88a" background="transparent" />
<TMSLogo type="mark" link="/styleguide/logo" />
```

## Demo

<script setup>
import { computed, ref } from 'vue';

const type = ref('centered');
const background = ref('none');
const useAutoColor = ref(true);
const color = ref('#ffffff');
const link = ref('/');

const resolvedBackground = computed(() => {
  const value = background.value?.trim();
  if (!value) return 'none';
  return value;
});

const resolvedColor = computed(() => {
  if (useAutoColor.value) return undefined;
  const value = color.value?.trim();
  if (!value) return undefined;
  return value;
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

  if (type.value !== 'centered') props.push(`type=${quoteProp(type.value)}`);
  if (resolvedBackground.value !== 'none') props.push(`background=${quoteProp(resolvedBackground.value)}`);
  if (resolvedColor.value) props.push(`color=${quoteProp(resolvedColor.value)}`);
  if (resolvedLink.value !== '/') props.push(`link=${quoteProp(resolvedLink.value)}`);

  if (props.length === 0) return '<TMSLogo />';
  return `<TMSLogo\n  ${props.join('\n  ')}\n/>`;
});
</script>

<TMSComponentDocDemo :code="demoCode">
  <template #controls>
    <label>
      <span>Type</span>
      <select v-model="type">
        <option value="left">left</option>
        <option value="right">right</option>
        <option value="centered">centered</option>
        <option value="mark">mark</option>
      </select>
    </label>
    <label>
      <span>Background</span>
      <input v-model="background" type="text" placeholder="none, #111, transparent..." />
    </label>
    <label>
      <span>Color mode</span>
      <select v-model="useAutoColor">
        <option :value="true">auto (theme-aware default)</option>
        <option :value="false">custom color</option>
      </select>
    </label>
    <label v-if="!useAutoColor">
      <span>Color</span>
      <input v-model="color" type="text" placeholder="#ffffff, rgb(...), var(--...)" />
    </label>
    <label>
      <span>Link</span>
      <input v-model="link" type="text" placeholder="/, /styleguide/logo, https://..." />
    </label>
  </template>
  <template #preview>
    <TMSLogo
      :type="type"
      :background="resolvedBackground"
      :color="resolvedColor"
      :link="resolvedLink"
    />
  </template>
</TMSComponentDocDemo>

<p><small>source: <a href="https://github.com/tanaabased/theme/blob/main/components/TMSLogo.vue">https://github.com/tanaabased/theme/blob/main/components/TMSLogo.vue</a></small></p>
