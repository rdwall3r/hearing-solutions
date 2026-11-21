/**
 * A deliberately small frontmatter parser, so the project doesn't need a YAML
 * dependency. It supports the subset product files use:
 *
 *   key: value              strings (quoted or bare), numbers, true/false
 *   key: [a, b, "c"]        inline lists of scalars
 *   key:                    block lists of scalars or of simple key/value maps
 *     - src: /a.svg
 *       alt: "A thing"
 *   # comments, on their own line or after an unquoted value
 *
 * Anything else throws with the file name and line number. If product files
 * outgrow this, swap in a full YAML parser (e.g. `gray-matter`) here.
 */

export type Scalar = string | number | boolean | null;
export type FrontmatterValue = Scalar | Scalar[] | Record<string, Scalar>[];

export interface ParsedFile {
  data: Record<string, FrontmatterValue>;
  body: string;
}

export function parseFrontmatter(source: string, fileName = "file"): ParsedFile {
  const text = source.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: missing --- frontmatter block`);

  const [, head, body] = match;
  const lines = head.split("\n");
  const data: Record<string, FrontmatterValue> = {};
  const fail = (i: number, msg: string): never => {
    throw new Error(`${fileName}:${i + 2}: ${msg}`);
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }
    const keyMatch = line.match(/^([A-Za-z_][\w-]*):(.*)$/);
    if (!keyMatch) fail(i, `expected "key: value", got "${line}"`);
    const [, key, rest] = keyMatch!;
    if (key in data) fail(i, `duplicate key "${key}"`);
    const inline = stripComment(rest).trim();

    if (inline !== "") {
      data[key] = inline.startsWith("[") ? parseInlineList(inline, () => fail(i, "bad list")) : parseScalar(inline);
      i++;
      continue;
    }

    // Block list
    i++;
    const items: Array<Scalar | Record<string, Scalar>> = [];
    while (i < lines.length && (isBlank(lines[i]) || /^\s+/.test(lines[i]))) {
      if (isBlank(lines[i])) {
        i++;
        continue;
      }
      const item = lines[i].match(/^(\s+)-\s*(.*)$/);
      if (!item) fail(i, `expected "- item" under "${key}"`);
      const [, indent, first] = item!;
      const firstPair = first.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
      if (!firstPair) {
        items.push(parseScalar(stripComment(first).trim()));
        i++;
        continue;
      }
      const obj: Record<string, Scalar> = {
        [firstPair[1]]: parseScalar(stripComment(firstPair[2]).trim()),
      };
      i++;
      const childIndent = indent.length + 2;
      while (i < lines.length && !isBlank(lines[i])) {
        const leading = lines[i].match(/^(\s*)/)![1].length;
        if (leading !== childIndent || /^\s*-/.test(lines[i])) break;
        const pair = lines[i].trim().match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
        if (!pair) fail(i, `expected "key: value" inside list item`);
        obj[pair![1]] = parseScalar(stripComment(pair![2]).trim());
        i++;
      }
      items.push(obj);
    }
    const allObjects = items.every((x) => x !== null && typeof x === "object");
    const allScalars = items.every((x) => x === null || typeof x !== "object");
    if (!allObjects && !allScalars) fail(i - 1, `list "${key}" mixes maps and plain values`);
    data[key] = items as FrontmatterValue;
  }

  return { data, body: body.trim() };
}

function isBlank(line: string) {
  return /^\s*(#.*)?$/.test(line);
}

function stripComment(value: string) {
  const v = value.trim();
  if (v.startsWith('"') || v.startsWith("'") || v.startsWith("[")) {
    // Quoted / list values: only strip a comment after the closing delimiter.
    const close = v.startsWith("[") ? "]" : v[0];
    const end = v.indexOf(close, 1);
    return end === -1 ? v : v.slice(0, end + 1);
  }
  return v.replace(/\s+#.*$/, "");
}

function parseScalar(raw: string): Scalar {
  if (raw === "" || raw === "null" || raw === "~") return null;
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    const inner = raw.slice(1, -1);
    return raw[0] === '"' ? inner.replace(/\\"/g, '"').replace(/\\n/g, "\n") : inner.replace(/''/g, "'");
  }
  return raw;
}

function parseInlineList(raw: string, onError: () => never): Scalar[] {
  if (!raw.endsWith("]")) onError();
  const inner = raw.slice(1, -1).trim();
  if (inner === "") return [];
  const parts = inner.match(/("[^"]*"|'[^']*'|[^,]+)/g) ?? [];
  return parts.map((p) => parseScalar(p.trim()));
}
