import {TAB} from './keys';

/**
 * Chain focus order between passed elements.
 * Passive (should be called inside keyboard event handler)
 */
export const handleFocusChain = (e: KeyboardEvent, first: HTMLElement, last: HTMLElement): boolean | undefined => {
  if (e.key !== TAB) return;
  if (last && e.target === first && e.shiftKey) {
    last.focus();
    e.preventDefault();
    return true;
  }
  if (first && e.target === last && !e.shiftKey) {
    first.focus();
    e.preventDefault();
    return true;
  }
};

/**
 * TODO: add visibility check
 * Gets keyboard-focusable elements within a specified root element
 * @param root - root element
 */
export const getKeyboardFocusableElements = (root: HTMLElement | Document = document): Element[] => {
  return Array.from(root.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'))
    .filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};
