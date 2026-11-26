/**
 * Builds the RS design tokens (DTCG JSON in /tokens) into CSS custom properties.
 *
 *   tokens.light.css  every token, under :root
 *   tokens.dark.css   only the dark overrides, under :root[data-theme="dark"]
 *
 * References are kept as var() so the output reads like the hand-written file.
 */
import StyleDictionary from "style-dictionary"

const BUILD_PATH = "src/tokens/generated/"

const LIGHT = [
  "tokens/primitives.json",
  "tokens/semantic.light.json",
  "tokens/component.light.json",
]
const DARK = ["tokens/semantic.dark.json", "tokens/component.dark.json"]

// --rs-{path joined with hyphens}: names match the existing CSS exactly
StyleDictionary.registerTransform({
  name: "name/rs",
  type: "name",
  transform: (token, config) => [config.prefix, ...token.path].join("-"),
})

// ["DM Sans", "sans-serif"] -> "DM Sans", sans-serif
StyleDictionary.registerTransform({
  name: "fontFamily/rs-css",
  type: "value",
  filter: (token) => (token.$type ?? token.type) === "fontFamily",
  transform: (token) => {
    const value = token.$value ?? token.value
    if (!Array.isArray(value)) return value
    return value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")
  },
})

const cssPlatform = (destination, selector, filter) => ({
  css: {
    prefix: "rs",
    transforms: ["name/rs", "fontFamily/rs-css"],
    buildPath: BUILD_PATH,
    files: [
      {
        destination,
        format: "css/variables",
        ...(filter && { filter }),
        options: { selector, outputReferences: true },
      },
    ],
  },
})

const light = new StyleDictionary({
  usesDtcg: true,
  source: LIGHT,
  platforms: cssPlatform("tokens.light.css", ":root"),
})

// Light tokens are included so references resolve, but only the dark
// files' own tokens are written out. Style Dictionary may warn that the
// output references filtered-out tokens; that's expected, since they're
// defined in tokens.light.css at runtime.
const dark = new StyleDictionary({
  usesDtcg: true,
  log: { warnings: "disabled" },
  include: LIGHT,
  source: DARK,
  platforms: cssPlatform(
    "tokens.dark.css",
    ':root[data-theme="dark"]',
    (token) => token.isSource
  ),
})

await light.buildAllPlatforms()
await dark.buildAllPlatforms()
