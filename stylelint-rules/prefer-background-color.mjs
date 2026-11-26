
import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

const ruleName = "custom/prefer-background-color";

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Prefer "background-color" for solid colours.'
});

const colorFunctions = new Set([
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "color",
  "color-mix",
  "light-dark"
]);

const namedColors = new Set([
  "transparent",
  "currentcolor",
  "black",
  "white",
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "grey",
  "gray",
  "rebeccapurple"
]);

function isSolidColor(value) {
  const parsed = valueParser(value);
  const nodes = parsed.nodes.filter(
    (node) => node.type !== "space" && node.type !== "comment"
  );

  if (nodes.length !== 1) return false;

  const node = nodes[0];

  if (node.type === "function") {
    if (node.value.toLowerCase() === "var") {
      const variableNodes = node.nodes.filter(
        (child) => child.type !== "space" && child.type !== "comment"
      );

      if (variableNodes.length !== 1 || variableNodes[0].type !== "word") {
        return false;
      }

      return /colou?r/i.test(variableNodes[0].value);
    }

    return colorFunctions.has(node.value.toLowerCase());
  }

  if (node.type !== "word") return false;

  const word = node.value.toLowerCase();

  return (
    word.startsWith("#") ||
    namedColors.has(word)
  );
}

const rule = (enabled) => {
  return (root, result) => {
    if (!enabled) return;

    root.walkDecls("background", (decl) => {
      if (!isSolidColor(decl.value)) return;

      stylelint.utils.report({
        result,
        ruleName,
        message: messages.expected,
        node: decl,
        severity: "warning"
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
