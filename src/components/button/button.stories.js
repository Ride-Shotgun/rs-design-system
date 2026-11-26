// Each variant is a plain HTML file, imported as a string with Vite's ?raw.
// The HTML file is the source of truth: the story renders it as-is and the
// docs "Show code" panel displays the same markup for copying.
import primary from "./button--primary.html?raw"

export default {
  title: "Components/Button",
  tags: ["autodocs"],
}

export const Primary = {
  render: () => primary,
}
