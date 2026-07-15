import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'mocha';

const colors = JSON.parse(
  await readFile(new URL('../styles/colors.json', import.meta.url), 'utf8'),
);

function flatten(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === 'string' ? [[path, child]] : flatten(child, path);
  });
}

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe('portable color palette', () => {
  it('is dark-first and keeps both modes structurally identical', () => {
    assert.equal(colors.schemaVersion, 1);
    assert.equal(colors.defaultMode, 'dark');
    assert.deepEqual(
      flatten(colors.modes.dark).map(([path]) => path),
      flatten(colors.modes.light).map(([path]) => path),
    );
  });

  it('rotates primary and secondary brand roles between modes', () => {
    const { dark, light } = colors.modes;

    for (const variant of ['primary', 'primaryLight', 'primaryDark']) {
      const suffix = variant.slice('primary'.length);
      assert.equal(dark.brand[variant], light.brand[`secondary${suffix}`]);
      assert.equal(light.brand[variant], dark.brand[`secondary${suffix}`]);
    }

    assert.equal(dark.brand.primary, '#00c88a');
    assert.equal(light.brand.primary, '#db2777');
  });

  it('uses opaque six-digit hexadecimal values', () => {
    for (const [mode, palette] of Object.entries(colors.modes)) {
      for (const [path, value] of flatten(palette)) {
        assert.match(value, /^#[0-9a-f]{6}$/, `${mode}.${path}`);
      }
    }
  });

  it('keeps portable text roles at WCAG AA contrast', () => {
    for (const [mode, palette] of Object.entries(colors.modes)) {
      const surface = palette.ui.surface;
      const textColors = {
        foreground: palette.ui.foreground,
        foregroundMuted: palette.ui.foregroundMuted,
        foregroundSubtle: palette.ui.foregroundSubtle,
        ...Object.fromEntries(
          Object.entries(palette.status).map(([name, value]) => [`status.${name}`, value]),
        ),
        ...Object.fromEntries(
          Object.entries(palette.syntax).filter(([, value]) => typeof value === 'string'),
        ),
      };

      for (const [role, foreground] of Object.entries(textColors)) {
        assert.ok(
          contrastRatio(foreground, surface) >= 4.5,
          `${mode}.${role} must have 4.5:1 contrast on ui.surface`,
        );
      }

      for (const [change, pair] of Object.entries(palette.syntax.diff)) {
        assert.ok(
          contrastRatio(pair.foreground, pair.background) >= 4.5,
          `${mode}.syntax.diff.${change} must have 4.5:1 contrast`,
        );
      }
    }
  });
});
