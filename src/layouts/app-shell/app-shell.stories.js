// DEMO layout. A layout's HTML is only empty regions (data-slot). Stories
// fill those slots with the same raw HTML that the component and pattern
// stories use, so nothing is duplicated and the code panel shows the
// whole page as it would be written.
import appShell from "./app-shell.html?raw"
import button from "../../components/button/button.html?raw"
import textButton from "../../components/text-button/text-button.html?raw"
import buttonGroup from "../../patterns/button-group/button-group.html?raw"

// Demo only, so not added to src/index.css (the shipped bundle).
// Move the import there when this becomes a real layout.
import "./app-shell.css"

const render = (_args, { parameters }) => {
  const template = document.createElement("template")
  template.innerHTML = appShell.trim()
  const el = template.content.firstElementChild

  Object.entries(parameters.slots ?? {}).forEach(([name, html]) => {
    const slot = el.querySelector(`[data-slot="${name}"]`)
    if (slot) slot.innerHTML = html.trim()
  })

  return el.outerHTML
}

export default {
  title: "Layouts/App Shell",
  tags: ["autodocs"],
  render,
  parameters: {
    // Layouts fill the viewport rather than sitting in a padded canvas
    layout: "fullscreen",
  },
}

// Empty regions, labelled, to check the layout on its own
export const Slots = {
  parameters: {
    slots: {
      header: "Header",
      sidebar: "Sidebar",
      main: "Main",
    },
  },
}

// Patterns and components placed into the regions
export const WithContent = {
  parameters: {
    slots: {
      header: `${textButton}${button}`,
      sidebar: textButton,
      main: buttonGroup,
    },
  },
}
