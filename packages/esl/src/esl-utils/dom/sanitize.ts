export interface SanitizeOptions {
  /** List of tags to remove from the sanitized tree. Scripts are always disallowed. */
  disallowedTags?: readonly string[];
  /** List of allowed first-level tags under the sanitized root container. */
  allowedRoots?: readonly string[];
  /** List of attributes that should be treated as URL-bearing attributes. */
  urlAttributes?: readonly string[];
  /** List of allowed URL protocols. Empty string means relative URLs are allowed. */
  allowedUrlProtocols?: readonly string[];
}

interface SanitizeContext {
  disallowedTags: Set<string>;
  allowedRoots: Set<string> | null;
  urlAttributes: Set<string>;
  allowedUrlProtocols: Set<string>;
}

const ALWAYS_DISALLOWED_TAGS = ['script'];
const DEFAULT_DISALLOWED_TAGS = ['template', 'iframe', 'object', 'embed', 'link', 'meta'];
const DEFAULT_URL_ATTRIBUTES = ['src', 'data', 'href', 'xlink:href', 'action', 'formaction'];
const DEFAULT_ALLOWED_URL_PROTOCOLS = ['', 'http:', 'https:', 'mailto:', 'tel:'];

const normalizeList = (items: readonly string[]): Set<string> => {
  return new Set(items.map((item) => item.toLowerCase()));
};

const createContext = ({disallowedTags, allowedRoots, urlAttributes, allowedUrlProtocols}: SanitizeOptions): SanitizeContext => {
  return {
    disallowedTags: normalizeList([...ALWAYS_DISALLOWED_TAGS, ...(disallowedTags || DEFAULT_DISALLOWED_TAGS)]),
    allowedRoots: allowedRoots?.length ? normalizeList(allowedRoots) : null,
    urlAttributes: normalizeList(urlAttributes || DEFAULT_URL_ATTRIBUTES),
    allowedUrlProtocols: normalizeList(allowedUrlProtocols || DEFAULT_ALLOWED_URL_PROTOCOLS)
  };
};

const getTagName = (el: Element): string => el.localName.toLowerCase();

const getUrlProtocol = (value: string): string => {
  const url = value.replace(/\s+/g, '').split('').filter((char) => {
    const code = char.charCodeAt(0);
    return code > 0x1F && code !== 0x7F;
  }).join('');
  const protocol = /^[a-z][a-z\d+.-]*:/i.exec(url)?.[0] || '';
  return protocol.toLowerCase();
};

const isUnsafeUrl = (value: string, context: SanitizeContext): boolean => {
  const protocol = getUrlProtocol(value);
  return !context.allowedUrlProtocols.has(protocol);
};

/** checks if the attribute is dangerous */
const isDangerousAttribute = (name: string, value: string, context: SanitizeContext): boolean => {
  const attrName = name.toLowerCase();

  if (context.urlAttributes.has(attrName) && isUnsafeUrl(value, context)) return true;
  return attrName.indexOf('on') === 0;
};

/** loops through each attribute, if it's dangerous, remove it */
const removeDangerousAttributes = (el: Element, context: SanitizeContext): void => {
  Array.from(el.attributes).forEach(({name, value}) => {
    if (isDangerousAttribute(name, value, context)) {
      el.removeAttribute(name);
    }
  });
};

/** filters first-level nodes under the sanitized root container */
const filterRootNodes = (root: Element, context: SanitizeContext): void => {
  if (!context.allowedRoots) return;

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove();
      return;
    }

    const el = node as Element;
    if (!context.allowedRoots?.has(getTagName(el))) el.remove();
  });
};

/** removes disallowed elements and malicious attributes from the element descendants */
const sanitizeDescendants = (root: Element, context: SanitizeContext): void => {
  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as Element;
    if (context.disallowedTags.has(getTagName(el))) {
      el.remove();
      return;
    }

    removeDangerousAttributes(el, context);
    sanitizeDescendants(el, context);
  });
};

/**
 * Lightly sanitizes html string from malicious attributes, values, and scripts
 * Can also remove disallowed tags and filter first-level root tags.
 * NOTE: This is a lightweight sanitizer for rich-text HTML and SVG detection.
 * For complex or security-critical sanitization, prefer specialized libraries such as DOMPurify.
 * @param html - html string to sanitize
 * @param options - sanitize options
 */
export function sanitize(html: string, options?: SanitizeOptions): string;
/**
 * Sanitizes Element from malicious attributes, values, and scripts.
 * Useful when you need to sanitize already parsed html.
 * Can also remove disallowed tags and filter first-level root tags.
 * NOTE: This is a lightweight sanitizer for rich-text HTML and SVG detection.
 * For complex or security-critical sanitization, prefer specialized libraries such as DOMPurify.
 * @param el - Element to sanitize
 * @param options - sanitize options
 */
export function sanitize<T extends Element>(el: T, options?: SanitizeOptions): T;
export function sanitize(html: Element | string, options: SanitizeOptions = {}): Element | string {
  if (typeof html === 'string') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body || document.createElement('body');
    return sanitize(body, options).innerHTML;
  }
  const context = createContext(options);
  // sanitizes html
  removeDangerousAttributes(html, context);
  filterRootNodes(html, context);
  sanitizeDescendants(html, context);
  return html;
}
