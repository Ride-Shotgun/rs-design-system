/**
 * Checks the generated token CSS matches the old hand-written file.
 *
 *   node scripts/compare-tokens.js old-tokens.css src/tokens/generated/tokens.light.css src/tokens/generated/tokens.dark.css src/tokens/base.css
 *
 * Compares every --rs-* declaration per selector (ignoring order, whitespace
 * and comments) and exits non-zero on any difference.
 */
import { readFileSync } from "node:fs"

function parse(css) {
  const map = new Map()
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const blockRe = /([^{}]+)\{([^{}]*)\}/g
  // flatten one level of @media nesting into "@media ... > selector"
  const mediaRe = /(@media[^{]+)\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g
  let rest = clean
  for (const [whole, media, inner] of clean.matchAll(mediaRe)) {
    rest = rest.replace(whole, "")
    for (const [, sel, body] of inner.matchAll(blockRe)) {
      add(`${media.trim()} > ${sel.trim()}`, body)
    }
  }
  for (const [, sel, body] of rest.matchAll(blockRe)) add(sel.trim(), body)

  function add(selector, body) {
    for (const [, name, value] of body.matchAll(
      /(--rs-[\w-]+)\s*:\s*([^;]+);/g
    )) {
      map.set(`${selector} | ${name}`, value.replace(/\s+/g, " ").trim())
    }
  }
  return map
}

const [oldFile, ...newFiles] = process.argv.slice(2)
const before = parse(readFileSync(oldFile, "utf8"))
const after = parse(newFiles.map((f) => readFileSync(f, "utf8")).join("\n"))

let problems = 0
for (const key of new Set([...before.keys(), ...after.keys()])) {
  if (before.get(key) !== after.get(key)) {
    problems++
    console.log(
      `${key}\n  old: ${before.get(key) ?? "(missing)"}\n  new: ${after.get(key) ?? "(missing)"}`
    )
  }
}
console.log(
  problems
    ? `\n${problems} difference(s)`
    : `Identical: ${before.size} declarations`
)
process.exit(problems ? 1 : 0)
