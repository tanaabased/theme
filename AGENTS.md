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
- Avoid scattering scoped style blocks across many markdown files. If several pages want similar structure, spacing, callouts, grids, controls, or interactive examples, consolidate that into shared components or shared theme styles.
- Interactive playgrounds in component docs should use the shared `TMSComponentPlayground` and schema-driven examples. Use page-local interactive code only when it is tightly scoped outside the component-doc pattern and not establishing a broader pattern.
- Existing markdown pages that already contain local styles or scripts are legacy context, not the preferred pattern for new work.
- Keep prop and slot table notes focused on the public authoring API. Do not put accessibility implementation details in prop or slot descriptions unless the prop or slot exists specifically for accessibility.
- When an automatic accessibility behavior is worth documenting, put it in an info admonition near the relevant API section instead of overloading the prop or slot table.
- Component documentation pages should open with H1 and intro copy, then a `<script setup>` playground schema, hidden `## Usage`, Props, Slots when present, optional Variables, and focused notes.
- Component intro copy should be one or two short, specific, direct sentences that name what the component renders and when to use it.
- Keep top-level Usage playgrounds representative without helper jump-link text.
- Use `TMSComponentPlayground` directly under hidden `## Usage` when the component fits the schema-driven playground surface.
- Use `preview-fit="contained"` for atomic or full-width-square playground previews such as logos and boxes.
- Leave the default full-width playground preview for structural or editorial components that should demonstrate the available content width.
- Playground-only controls should render as editable HTML comments in the nearest valid position before the component or slot content they affect. Name controls for the public API area they mutate, such as `items-preset` and `items-count`, rather than using generic labels.
- Use direct live markup followed by a matching `html` code fence only for non-component docs or rare component examples that do not fit the playground schema.
- Playground schemas should cover the representative prop and slot states that make the component's public API understandable.
- Prop tables should group related props conceptually rather than alphabetically.
- Object-backed props should be followed by a compact object-shape table or adjacent explanation when the object fields are part of the public authoring API.
- Variables sections should document only intentional public CSS hooks. Do not list playground-only variables or current component implementation variables unless they are meant to be stable authoring API.

## Form Controls

- Every `input`, `textarea`, and `select` must have a real label in markup.
- When the visual design calls for placeholder-style prompts, use `.tms-visually-hidden` on the label text and keep the prompt in the control.
- Keep placeholders concise: use the field purpose, such as `Link URL`, not examples or instructions.
- Put examples and constraints in surrounding docs or help text instead of placeholder text.
- Do not use `placeholder` as the only accessible label.
- For native selects that need a placeholder-style prompt and a default backing value, use a blank placeholder option and resolve the actual default in code.

## Development Site and Browser Review

- When working on theme, component, markdown, layout, or shared style changes, inspect the rendered VitePress site when the change has visual or interaction impact.
- If no suitable dev server is already running, launch the site from the repo root with `bun run dev`.
- Use the URL printed by VitePress for browser inspection; expect `http://localhost:5173/` unless the dev server reports a different port.
- Use `browser-use:browser` with the Codex in-app browser for local site inspection. Do not substitute generic Playwright, Computer Use, or macOS browser launching when the Browser plugin is available.
- After code or content changes, reload the relevant page before judging the rendered result.
- If the VitePress page shows a white screen of death or the dev server process is listening but not serving the app correctly, kill the stale dev server and restart it before debugging the page code.
- Browser review complements `bun run lint` and `bun run build`; it does not replace the required validation commands.

## Validation

- Validate repo changes with `bun run lint` and `bun run build`.
- For JavaScript helper, playground codegen, or package CLI changes, also run `bun run test`.
- Treat a successful VitePress build as required validation, not optional smoke coverage.
- For markdown-heavy changes, validate both content correctness and site buildability.
- For theme, component, or shared style changes, validate both lint cleanliness and docs-site build viability.
- If a change adds a reusable component or shared style to support markdown authoring, ensure the docs site still builds and the new shared surface is actually the one the page uses.

## JavaScript and Package CLIs

- Keep package CLI files in `bin/` as thin executable wrappers around testable modules.
- Contract-test package CLIs for help, version, failure, and primary side-effect behavior before changing their public surface.

## Changelog Entries

- Prefer grouped release notes when a release includes multiple kinds of work.
- Use `### Brand Guidance` first for public styleguide pages, brand principles, typography, color, layout, fonts, exported or public `TMS` components, containers, and public docs-site presentation changes.
- Use `### Theme Package` second for theme internals, private docs helpers such as playground machinery, package CLIs, JavaScript utilities, tests, workflows, and build or runtime packaging changes.
- Keep technical changes visible when they matter, but describe them through user or maintainer value rather than implementation diary phrasing.
- Treat the buckets as editorial guidance. Choose the section that best describes the public meaning of the change, not only the file path touched.
