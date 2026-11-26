/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  // One pattern (MDX docs + component stories) so Storybook doesn't warn
  // about an empty stories glob before any components exist
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: "@storybook/html-vite",
}
export default config
