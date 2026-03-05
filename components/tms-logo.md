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

## Source

<pre class="language-vue"><code>{{ tmsLogoSource }}</code></pre>

## Interactive Demo

<script setup>
import { computed, ref } from 'vue';
import tmsLogoSource from './TMSLogo.vue?raw';

const type = ref('centered');
const background = ref('none');
const useAutoColor = ref(true);
const color = ref('#ffffff');
const link = ref('/');

const logoColor = computed(() => (useAutoColor.value ? undefined : color.value));
const logoBackground = computed(() => (background.value?.trim() ? background.value.trim() : 'none'));
</script>

<div class="tms-logo-demo">
  <div class="tms-logo-controls">
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
  </div>

  <div class="tms-logo-preview">
    <TMSLogo :type="type" :background="logoBackground" :color="logoColor" :link="link" />
  </div>
</div>

<style scoped>
.tms-logo-demo {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.tms-logo-controls {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.tms-logo-controls label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.875rem;
}

.tms-logo-controls span {
  font-weight: 600;
}

.tms-logo-controls input,
.tms-logo-controls select {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 0.5rem 0.625rem;
}

.tms-logo-preview {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  padding: 1rem;
}

.tms-logo-preview :deep(.tms-logo) {
  display: block;
  max-width: 560px;
}
</style>
