
export default {
  extends: ["stylelint-config-standard"],

  plugins: [
    "stylelint-order",
    "./stylelint-rules/prefer-background-color.mjs",
  ],

  rules: {
    // --------------------------------------------------
    // Disable conflicting standard formatting rules
    // --------------------------------------------------

    "selector-class-pattern": null,
    "declaration-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        severity: "warning"
      }
    ],

    "at-rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignoreAtRules: ["import", "charset"],
        severity: "warning"
      }
    ],
    "comment-empty-line-before": null,

    "media-feature-range-notation": null,
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "hue-degree-notation": null,
    "value-keyword-case": null,
    "font-family-name-quotes": null,
    "property-no-vendor-prefix": null,

    // Advisory checks: report issues, never automatically fix
    "no-duplicate-selectors": [true, { severity: "warning" }],
    "no-descending-specificity": [true, { severity: "warning" }],
    "declaration-block-no-duplicate-properties": [
      true,
      { severity: "warning" }
    ],
    "block-no-empty": [true, { severity: "warning" }],
    "no-empty-source": null,

    // Other formatting preferences
    "selector-pseudo-element-colon-notation": null,
    "declaration-block-single-line-max-declarations": null,

    // --------------------------------------------------
    // Declaration ordering and spacing
    // --------------------------------------------------

    "order/properties-order": [
      [
        {
          groupName: "Positioning",
          emptyLineBefore: "never",
          properties: [
            "content",
            "position",
            "inset",
            "inset-block",
            "inset-inline",
            "top",
            "right",
            "bottom",
            "left",
            "z-index",
            "transform",
            "transform-origin",
            "translate",
            "rotate",
            "scale"
          ]
        },

        {
          groupName: "Layout",
          emptyLineBefore: "always",
          properties: [
            "display",
            "box-sizing",

            "grid",
            "grid-template",
            "grid-template-columns",
            "grid-template-rows",
            "grid-template-areas",
            "grid-auto-columns",
            "grid-auto-rows",
            "grid-auto-flow",
            "grid-column",
            "grid-column-start",
            "grid-column-end",
            "grid-row",
            "grid-row-start",
            "grid-row-end",
            "grid-area",

            "flex",
            "flex-direction",
            "flex-wrap",
            "flex-flow",
            "flex-grow",
            "flex-shrink",
            "flex-basis",
            "order",

            "align-content",
            "align-items",
            "align-self",
            "justify-content",
            "justify-items",
            "justify-self",
            "place-content",
            "place-items",
            "place-self",

            "width",
            "min-width",
            "max-width",
            "height",
            "min-height",
            "max-height",
            "aspect-ratio",

            "gap",
            "column-gap",
            "row-gap",

            "padding",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
            "padding-inline",
            "padding-block",

            "margin",
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
            "margin-inline",
            "margin-block"
          ]
        },

        {
          groupName: "Decoration",
          emptyLineBefore: "always",
          properties: [
            "background",
            "background-color",
            "background-image",
            "background-position",
            "background-size",
            "background-repeat",
            "background-attachment",
            "background-clip",
            "background-origin",
            "background-blend-mode",

            "border",
            "border-top",
            "border-right",
            "border-bottom",
            "border-left",
            "border-width",
            "border-style",
            "border-color",
            "border-radius",
            "border-collapse",
            "border-spacing",

            "outline",
            "outline-width",
            "outline-style",
            "outline-color",
            "outline-offset",

            "box-shadow",
            "text-shadow",
            "opacity",
            "filter",
            "backdrop-filter",
            "mix-blend-mode",
            "isolation",

            "fill",
            "fill-opacity",
            "stroke",
            "stroke-width",
            "stroke-linecap",
            "stroke-linejoin"
          ]
        },

        {
          groupName: "Typography",
          emptyLineBefore: "always",
          properties: [
            "font",
            "font-family",
            "font-size",
            "font-weight",
            "font-style",
            "font-stretch",
            "font-variant",
            "font-optical-sizing",
            "font-feature-settings",
            "font-variation-settings",

            "line-height",
            "letter-spacing",
            "word-spacing",

            "color",
            "text-align",
            "text-align-last",
            "text-decoration",
            "text-decoration-color",
            "text-decoration-line",
            "text-decoration-style",
            "text-decoration-thickness",
            "text-decoration-skip-ink",
            "text-transform",
            "text-indent",
            "text-overflow",
            "text-wrap",
            "text-wrap-mode",
            "text-wrap-style",

            "white-space",
            "word-break",
            "overflow-wrap",
            "hyphens",
            "vertical-align",

            "list-style",
            "list-style-type",
            "list-style-position",
            "list-style-image"
          ]
        },

        {
          groupName: "Animation",
          emptyLineBefore: "always",
          properties: [
            "animation",
            "animation-name",
            "animation-duration",
            "animation-timing-function",
            "animation-delay",
            "animation-iteration-count",
            "animation-direction",
            "animation-fill-mode",
            "animation-play-state",
            "animation-timeline",

            "transition",
            "transition-property",
            "transition-duration",
            "transition-timing-function",
            "transition-delay",

            "will-change"
          ]
        },

        {
          groupName: "Overflow",
          emptyLineBefore: "always",
          properties: [
            "overflow",
            "overflow-x",
            "overflow-y",
            "overflow-clip-margin",
            "scroll-behavior",
            "scrollbar-width",
            "scrollbar-color",
            "-webkit-overflow-scrolling",
            "-ms-overflow-style"
          ]
        },

        {
          groupName: "Other",
          emptyLineBefore: "always",
          properties: [
            "cursor",
            "pointer-events",
            "user-select",
            "visibility",
            "appearance",
            "resize",
            "object-fit",
            "object-position",
            "clip-path",
            "contain",
            "contain-intrinsic-size",
            "container",
            "container-name",
            "container-type"
          ]
        }
      ],
      {
        unspecified: "bottom",
        emptyLineBeforeUnspecified: "always",
        severity: "error"
      }
    ],
    "custom/prefer-background-color": [
      true,
      { severity: "warning" }
    ],
  }
};
