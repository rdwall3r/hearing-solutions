// Checks WCAG 2.2 contrast for every color pairing the design system uses.
// Reads the hex values straight from tokens.css, so the file stays the single
// source of truth. Exits non-zero if any pairing fails.
//
//   npm run check:contrast

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const tokensPath = fileURLToPath(
  new URL("../src/design-system/tokens.css", import.meta.url),
);
const css = readFileSync(tokensPath, "utf8");

// Resolve --name: #hex and --name: var(--other) declarations.
const raw = new Map();
for (const [, name, value] of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
  raw.set(name, value.trim());
}
function resolve(name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`Circular token: ${name}`);
  seen.add(name);
  const value = raw.get(name);
  if (!value) throw new Error(`Unknown token: ${name}`);
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  if (ref) return resolve(ref[1], seen);
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`${name} is not a 6-digit hex color: ${value}`);
  }
  return value;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio, where it's used]
const TEXT = 4.5;
const UI = 3;
const pairs = [
  ["--color-text", "--color-bg", TEXT, "body text"],
  ["--color-text", "--color-surface", TEXT, "text on cards / footer"],
  ["--color-text", "--color-surface-strong", TEXT, "text on strong surface"],
  ["--color-text-muted", "--color-bg", TEXT, "secondary text"],
  ["--color-text-muted", "--color-surface", TEXT, "secondary text on cards"],
  ["--color-link", "--color-bg", TEXT, "links"],
  ["--color-link", "--color-surface", TEXT, "links on cards"],
  ["--color-link-hover", "--color-bg", TEXT, "hovered links"],
  ["--color-link-hover", "--color-surface", TEXT, "hovered links on cards"],
  ["--color-link", "--color-surface-strong", TEXT, "links on strong surface"],
  ["--color-on-primary", "--color-primary", TEXT, "primary button"],
  ["--color-on-primary", "--color-primary-hover", TEXT, "primary button hover"],
  ["--color-on-accent", "--color-accent", TEXT, "accent button"],
  ["--color-on-accent", "--color-accent-hover", TEXT, "accent button hover"],
  ["--color-primary", "--color-bg", UI, "button edge vs page"],
  ["--color-border", "--color-bg", UI, "form control border"],
  ["--color-border", "--color-surface", UI, "card border"],
  ["--color-border", "--color-field-bg", UI, "form control border on its fill"],
  ["--color-text", "--color-field-bg", TEXT, "text typed in form controls"],
  ["--color-focus", "--color-bg", UI, "focus ring"],
  ["--color-focus", "--color-surface", UI, "focus ring on cards"],
  ["--color-focus", "--color-error-bg", UI, "focus ring in error notice"],
  ["--color-error", "--color-bg", TEXT, "field error text"],
  ["--color-error", "--color-error-bg", TEXT, "error notice text"],
  ["--color-text", "--color-error-bg", TEXT, "body text in error notice"],
  ["--color-link", "--color-error-bg", TEXT, "links in error summary"],
  ["--color-success", "--color-success-bg", TEXT, "success notice"],
  ["--color-text", "--color-success-bg", TEXT, "body text in success notice"],
  ["--color-info", "--color-info-bg", TEXT, "info notice"],
  ["--color-text", "--color-info-bg", TEXT, "body text in info notice"],
  ["--color-warning", "--color-warning-bg", TEXT, "warning notice"],
  ["--color-text", "--color-warning-bg", TEXT, "body text in warning notice"],
  ["--color-service", "--color-service-bg", TEXT, "services heading"],
  ["--color-text", "--color-service-bg", TEXT, "services body text"],
  ["--color-link", "--color-service-bg", TEXT, "links on services panels"],
  // Walnut header & footer (Layout remaps the roles to these)
  ["--color-inverse-text", "--color-inverse-bg", TEXT, "header/footer text"],
  ["--color-inverse-text-muted", "--color-inverse-bg", TEXT, "byline, footer placeholder"],
  ["--color-inverse-link", "--color-inverse-bg", TEXT, "header/footer links"],
  ["--color-inverse-link-hover", "--color-inverse-bg", TEXT, "hovered header/footer links"],
  ["--color-inverse-text", "--color-inverse-bg-hover", TEXT, "Menu button hover"],
  ["--color-inverse-text", "--color-inverse-bg", UI, "Menu button edge"],
  ["--color-inverse-focus", "--color-inverse-bg", UI, "focus ring in header/footer"],
  ["--color-inverse-focus", "--color-inverse-bg-hover", UI, "focus ring on hovered Menu button"],
  ["--color-inverse-bg", "--color-bg", UI, "dropdown panel vs page"],
];

let failures = 0;
for (const [fg, bg, min, use] of pairs) {
  const ratio = contrast(resolve(fg), resolve(bg));
  const ok = ratio >= min;
  if (!ok) failures++;
  console.log(
    `${ok ? "pass" : "FAIL"}  ${ratio.toFixed(2).padStart(5)}:1 (needs ${min})  ${fg} on ${bg}  — ${use}`,
  );
}
console.log(failures ? `\n${failures} pairing(s) fail.` : "\nAll pairings pass.");
process.exit(failures ? 1 : 0);
