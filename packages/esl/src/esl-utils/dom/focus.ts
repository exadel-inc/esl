import {TAB} from './keys';
import {isVisible} from './visible';

import type {VisibilityOptions} from './visible';

/**
 * Chain focus order between passed elements.
 * Passive (should be called inside keyboard event handler)
 */
export const handleFocusChain = (e: KeyboardEvent, first: HTMLElement | undefined, last: HTMLElement | undefined): boolean | undefined => {
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

const FOCUSABLE_SELECTOR = 'a[href], button, input, textarea, select, details, summary, output, [tabindex]:not([tabindex="-1"])';
const isFocusableAllowed = (el: HTMLElement): boolean => !el.hasAttribute('disabled') && !el.closest('[inert]');

/** @returns if the element is focusable */
export const isFocusable = (el: HTMLElement): boolean => el && el.matches(FOCUSABLE_SELECTOR) && isFocusableAllowed(el);

/**
 * Gets keyboard-focusable elements within a specified root element
 * @param root - root element
 * @param visibilityOpt - visibility check options or false to skip visibility check
 */
export const getKeyboardFocusableElements = (
  root: HTMLElement | Document = document,
  visibilityOpt: VisibilityOptions | false = {visibility: true}
): Element[] => {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el: HTMLElement) => isFocusableAllowed(el) && (!visibilityOpt || isVisible(el, visibilityOpt))
  );
};
