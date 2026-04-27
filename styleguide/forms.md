---
title: Forms
description: Native form elements and input control specimens.
---

# Forms

Native form controls inherit the Tanaab control treatment inside docs content. Use raw HTML controls, keep real labels in the markup, and use concise placeholders only as visual prompts.

## Text Input

<label>
  <span class="tms-visually-hidden">Name</span>
  <input type="text" placeholder="Name" />
</label>

## Textarea

<label>
  <span class="tms-visually-hidden">How can we help?</span>
  <textarea placeholder="How can we help?"></textarea>
</label>

## Select

<label>
  <span class="tms-visually-hidden">Service</span>
  <select>
    <option value="">Service</option>
    <option value="strategy">Strategy</option>
    <option value="design">Design</option>
    <option value="development">Development</option>
  </select>
</label>

## Focus

Keyboard focus uses a square brand-colored border. Do not remove the focus state when adding page-specific form markup.

## Labels

Do not use `placeholder` as the only label. When the visual design calls for placeholder-style prompts, keep a real label and hide it with `.tms-visually-hidden`.

Placeholders should name the field purpose, such as `Link URL`, without examples or instructions. Put examples and constraints in surrounding docs or help text instead.

```html
<label>
  <span class="tms-visually-hidden">Background</span>
  <input type="text" placeholder="Background" />
</label>
```

Native selects do not support a real placeholder. Use a blank option for the visual prompt, keep a semantic label, and compute any backing default in code instead of forcing the default into the visible field.

```html
<label>
  <span class="tms-visually-hidden">Type</span>
  <select>
    <option value="">Type</option>
    <option value="centered">centered</option>
  </select>
</label>
```
