<template>
  <a
    class="tms-logo"
    :style="logoVars"
    :data-type="props.type"
    :href="resolvedLink"
    aria-label="Tanaab Maneuvering Systems"
    v-html="svgWithClass"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

import centeredLogo from '../public/images/tms_centered_var.svg?raw';
import leftLogo from '../public/images/tms_left_aligned_var.svg?raw';
import markLogo from '../public/images/tms_mark_var.svg?raw';
import rightLogo from '../public/images/tms_right_aligned_var.svg?raw';

const props = defineProps({
  type: {
    type: String,
    default: 'centered',
    validator: (value) => ['left', 'right', 'centered', 'mark'].includes(value),
  },
  background: {
    type: String,
    default: 'none',
  },
  color: {
    type: String,
    default: undefined,
  },
  link: {
    type: String,
    default: '/',
  },
});

const { isDark } = useData();

const logos = {
  centered: centeredLogo,
  left: leftLogo,
  right: rightLogo,
  mark: markLogo,
};

const resolvedColor = computed(() => {
  if (props.color && props.color.trim().length > 0) return props.color.trim();
  return isDark.value ? '#ffffff' : '#000000';
});

const resolvedBackground = computed(() => {
  if (!props.background || props.background.trim().length === 0) return 'none';
  return props.background.trim();
});

const resolvedLink = computed(() => {
  if (!props.link || props.link.trim().length === 0) return '/';
  return props.link.trim();
});

const selectedSvg = computed(() => logos[props.type] ?? logos.centered);

const svgWithClass = computed(() => {
  const svg = selectedSvg.value;
  if (!svg) return '';
  const svgWithClass = /^<svg\b[^>]*class=/i.test(svg)
    ? svg.replace(/^<svg\b([^>]*?)class="([^"]*)"/i, '<svg$1class="$2 tms-logo__svg"')
    : svg.replace(/^<svg\b/i, '<svg class="tms-logo__svg"');

  return svgWithClass.replace(/^<svg\b/i, '<svg aria-hidden="true" focusable="false"');
});

const logoVars = computed(() => ({
  '--tms-logo-base-color': resolvedColor.value,
  '--tms-logo-background': resolvedBackground.value,
}));
</script>

<style scoped lang="scss">
.tms-logo {
  display: inline-block;
  max-width: 100%;
  line-height: 0;
  text-decoration: none;
  color: inherit;
  --tms-logo-color: var(--tms-logo-base-color);
}

.tms-logo:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
  border-radius: 4px;
}

.tms-logo:hover {
  --tms-logo-color: var(--tanaab-color-primary);
  color: var(--tanaab-color-primary);
}

.tms-logo :deep(svg.tms-logo__svg) {
  display: block;
  width: 100%;
  height: auto;
  color: var(--tms-logo-color);
  background-color: var(--tms-logo-background);
}
</style>
