/** checks if the attribute is dangerous */
const isDangerousAttribute = (name: string, value: string): boolean => {
  const val = value.replace(/\s+/g, '').toLowerCase();
  if (['src', 'data', 'href', 'xlink:href'].includes(name)
    && (val.includes('javascript:') || val.includes('data:text/html'))) return true;
  return name.indexOf('on') === 0;
};

/** loops through each attribute, if it's dangerous, remove it */
const removeDangerousAttributes = (el: Element): void => {
  Array.from(el.attributes).forEach(({name, value}) => {
    if (isDangerousAttribute(name, value)) {
      el.removeAttribute(name);
    }
  });
};

/** removes malicious attributes from element and its children */
const sanitizeElAttributes = (body: Element): void => {
  Array.from(body.children).forEach((el) => {
    removeDangerousAttributes(el);
    sanitizeElAttributes(el);
  });
};

/** removes script elements inside element */
const removeScripts = (body: Element): void => {
  const scripts = body.querySelectorAll('script');
  Array.from(scripts).forEach((script) => script.remove());
};

const filterElements = (body: Element, allowedTopLevelTags: string[]): void => {
  if (!allowedTopLevelTags.length) return;
  Array.from(body.childNodes).forEach((el: Element) => {
    if (!allowedTopLevelTags.includes(el.tagName)) body.removeChild(el);
  });
};

/**
 * Sanitizes html string from malicious attributes, values, and scripts
 * Can also filter elements at the top nesting level by tag names.
 * @param html - html string to sanitize
 * @param allowedTopLevelTags - array of allowed tag names
 */
export function sanitize(html: string, allowedTopLevelTags: string[] = []): string {
  // converts the string to an HTML document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body || document.createElement('body');
  // sanitizes html
  removeScripts(body);
  sanitizeElAttributes(body);
  // filter allowed tags
  filterElements(body, allowedTopLevelTags);

  return body.innerHTML;
}
