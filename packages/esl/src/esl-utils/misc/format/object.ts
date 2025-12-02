import {isObject} from '../object/types';

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
 *
 * This function provides an extended parsing capability for strings representing
 * lightweight configuration syntax. It supports both strict JSON and a relaxed JSON-like
 * syntax, making it suitable for use in scenarios like HTML attributes or other
 * lightweight configuration formats.
 *
 * Supported features:
 * - **Strict JSON**: Fully supports JSON objects, arrays, primitives, and strings.
 * - **Relaxed JSON (JSONv5-lite)**:
 *   - Allows unquoted keys (identifier or numeric).
 *   - Supports single quotes for keys and string literals.
 *   - Handles trailing commas gracefully.
 * - **Extra sugar**:
 *   - Allows `;` as an alternative to `,` for entry separation in objects and arrays.
 *   - Top-level object braces may be omitted (e.g., `a:1; b:2` is valid).
 * - **Top-level primitives**: Accepts boolean, null, numbers (including leading zeros or `+` sign), and strings.
 *
 * Not supported / intentionally omitted:
 * - **Expressions or identifiers as values**: For example, `{a: someVar}` is not supported.
 * - **Malformed escape sequences**: These may result in JSON parsing errors, consistent with `JSON.parse`.
 */
export function parseObject(value: string): any {
  const src = String(value).trim();
  // trimmed empty string -> null
  if (!src) throw TypeError('Cannot parse empty string');
  // Boolean or null
  if (RE_BOOL_NULL.test(src)) return JSON.parse(src);
  // String literal
  if (RE_TOP_LEVEL_STRING.test(src)) return JSON.parse(toJSONString(src));
  // Numeric literal
  if (RE_NUMBER.test(src)) return Number(src);
  // Object/array
  return JSON.parse(toJSON(src));
}

/**
 * Safely parses a string into an object.
 *
 * This function is a safe wrapper around the {@link parseObject} function. It attempts
 * to parse the provided string using `parseObject`. If parsing fails (e.g., due to invalid
 * syntax), it catches the error and returns a fallback value instead of throwing an exception.
 *
 * @param value - The string to parse. It can represent JSON, relaxed JSON, or
 *                         lightweight config syntax.
 * @param fallback - The value to return if parsing fails, or function to execute if parsing fails. Defaults to `undefined`.
 * @param allowPrimitive - Whether to allow primitive values (e.g., numbers, strings)
 *                                           as valid results. Defaults to `false`.
 * @returns The parsed object, array, or primitive value. If parsing fails, the
 *                  fallback value is returned.
 */
export function parseObjectSafe(value: string, fallback?: any, allowPrimitive = false): any {
  try {
    const parsed = parseObject(value);
    if (allowPrimitive || isObject(parsed)) return parsed;
  } catch {/* noop */}
  return (typeof fallback === 'function') ? fallback(value) : fallback;
}
