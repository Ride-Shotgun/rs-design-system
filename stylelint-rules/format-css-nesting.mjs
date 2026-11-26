
import fs from "node:fs";
import postcss from "postcss";

const files = process.argv.slice(2);

function formatCSS(css) {
  const root = postcss.parse(css);

  const indentation = new Map();

  function getIndent(node) {
    if (!node.parent || node.parent.type === "root") {
      return 0;
    }

    const parent = node.parent;
    const parentIndent = indentation.get(parent) ?? 0;

    // Declarations are always indented by 2 spaces.
    if (node.type === "decl") {
      return parentIndent + 2;
    }

    // Nested blocks use 4 spaces if the parent
    // contains declarations, otherwise 2 spaces.
    const hasDeclarations = parent.nodes?.some(
      (child) => child.type === "decl"
    );

    return parentIndent + (hasDeclarations ? 4 : 2);
  }

  function updateBefore(node, indent) {
    const before = node.raws.before ?? "";
    const lastNewline = before.lastIndexOf("\n");

    if (lastNewline !== -1) {
      node.raws.before =
        before.slice(0, lastNewline + 1) +
        " ".repeat(indent);
    }
  }

  function updateClosingBrace(node, indent) {
    if (
      (node.type !== "rule" && node.type !== "atrule") ||
      !node.nodes
    ) {
      return;
    }

    const after = node.raws.after ?? "";
    const lastNewline = after.lastIndexOf("\n");

    if (lastNewline !== -1) {
      node.raws.after =
        after.slice(0, lastNewline + 1) +
        " ".repeat(indent);
    }
  }

  function updateGroupedSelectors(node, indent) {
    if (node.type !== "rule") {
      return;
    }

    // PostCSS stores whitespace inside multiline selectors
    // as part of the selector itself.
    if (!node.selector.includes("\n")) {
      return;
    }

    node.selector = node.selector.replace(
      /\n[ \t]*/g,
      "\n" + " ".repeat(indent)
    );
  }

  root.walk((node) => {
    if (
      node.type !== "rule" &&
      node.type !== "atrule" &&
      node.type !== "decl"
    ) {
      return;
    }

    const indent = getIndent(node);

    indentation.set(node, indent);

    updateBefore(node, indent);
    updateClosingBrace(node, indent);
    updateGroupedSelectors(node, indent);
  });

  return root.toString();
}

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const formatted = formatCSS(original);

  if (formatted !== original) {
    fs.writeFileSync(file, formatted);
    console.log(`Formatted nesting: ${file}`);
  }
}
