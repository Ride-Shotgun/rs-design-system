// Each variant is a plain HTML file, imported as a string with Vite's ?raw.
// The HTML file is the source of truth: the render function applies the
// story args to that markup, and the docs "Show code" panel displays the
// result for copying.
import button from "./text-button.html?raw"

const render = ({ variant, size, icon }) => {
  const template = document.createElement("template")
  template.innerHTML = button.trim()
  const el = template.content.firstElementChild

  el.classList.replace("text-btn--primary", `text-btn--${variant}`)
  el.classList.replace("text-btn--lg", `text-btn--${size}`)
  if (!icon) el.querySelector("svg")?.remove()

  return el.outerHTML
}

export default {
  title: "Components/Text Button",
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
    size: "lg",
    icon: true,
  },
}

export const Primary = {}

export const Secondary = {
  args: { variant: "secondary" },
}
