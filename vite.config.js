import { defineConfig } from "vite"
import postcssNesting from "postcss-nesting"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: "rs-design-system",
    },
    cssCodeSplit: false,
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
})
