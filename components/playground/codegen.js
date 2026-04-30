function toKebabCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeAttributeValue(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeSlotText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function decodeHtmlEntities(value) {
  return String(value ?? '').replace(
    /&(#x[\da-f]+|#\d+|amp|quot|apos|#39|lt|gt);/gi,
    (match, entity) => {
      const normalized = entity.toLowerCase();

      if (normalized.startsWith('#x')) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
      }

      if (normalized.startsWith('#')) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
      }

      const namedEntities = {
        amp: '&',
        quot: '"',
        apos: "'",
        lt: '<',
        gt: '>',
      };

      return namedEntities[normalized] ?? match;
    },
  );
}

function getSchemaProps(schema) {
  return Object.entries(schema?.props ?? {});
}

function getSchemaSlots(schema) {
  return Object.entries(schema?.slots ?? {});
}

function getDefaultValue(definition) {
  if ('default' in definition) return definition.default;
  if (definition.kind === 'boolean') return false;
  if (definition.kind === 'number') return 0;
  return '';
}

export function createPlaygroundState(schema, initialState = {}) {
  const state = {
    props: {},
    slots: {},
  };

  for (const [name, definition] of getSchemaProps(schema)) {
    state.props[name] = initialState.props?.[name] ?? getDefaultValue(definition);
  }

  for (const [name, definition] of getSchemaSlots(schema)) {
    state.slots[name] = initialState.slots?.[name] ?? definition.default ?? '';
  }

  return state;
}

function appendProp(code, regions, name, definition, value, options = {}) {
  const attribute = toKebabCase(name);
  const { collectRegions = true, includeInactiveBooleans = true } = options;

  if (definition.kind === 'boolean') {
    if (!value && !includeInactiveBooleans) {
      return { code, rendered: false };
    }

    const start = code.length;
    code += attribute;

    if (collectRegions) {
      regions.push({
        kind: 'boolean-prop',
        prop: name,
        active: Boolean(value),
        from: start,
        to: code.length,
      });
    }

    return { code, rendered: true };
  }

  const valueKind = definition.kind === 'number' ? 'number' : definition.kind;
  const formattedValue = escapeAttributeValue(value);

  code += `${attribute}="`;
  const start = code.length;
  code += formattedValue;
  const end = code.length;
  code += '"';

  if (collectRegions) {
    regions.push({
      kind: 'prop-value',
      prop: name,
      valueKind,
      options: definition.kind === 'enum' ? definition.options : undefined,
      from: start,
      to: end,
    });
  }

  return { code, rendered: true };
}

function formatSlotValue(definition, value) {
  return definition.kind === 'html' ? String(value ?? '') : escapeSlotText(value ?? '');
}

function appendSlot(code, regions, slotName, slotDefinition, value, options = {}) {
  const { collectRegions = true } = options;
  const slotStart = code.length;
  code += formatSlotValue(slotDefinition, value);
  const slotEnd = code.length;

  if (collectRegions) {
    regions.push({
      kind: 'slot-text',
      slot: slotName,
      valueKind: slotDefinition.kind ?? 'text',
      from: slotStart,
      to: slotEnd,
    });
  }

  return code;
}

function generateUsageCode(schema, state, options = {}) {
  const name = schema?.name ?? 'Component';
  const regions = [];
  const props = getSchemaProps(schema);
  const slots = getSchemaSlots(schema);
  const namedSlots = slots.filter(([slotName]) => slotName !== 'default');
  const defaultSlot = slots.find(([slotName]) => slotName === 'default');
  const { collectRegions = true, includeInactiveBooleans = true } = options;

  let code = `<${name}`;
  let renderedPropCount = 0;

  for (const [propName, definition] of props) {
    const value = state.props[propName] ?? getDefaultValue(definition);
    const before = code.length;
    code += '\n  ';
    const result = appendProp(code, regions, propName, definition, value, {
      collectRegions,
      includeInactiveBooleans,
    });
    code = result.code;

    if (!result.rendered) {
      code = code.slice(0, before);
    } else {
      renderedPropCount += 1;
    }
  }

  if (slots.length === 0) {
    code += renderedPropCount > 0 ? '\n/>' : ' />';
    return { code, regions };
  }

  code += '>';

  for (const [slotName, slotDefinition] of namedSlots) {
    code += `\n  <template #${slotName}>\n    `;
    code = appendSlot(code, regions, slotName, slotDefinition, state.slots[slotName], {
      collectRegions,
    });
    code += '\n  </template>';
  }

  if (defaultSlot) {
    const [slotName, slotDefinition] = defaultSlot;
    code += '\n  ';
    code = appendSlot(code, regions, slotName, slotDefinition, state.slots[slotName], {
      collectRegions,
    });
  }

  code += `\n</${name}>`;

  return { code, regions };
}

export function generateComponentUsage(schema, state) {
  const { code, regions } = generateUsageCode(schema, state);
  const { code: copyCode } = generateUsageCode(schema, state, {
    collectRegions: false,
    includeInactiveBooleans: false,
  });

  return { code, copyCode, regions };
}

export function getPreviewProps(schema, state) {
  const previewProps = {};

  for (const [name, definition] of getSchemaProps(schema)) {
    const value = state.props[name] ?? getDefaultValue(definition);

    if (definition.kind === 'boolean' && !value) continue;

    previewProps[name] = value;
  }

  return previewProps;
}

export function decodeRegionValue(region, value) {
  if (region?.kind === 'slot-text') {
    return region.valueKind === 'html' ? String(value ?? '') : decodeHtmlEntities(value);
  }

  if (region?.kind === 'prop-value' && region.valueKind !== 'number') {
    return decodeHtmlEntities(value);
  }

  return value;
}
