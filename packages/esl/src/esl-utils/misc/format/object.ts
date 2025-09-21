// ---------------------------------------------------------------------------
// RegExp constants (hoisted for perf & clarity)
// ---------------------------------------------------------------------------
const RE_BOOL_NULL = /^(?:true|false|null)$/; // exact match of JSON literals
const RE_TOP_LEVEL_STRING = /^(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')$/; // single OR double quoted
const RE_NUMBER = /^[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/; // lenient number (leading zeros allowed)
const RE_STRING_LITERALS = /(["'])(?:\\.|(?!\1).)*\1/g; // matches string literals, honoring escapes
const RE_UNQUOTED_KEY = /([{,]\s*)([a-zA-Z_$][\w$]*|\d+)(?=\s*:)/g; // quote identifier or numeric keys
const RE_TRAILING_COMMA = /,\s*([}\]])/g; // strip trailing comma before } or ]
const RE_STASHED_STRING = /@__STR(\d+)__/g; // restore placeholder -> original string literal

/** Transpile JS-style string literal to JSON string */
function toJSONString(src: string): any {
  if (src[0] === '"') return src;
  const inner = src.slice(1, -1).replace(/"/g, '\\"');
  return '"' + inner + '"';
}

/** Transpile original {@link parseObject} input syntax to valid JSON */
function toJSON(raw: string): string {
  let src = raw;
  // Add wrapping braces for shorthand object (when not starting with { or [)
  if (src[0] !== '{' && src[0] !== '[') src = '{' + src + '}';

  // Extract & protect string literals (both quote styles). While stashed we can safely
  // mutate separators & keys. Also normalize single quoted literals -> double quoted JSON form.
  const stash: string[] = [];
  src = src.replace(RE_STRING_LITERALS, (m) => {
    stash.push(toJSONString(m));
    return '@__STR' + (stash.length - 1) + '__';
  });

  // Separator normalization and key quoting sequence:
  // 1. Convert semicolons to commas
  // 2. Quote unquoted keys (identifier / numeric) appearing before ':'
  // 3. Remove trailing commas before a closing brace / bracket
  src = src
    .replace(/;/g, ',')
    .replace(RE_UNQUOTED_KEY, '$1"$2"')
    .replace(RE_TRAILING_COMMA, '$1');

  // Restore previously stashed string literals
  src = src.replace(RE_STASHED_STRING, (_, i) => stash[+i]);
  return src;
}

/**
 * Extended object parser for lightweight config syntax (HTML attribute friendly).
 * Supported features:
 * - Strict JSON (objects, arrays, primitives, strings)
 * - Relaxed JSON (JSONv5-lite):
 *   - unquoted keys (identifier / numeric)
 *   - single quotes for keys and string literals
 *   - trailing commas
 * - Extra sugar:
 *   - ';' can be used instead of ',' as an entry separator (objects & arrays)
 *   - top-level object braces may be omitted (e.g. `a:1; b:2`)
 * - Top-level primitives accepted (boolean, null, number – incl. leading zeros / + sign – and strings)
 *
 * Not supported / intentionally omitted:
 * - Expressions, identifiers as values (e.g. `{a: someVar}`)
 * - Some malformed escape sequences may surface as JSON errors (consistent with JSON.parse)
 */
export function parseObject(value: string): any {
  if (value === undefined || value === null) return null;
  const src = String(value).trim();
  // trimmed empty string -> null
  if (!src) return null;
  // Boolean or null
  if (RE_BOOL_NULL.test(src)) return JSON.parse(src);
  // String literal
  if (RE_TOP_LEVEL_STRING.test(src)) return JSON.parse(toJSONString(src));
  // Numeric literal
  if (RE_NUMBER.test(src)) return Number(src);
  // Object/array
  return JSON.parse(toJSON(src));
}
