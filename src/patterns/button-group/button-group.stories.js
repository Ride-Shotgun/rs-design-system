// A pattern is plain HTML that composes existing components. The markup
// uses the component classes unchanged; the pattern only adds its own
// block (.btn-group) for layout.
import buttonGroup from "./button-group.html?raw"

// The group itself has no variants: it only lays out whatever buttons it
// contains. Args here change the child buttons, never the group, so the
// layout can be checked against each button variant it might hold.
const render = ({ buttonSize }) => {
  const template = document.createElement("template")
  template.innerHTML = buttonGroup.trim()
  const el = template.content.firstElementChild

  el.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.replace("btn--lg", `btn--${buttonSize}`)
  })

  return el.outerHTML
}

export default {
  title: "Patterns/Button Group",
  tags: ["autodocs"],
  render,
  argTypes: {
    buttonSize: {
      name: "Button size",
      description:
        "Size class applied to each child button. The group is unchanged.",
      control: {
        type: "inline-radio",
        labels: { lg: "Large", sm: "Small" },
      },
      options: ["lg", "sm"],
      table: { category: "Child buttons" },
    },
  },
  args: {
    buttonSize: "lg",
  },
}

export const Default = {}
