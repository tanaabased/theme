# Theme Repo Guidance

## Repo Identity

- This repo has two first-class surfaces:
  - the reusable Tanaab VitePress theme package
  - the public styleguide and brand-guidance site built with that theme
- Prefer changes that strengthen both surfaces together. A theme change should not quietly degrade the docs site, and a docs change should not drift away from the reusable theme system.
- Treat styleguide pages as normative guidance, not decorative examples. When docs establish a pattern, that pattern should reflect the real shared system.

## Theme and Docs Boundaries

- Keep reusable presentation patterns in the shared theme, component, and style layers rather than burying them inside individual markdown pages.
- Use the `TMS` prefix for exported or shared Tanaab-based Vue components. Do not introduce new exported Tanaab-based components with a `Tanaab` prefix.
- Prefer extending existing global components, theme styles, tokens, and layout patterns before introducing anything page-specific.
- If a docs request exposes a missing shared pattern, call that out and prefer promoting it into the reusable theme surface instead of solving it with page-local markup or styling.
- Do not let styleguide or brand guidance turn into a pile of isolated page implementations. Repeated or brand-significant patterns belong in the shared system.

## Markdown Authoring

- Markdown pages should use existing global components and shared styles whenever they can.
- Do not invent one-off Vue components, page-local style blocks, or ad hoc visual systems in markdown as the default solution.
- Allow narrow page-local glue only when it is clearly small, docs-specific, and unlikely to repeat.
- If a pattern could plausibly appear on two or more pages, or if it expresses a brand-significant UI pattern, treat it as shared work and elevate it into the theme, component, or style layer.
- When a markdown page needs a new component, style primitive, or token to satisfy the request cleanly, call that out in commentary and treat it as a reusable-system candidate.
- Prefer markdown content that demonstrates the real system over markdown content that simulates it with bespoke markup.
- Avoid scattering scoped style blocks across many markdown files. If several pages want similar structure, spacing, callouts, grids, controls, or demos, consolidate that into shared components or shared theme styles.
- Interactive demos in markdown should still follow the reusable-first rule. Use page-local demo code only when it is tightly scoped to that page and not establishing a broader pattern.
- Existing markdown pages that already contain local styles or scripts are legacy context, not the preferred pattern for new work.

## Validation

- Validate repo changes with `bun run lint` and `bun run build`.
- Treat a successful VitePress build as required validation, not optional smoke coverage.
- For markdown-heavy changes, validate both content correctness and site buildability.
- For theme, component, or shared style changes, validate both lint cleanliness and docs-site build viability.
- If a change adds a reusable component or shared style to support markdown authoring, ensure the docs site still builds and the new shared surface is actually the one the page uses.
