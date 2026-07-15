---
title: Color System
description: Palette, semantic color roles, and usage thresholds.
---

# Color System

Tanaab uses a dark-first color system. Dark mode is the default, with green as the primary color and pink as the secondary color; light mode reverses those roles.

## Modes

| Mode  | Primary   | Secondary | Surface   | Text      |
| ----- | --------- | --------- | --------- | --------- |
| Dark  | `#00c88a` | `#db2777` | `#0a1210` | `#e6f0eb` |
| Light | `#db2777` | `#00c88a` | `#f6fbf9` | `#102018` |

The primary and secondary assignments follow the runtime theme in `styles/theme.scss`. The underlying green, pink, yellow, surface, and text values come from `styles/vars.scss`.

## Portable Palette

[`styles/colors.json`](https://github.com/tanaabased/theme/blob/main/styles/colors.json) is the canonical palette for generated application, editor, terminal, and syntax themes. It contains complete `dark` and `light` definitions so a generator can select either mode without resolving aliases across files.

| Group      | Purpose                                                                |
| ---------- | ---------------------------------------------------------------------- |
| `brand`    | Primary, secondary, and accent colors with light and dark variants.    |
| `ui`       | Backgrounds, text, borders, selection, focus, cursor, and links.       |
| `status`   | Information, success, warning, and error states.                       |
| `syntax`   | Portable code and markup roles, including foreground/background diffs. |
| `terminal` | Normal and bright ANSI colors in their standard eight-color name set.  |

All palette leaves are opaque six-digit hexadecimal colors. Consumer-specific names do not belong in this file: generators map these semantic roles to targets such as Codex, Shiki, VS Code, Vim, or Warp.

## Usage

- Use `defaultMode` when a consumer does not request a mode.
- Preserve the mode's primary and secondary assignments instead of treating green as primary in every output.
- Map TextMate scopes and semantic tokens from `syntax`; use the nested diff foreground and background pairs for inserted, removed, and modified content.
- Map terminal ANSI slots directly by name. Use `ui.background`, `ui.foreground`, and `ui.cursor` for terminal shell colors outside the ANSI set.
- Do not introduce consumer-specific colors in a generator. Add a semantic role here only when the same visual distinction is useful across targets.
