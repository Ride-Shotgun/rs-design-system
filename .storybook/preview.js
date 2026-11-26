import { withThemeByDataAttribute } from "@storybook/addon-themes"
import { addons } from "storybook/preview-api"
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events"

import "../src/index.css"
import "./preview.css"

const THEMES = { light: "light", dark: "dark" }
const DEFAULT_THEME = "light"

/*
 * withThemeByDataAttribute only runs when a story renders, so MDX pages
 * with no stories (the Foundations docs) would never get data-theme.
 * Mirror the `theme` global onto <html> directly as well.
 */
const applyTheme = (globals = {}) => {
  document.documentElement.setAttribute(
    "data-theme",
    THEMES[globals.theme] ?? THEMES[DEFAULT_THEME]
  )
}

applyTheme()
const channel = addons.getChannel()
channel.on(SET_GLOBALS, ({ globals }) => applyTheme(globals))
channel.on(GLOBALS_UPDATED, ({ globals }) => applyTheme(globals))

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  initialGlobals: {
    theme: DEFAULT_THEME,
  },
  decorators: [
    withThemeByDataAttribute({
      themes: THEMES,
      defaultTheme: DEFAULT_THEME,
      attributeName: "data-theme",
      parentSelector: "html",
    }),
  ],
  parameters: {
    // The canvas background comes from --rs-color-surface-page (preview.css)
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          [
            "Introduction",
            "Colour",
            ["Primitives", "Semantic"],
            "Typography",
            "Spacing, radius and border width",
            "Z-index",
            "Component tokens",
          ],
          "*",
        ],
      },
    },
  },
}

export default preview
