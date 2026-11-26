# AGENTS.md

Rules for AI agents working in this repository. Follow them for every change.

## Project

Ride Shotgun design system: tokens and components for internal tools.
Built with Vite and distributed as a package. Components are raw HTML + CSS
for now; no framework has been chosen.

## Hard rules

- No Tailwind, CSS frameworks or utility-class systems.
- No new dependencies without asking first.
- Never edit `dist/` — it's build output.
- Run `npm run lint:css` and fix all errors before finishing a task.

## Working Practices

- Inspect existing code before making changes.
- Avoid unnecessary refactoring.
- Make small, focused changes.
- Explain significant architectural decisions.
- Preserve existing functionality.
- Do not run any write or edit terminal commands without prompting user
- Read terminal commands are OK

## Tokens

- Every custom property uses the `--rs-` prefix.
- Three tiers, in order: primitive → semantic → component.
  - Primitives (`--rs-color-blue-500`, `--rs-space-md`) are raw values.
    Never use them directly in component CSS.
  - Semantic tokens describe what a value does (`--rs-color-text-default`,
    `--rs-color-border-default`). Themes override these.
  - Component tokens follow `--rs-{component}-{property}-{variant}-{state}`
    and point at semantic tokens wherever possible.
- Never hardcode colours, spacing, radii, font sizes or z-indexes — use a token.
  If no suitable token exists, say so instead of inventing one.
- Dark mode is handled by overriding semantic tokens under
  `[data-theme="dark"]`. Don't write theme-specific component CSS unless
  the component really behaves differently in dark mode.

## CSS

- BEM class naming (`.block__element--modifier`)
- Do not nest with `&__` and `&--`.
- Avoid bare element selectors nested inside components.
- Declaration order, with a blank line between groups:
  1. `content` (pseudo-elements only)
  2. Position
  3. Display / box model
  4. Decoration
  5. Typography
  6. Animation
  7. Overflow
  8. Other
- Prefer shorthands where possible; use `background-color` rather than
  `background` for a colour on its own.
- Let Prettier own formatting — don't hand-format against it.
