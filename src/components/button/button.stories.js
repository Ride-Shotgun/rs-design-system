// Each variant is a plain HTML file, imported as a string with Vite's ?raw.
// The HTML file is the source of truth: the render function applies the
// story args to that markup, and the docs "Show code" panel displays the
// result for copying.
import button from "./button.html?raw"

const render = ({ variant, appearance, size, icon }) => {
  const template = document.createElement("template")
  template.innerHTML = button.trim()
  const el = template.content.firstElementChild

  // Filled is the base variant class; stroked appends "-stroke"
  const suffix = appearance === "stroke" ? "-stroke" : ""
  el.classList.replace("btn--primary", `btn--${variant}${suffix}`)
  el.classList.replace("btn--lg", `btn--${size}`)
  if (!icon) el.querySelector("svg")?.remove()

  return el.outerHTML
}

export default {
  title: "Components/Button",
  tags: ["autodocs"],
  render,
  argTypes: {
    variant: {
      control: {
        type: "inline-radio",
        labels: { primary: "Primary", secondary: "Secondary" },
      },
      options: ["primary", "secondary"],
    },
    appearance: {
      control: {
        type: "inline-radio",
        labels: { filled: "Filled", stroke: "Stroked" },
      },
      options: ["filled", "stroke"],
    },
    size: {
      control: {
        type: "inline-radio",
        labels: { lg: "Large", sm: "Small" },
      },
      options: ["lg", "sm"],
    },
    icon: { control: "boolean" },
  },
  args: {
    variant: "primary",
    appearance: "filled",
    size: "lg",
    icon: true,
  },
}

export const Primary = {}

export const Secondary = {
  args: { variant: "secondary" },
}
