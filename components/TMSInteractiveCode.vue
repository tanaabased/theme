<template>
  <div
    ref="wrapperElement"
    class="tms-interactive-code"
    @focusout="handleWrapperFocusout"
    @keydown.esc="closeEnumPopover"
  >
    <div ref="editorElement" class="tms-interactive-code__editor"></div>
    <pre
      v-if="!editorReady"
      class="tms-interactive-code__fallback"
    ><code>{{ props.code }}</code></pre>
    <Teleport to="body">
      <div
        v-if="activeEnum"
        ref="enumMenuElement"
        class="tms-interactive-code__enum-menu"
        :style="activeEnum.style"
        role="group"
        :aria-label="`Select ${activeEnum.label}`"
        @focusout="handlePopoverFocusout"
        @keydown.esc="closeEnumPopover"
      >
        <button
          v-for="option in activeEnum.options"
          :key="option"
          class="tms-interactive-code__enum-option"
          :class="{ 'tms-interactive-code__enum-option--active': option === activeEnum.value }"
          type="button"
          :aria-pressed="option === activeEnum.value"
          :data-active="option === activeEnum.value ? 'true' : undefined"
          @click="selectEnumValue(option)"
        >
          {{ formatEnumOptionLabel(option) }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script>
const shikiThemes = {
  light: 'github-light',
  dark: 'github-dark',
};

let shikiHighlighterPromise;

function getShikiHighlighter() {
  shikiHighlighterPromise ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/html.mjs'),
    import('shiki/themes/github-light.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ]).then(
    ([
      { createHighlighterCore },
      { createJavaScriptRegexEngine },
      html,
      githubLight,
      githubDark,
    ]) => {
      return createHighlighterCore({
        themes: [githubLight.default, githubDark.default],
        langs: [html.default],
        engine: createJavaScriptRegexEngine(),
      });
    },
  );

  return shikiHighlighterPromise;
}
</script>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  regions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update-region', 'toggle-boolean', 'select-enum']);

const wrapperElement = ref(null);
const editorElement = ref(null);
const enumMenuElement = ref(null);
const editorReady = ref(false);
const activeEnum = ref(null);

let view;
let regionCompartment;
let syntaxCompartment;
let codeMirrorEditorSelection;
let codeMirrorEditorView;
let codeMirrorDecoration;
let currentRegions = props.regions;
let suppressUpdate = false;
let highlightSequence = 0;

function isTextEditableRegion(region) {
  if (!region) return false;
  if (region.kind === 'slot-text') return true;
  if (region.kind === 'array-prop-field') return region.valueKind !== 'enum';
  return region.kind === 'prop-value' && region.valueKind !== 'enum';
}

function isEnumRegion(region) {
  return (
    (region?.kind === 'prop-value' ||
      region?.kind === 'control-value' ||
      region?.kind === 'array-prop-field') &&
    region.valueKind === 'enum'
  );
}

function getEnumRegionLabel(region) {
  if (region?.path) return `${region.prop}.${region.path}`;
  return region?.prop ?? region?.control ?? 'value';
}

function getEnumRegionValue(region) {
  if (!region) return '';
  if ('value' in region) return region.value;
  return view?.state.doc.sliceString(region.from, region.to) ?? '';
}

function formatEnumOptionLabel(option) {
  return option === '' ? "''" : option;
}

function findRegionAt(position) {
  return currentRegions.find((region) => position >= region.from && position <= region.to);
}

function findEditableRegionForChange(from, to) {
  return currentRegions.find((region) => {
    if (!isTextEditableRegion(region)) return false;
    return from >= region.from && to <= region.to;
  });
}

function getSingleEditableChange(update) {
  const changes = [];

  update.changes.iterChanges((fromA, toA, fromB, toB) => {
    changes.push({ fromA, toA, fromB, toB });
  });

  if (changes.length !== 1) return null;

  const [change] = changes;
  const region = findEditableRegionForChange(change.fromA, change.toA);

  if (!region) return null;

  const delta = change.toB - change.fromB - (change.toA - change.fromA);
  const value = update.state.doc.sliceString(region.from, region.to + delta);

  return { region, value };
}

function allChangesAreEditable(transaction) {
  let allowed = true;

  transaction.changes.iterChanges((fromA, toA) => {
    if (!findEditableRegionForChange(fromA, toA)) {
      allowed = false;
    }
  });

  return allowed;
}

function closeEnumPopover() {
  activeEnum.value = null;
}

function focusStaysInEditorOrPopover(target) {
  if (!target) return false;

  return Boolean(wrapperElement.value?.contains(target) || enumMenuElement.value?.contains(target));
}

function handleWrapperFocusout(event) {
  if (focusStaysInEditorOrPopover(event.relatedTarget)) return;

  closeEnumPopover();
}

function handlePopoverFocusout(event) {
  if (focusStaysInEditorOrPopover(event.relatedTarget)) return;

  closeEnumPopover();
}

function selectEnumValue(value) {
  if (!activeEnum.value) return;

  emit('select-enum', {
    control: activeEnum.value.control,
    prop: activeEnum.value.prop,
    region: activeEnum.value.region,
    value,
  });

  closeEnumPopover();
}

function openEnumPopover(region) {
  if (!view) return;

  const coords = view.coordsAtPos(region.from);
  if (!coords) return;

  activeEnum.value = {
    control: region.control,
    label: getEnumRegionLabel(region),
    prop: region.prop,
    region,
    value: getEnumRegionValue(region),
    options: region.options ?? [],
    style: {
      top: `${Math.max(8, coords.bottom + 4)}px`,
      left: `${Math.max(8, coords.left)}px`,
    },
  };

  nextTick(() => {
    const activeOption = enumMenuElement.value?.querySelector('[data-active="true"]');
    const firstOption = enumMenuElement.value?.querySelector('button');

    (activeOption ?? firstOption)?.focus();
  });
}

function createRegionDecorations(Decoration) {
  const decorations = currentRegions.flatMap((region) => {
    if (region.from === region.to) {
      return [];
    }

    const className = [
      'tms-interactive-code__region',
      `tms-interactive-code__region--${region.kind}`,
      region.valueKind ? `tms-interactive-code__region--${region.valueKind}` : '',
      region.active === false ? 'tms-interactive-code__region--inactive' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return [Decoration.mark({ class: className }).range(region.from, region.to)];
  });

  return Decoration.set(decorations, true);
}

function createShikiDecorations(Decoration, tokenLines) {
  const decorations = [];

  for (const line of tokenLines) {
    for (const token of line) {
      const length = token.content.length;
      const lightColor = token.variants?.light?.color;
      const darkColor = token.variants?.dark?.color;

      if (!length || (!lightColor && !darkColor)) continue;

      const styles = [];

      if (lightColor) {
        styles.push(`--tms-interactive-code-token-light: ${lightColor}`);
      }

      if (darkColor) {
        styles.push(`--tms-interactive-code-token-dark: ${darkColor}`);
      }

      decorations.push(
        Decoration.mark({
          class: 'tms-interactive-code__token',
          attributes: { style: styles.join('; ') },
        }).range(token.offset, token.offset + length),
      );
    }
  }

  return Decoration.set(decorations, true);
}

async function refreshSyntaxDecorations(code) {
  if (!view || !syntaxCompartment || !codeMirrorEditorView || !codeMirrorDecoration) return;

  const sequence = ++highlightSequence;

  try {
    const highlighter = await getShikiHighlighter();

    if (sequence !== highlightSequence || !view || !syntaxCompartment) return;

    const tokenLines = highlighter.codeToTokensWithThemes(code, {
      lang: 'html',
      themes: shikiThemes,
      defaultColor: false,
    });

    view.dispatch({
      effects: syntaxCompartment.reconfigure(
        codeMirrorEditorView.decorations.of(
          createShikiDecorations(codeMirrorDecoration, tokenLines),
        ),
      ),
    });
  } catch {
    if (sequence !== highlightSequence || !view || !syntaxCompartment) return;

    view.dispatch({
      effects: syntaxCompartment.reconfigure(
        codeMirrorEditorView.decorations.of(codeMirrorDecoration.set([], true)),
      ),
    });
  }
}

function openRegionAtSelection() {
  if (!view) return false;

  const region = findRegionAt(view.state.selection.main.head);

  if (region?.kind === 'boolean-prop') {
    emit('toggle-boolean', region.prop);
    return true;
  }

  if (isEnumRegion(region)) {
    openEnumPopover(region);
    return true;
  }

  return false;
}

onMounted(async () => {
  const [{ EditorState, Compartment, EditorSelection }, { EditorView, Decoration, keymap }] =
    await Promise.all([import('@codemirror/state'), import('@codemirror/view')]);

  regionCompartment = new Compartment();
  syntaxCompartment = new Compartment();
  codeMirrorEditorSelection = EditorSelection;
  codeMirrorEditorView = EditorView;
  codeMirrorDecoration = Decoration;

  const transactionFilter = EditorState.transactionFilter.of((transaction) => {
    if (suppressUpdate || !transaction.docChanged) return transaction;
    return allChangesAreEditable(transaction) ? transaction : [];
  });

  const updateListener = EditorView.updateListener.of((update) => {
    if (suppressUpdate || !update.docChanged) return;

    void refreshSyntaxDecorations(update.state.doc.toString());

    const change = getSingleEditableChange(update);

    if (!change) return;

    emit('update-region', change);
  });

  const clickHandlers = EditorView.domEventHandlers({
    mousedown(event, currentView) {
      const position = currentView.posAtCoords({
        x: event.clientX,
        y: event.clientY,
      });
      const region = typeof position === 'number' ? findRegionAt(position) : null;

      if (region?.kind === 'boolean-prop') {
        event.preventDefault();
        emit('toggle-boolean', region.prop);
        return true;
      }

      if (isEnumRegion(region)) {
        event.preventDefault();
        openEnumPopover(region);
        return true;
      }

      closeEnumPopover();
      return false;
    },
  });

  view = new EditorView({
    parent: editorElement.value,
    state: EditorState.create({
      doc: props.code,
      extensions: [
        transactionFilter,
        updateListener,
        clickHandlers,
        EditorView.contentAttributes.of({
          'aria-label': 'Editable component usage code',
        }),
        keymap.of([
          {
            key: 'Enter',
            run: openRegionAtSelection,
          },
        ]),
        syntaxCompartment.of(EditorView.decorations.of(Decoration.set([], true))),
        regionCompartment.of(EditorView.decorations.of(createRegionDecorations(Decoration))),
        EditorView.theme({
          '&': {
            backgroundColor: 'transparent',
            color: 'var(--vp-code-block-color)',
            fontSize: 'var(--vp-code-font-size)',
          },
          '.cm-content': {
            fontFamily: 'var(--vp-font-family-mono)',
            padding: '20px 24px',
          },
          '.cm-line': {
            lineHeight: 'var(--tanaab-line-height-code)',
          },
          '.cm-scroller': {
            overflow: 'auto',
          },
          '.cm-focused': {
            outline: 'none',
          },
        }),
      ],
    }),
  });

  editorReady.value = true;
  void refreshSyntaxDecorations(props.code);
});

watch(
  () => props.regions,
  (regions) => {
    currentRegions = regions;

    if (!view || !regionCompartment || !codeMirrorEditorView || !codeMirrorDecoration) return;

    view.dispatch({
      effects: regionCompartment.reconfigure(
        codeMirrorEditorView.decorations.of(createRegionDecorations(codeMirrorDecoration)),
      ),
    });
  },
  { deep: true },
);

watch(
  () => props.code,
  (code) => {
    if (!view || view.state.doc.toString() === code) return;

    const selection = view.state.selection.main;
    const anchor = Math.min(selection.anchor, code.length);
    const head = Math.min(selection.head, code.length);

    suppressUpdate = true;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: code,
      },
      selection: codeMirrorEditorSelection.range(anchor, head),
    });
    suppressUpdate = false;
    void refreshSyntaxDecorations(code);
  },
);

onBeforeUnmount(() => {
  highlightSequence += 1;
  view?.destroy();
  view = undefined;
});
</script>

<style scoped lang="scss">
.tms-interactive-code {
  --tms-interactive-code-cursor-color: var(--vp-c-text-1);
  --tms-interactive-code-region-hover-bg: color-mix(
    in srgb,
    var(--tanaab-color-primary) 14%,
    transparent
  );

  position: relative;
  min-width: 0;
}

:global(.dark) .tms-interactive-code {
  --tms-interactive-code-cursor-color: #fff;
  --tms-interactive-code-region-hover-bg: color-mix(
    in srgb,
    var(--tanaab-color-primary) 18%,
    transparent
  );
}

.tms-interactive-code__editor {
  min-width: 0;
}

.tms-interactive-code :deep(.cm-content) {
  caret-color: var(--tms-interactive-code-cursor-color);
}

.tms-interactive-code :deep(.cm-cursor),
.tms-interactive-code :deep(.cm-dropCursor) {
  border-left-color: var(--tms-interactive-code-cursor-color);
}

.tms-interactive-code__fallback {
  min-width: 0;
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  background-color: var(--vp-code-block-bg);
  color: var(--vp-code-block-color);
  font-size: var(--vp-code-font-size);
  line-height: var(--tanaab-line-height-code);
}

.tms-interactive-code :deep(.tms-interactive-code__region) {
  border-bottom: 1px dotted currentColor;
  cursor: text;
}

.tms-interactive-code :deep(.tms-interactive-code__region--enum),
.tms-interactive-code :deep(.tms-interactive-code__region--boolean-prop) {
  cursor: pointer;
}

.tms-interactive-code :deep(.tms-interactive-code__region:hover) {
  background-color: var(--tms-interactive-code-region-hover-bg);
}

.tms-interactive-code :deep(.tms-interactive-code__region--inactive) {
  opacity: 0.45;
}

.tms-interactive-code :deep(.tms-interactive-code__region--inactive:hover) {
  opacity: 0.75;
}

.tms-interactive-code :deep(.tms-interactive-code__token) {
  color: var(--tms-interactive-code-token-light, var(--vp-code-block-color));
}

:global(.dark .tms-interactive-code .tms-interactive-code__token) {
  color: var(
    --tms-interactive-code-token-dark,
    var(--tms-interactive-code-token-light, var(--vp-code-block-color))
  );
}

.tms-interactive-code__enum-menu {
  --tms-interactive-code-region-hover-bg: color-mix(
    in srgb,
    var(--tanaab-color-primary) 14%,
    transparent
  );

  position: fixed;
  z-index: 100;
  max-width: calc(100vw - 1rem);
  max-block-size: min(16rem, calc(100vh - 1rem));
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: calc(var(--vp-code-font-size) * 0.95);
  line-height: var(--tanaab-line-height-code);
  letter-spacing: var(--tanaab-letter-spacing-mono);
  box-shadow: var(--vp-shadow-2);
}

:global(.dark .tms-interactive-code__enum-menu) {
  --tms-interactive-code-region-hover-bg: color-mix(
    in srgb,
    var(--tanaab-color-primary) 18%,
    transparent
  );
}

.tms-interactive-code__enum-option {
  display: block;
  width: 100%;
  padding: 0.35rem 0.6rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.tms-interactive-code__enum-option:hover,
.tms-interactive-code__enum-option:focus-visible {
  background-color: var(--tms-interactive-code-region-hover-bg);
  outline: none;
}

.tms-interactive-code__enum-option--active {
  color: var(--tanaab-color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}
</style>
