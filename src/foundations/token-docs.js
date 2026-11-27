/**
 * Generates the Foundations doc pages from the DTCG JSON in /tokens.
 *
 * The JSON is the source of truth: add a token there and it appears here.
 * Swatches and samples are styled with var(--rs-…), never raw JSON values,
 * so they follow the active theme. Run `npm run tokens` after editing the
 * JSON so the CSS variables exist.
 */
import primitives from "../../tokens/primitives.json"
import semanticLight from "../../tokens/semantic.light.json"
import semanticDark from "../../tokens/semantic.dark.json"
import componentLight from "../../tokens/component.light.json"
import componentDark from "../../tokens/component.dark.json"

import "./token-docs.css"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Flatten a DTCG tree into [{ path, type, value }]. $type is inherited. */
const flatten = (node, path = [], inheritedType) => {
  const type = node.$type ?? inheritedType

  if ("$value" in node) return [{ path, type, value: node.$value }]

  return Object.entries(node)
    .filter(([name]) => !name.startsWith("$"))
    .flatMap(([name, child]) => flatten(child, [...path, name], type))
}

const toKey = (path) => path.join(".")
const toVar = (path) => `--rs-${path.join("-")}`

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

/** "{color.grey.700}" -> "color.grey.700"; arrays are comma-joined. */
const formatValue = (value) => {
  if (Array.isArray(value)) return value.join(", ")
  const reference = String(value).match(/^\{(.+)\}$/)
  return reference ? reference[1] : String(value)
}

/** "font-size" -> "Font size", "2xl" stays as is. */
const humanise = (name) => {
  const words = name.replace(/-/g, " ")
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Group while keeping the order the tokens appear in the JSON. */
const groupBy = (tokens, getGroup) => {
  const groups = new Map()
  for (const token of tokens) {
    const group = getGroup(token)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(token)
  }
  return groups
}

/**
 * Merge a light and dark file into rows of { path, type, light, dark }.
 * Light order comes first; dark-only tokens are appended.
 */
const pairThemes = (lightTokens, darkTokens) => {
  const rows = new Map()
  for (const token of lightTokens) {
    rows.set(toKey(token.path), { ...token, light: token.value })
  }
  for (const token of darkTokens) {
    const key = toKey(token.path)
    rows.set(key, { ...token, ...rows.get(key), dark: token.value })
  }
  return [...rows.values()]
}

// ---------------------------------------------------------------------------
// Markup
// ---------------------------------------------------------------------------

const code = (text) => `<code class="rs-docs__code">${escapeHtml(text)}</code>`
const muted = (text) =>
  `<span class="rs-docs__muted">${escapeHtml(text)}</span>`
const valueCell = (value) =>
  value === undefined ? muted("—") : code(formatValue(value))

const section = (title, body) => `
  <section class="rs-docs__section">
    <h2 class="rs-docs__heading">${escapeHtml(title)}</h2>
    ${body}
  </section>`

const table = (headings, rows) => `
  <table class="rs-docs__table">
    <thead>
      <tr>${headings
        .map((heading) => `<th class="rs-docs__th" scope="col">${heading}</th>`)
        .join("")}</tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (cells) =>
            `<tr>${cells.map((cell) => `<td class="rs-docs__td">${cell}</td>`).join("")}</tr>`
        )
        .join("")}
    </tbody>
  </table>`

const chip = (path) =>
  `<span class="rs-docs__chip" style="background-color: var(${toVar(path)})"></span>`

const sections = (groups, renderGroup, getTitle = humanise) =>
  [...groups]
    .map(([group, tokens]) => section(getTitle(group), renderGroup(tokens)))
    .join("")

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

const lightFoundations = [...flatten(primitives), ...flatten(semanticLight)]

/** Colour primitives, grouped by hue. "color.white-a5" groups under "white". */
export const renderPrimitiveColours = () => {
  const colours = flatten(primitives).filter((token) => token.type === "color")
  const groups = groupBy(colours, ({ path }) =>
    path.length > 2 ? path[1] : path.at(-1).replace(/-a\d+$/, "")
  )

  return sections(
    groups,
    (tokens) => `
      <ul class="rs-docs__swatches">
        ${tokens
          .map(
            (token) => `
              <li class="rs-docs__card">
                ${chip(token.path)}
                ${code(toVar(token.path))}
                ${muted(formatValue(token.value))}
              </li>`
          )
          .join("")}
      </ul>`
  )
}

/** Semantic colours, grouped by category, with light and dark references. */
export const renderSemanticColours = () => {
  const isColour = (token) => token.type === "color"
  const rows = pairThemes(
    flatten(semanticLight).filter(isColour),
    flatten(semanticDark).filter(isColour)
  )
  const groups = groupBy(rows, ({ path }) => path[1])

  return sections(groups, (tokens) =>
    table(
      ["Swatch", "Variable", "Light", "Dark"],
      tokens.map((token) => [
        chip(token.path),
        code(toVar(token.path)),
        valueCell(token.light),
        valueCell(token.dark),
      ])
    )
  )
}

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog"
const SAMPLE_PARAGRAPH =
  "Ride Shotgun internal tools are built from shared tokens. This paragraph wraps over several lines so the line height is easy to judge against real copy, rather than a single short line of text."

/** Each typography group maps onto the CSS property it controls. */
const TYPOGRAPHY = {
  "font-family": { property: "font-family", text: SAMPLE_TEXT },
  "font-size": { property: "font-size", text: SAMPLE_TEXT },
  "font-weight": { property: "font-weight", text: SAMPLE_TEXT },
  "line-height": { property: "line-height", text: SAMPLE_PARAGRAPH },
  "letter-spacing": { property: "letter-spacing", text: SAMPLE_TEXT },
}

export const renderTypography = () => {
  const tokens = lightFoundations.filter(({ path }) => path[0] in TYPOGRAPHY)
  const groups = groupBy(tokens, ({ path }) => path[0])

  return sections(groups, (group) =>
    table(
      ["Variable", "Value", "Sample"],
      group.map((token) => {
        const { property, text } = TYPOGRAPHY[token.path[0]]
        return [
          code(toVar(token.path)),
          code(formatValue(token.value)),
          `<p class="rs-docs__sample" style="${property}: var(${toVar(token.path)})">${escapeHtml(text)}</p>`,
        ]
      })
    )
  )
}

/** Each scale group maps onto the visual used to preview it. */
const SCALES = {
  space: (cssVar) =>
    `<span class="rs-docs__bar" style="width: var(${cssVar})"></span>`,
  radius: (cssVar) =>
    `<span class="rs-docs__shape" style="border-radius: var(${cssVar})"></span>`,
  "border-width": (cssVar) =>
    `<span class="rs-docs__shape rs-docs__shape--outline" style="border-width: var(${cssVar})"></span>`,
}

export const renderScales = () => {
  const tokens = lightFoundations.filter(({ path }) => path[0] in SCALES)
  const groups = groupBy(tokens, ({ path }) => path[0])

  return sections(groups, (group) =>
    table(
      ["Preview", "Variable", "Value"],
      group.map((token) => [
        SCALES[token.path[0]](toVar(token.path)),
        code(toVar(token.path)),
        code(formatValue(token.value)),
      ])
    )
  )
}

export const renderZIndex = () => {
  const tokens = lightFoundations.filter(({ path }) => path[0] === "z")

  return table(
    ["Variable", "Value"],
    tokens.map((token) => [
      code(toVar(token.path)),
      code(formatValue(token.value)),
    ])
  )
}

/** Component tokens grouped by component, with light and dark references. */
export const renderComponentTokens = () => {
  const rows = pairThemes(flatten(componentLight), flatten(componentDark))
  const groups = groupBy(rows, ({ path }) => path[0])

  return sections(
    groups,
    (tokens) =>
      table(
        ["Swatch", "Variable", "Light", "Dark"],
        tokens.map((token) => [
          token.type === "color" ? chip(token.path) : "",
          code(toVar(token.path)),
          valueCell(token.light),
          valueCell(token.dark),
        ])
      ),
    (component) => component
  )
}
