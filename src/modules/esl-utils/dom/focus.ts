import {TAB} from './keys';
import {isVisible} from './visible';

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

export type FocusFlowType = 'none' | 'loop' | 'chain';

export const handleFocusFlow = (
  e: KeyboardEvent,
  $focusables: HTMLElement[],
  $fallback: HTMLElement,
  type: FocusFlowType = 'loop'
): boolean | undefined => {
  if (!type || type === 'none') return;

  const $first = $focusables[0];
  const $last = $focusables[$focusables.length - 1];

  if (type === 'loop') return handleFocusChain(e, $first, $last);

  if (type === 'chain' && $last && $fallback) {
    if (e.target !== (e.shiftKey ? $first : $last)) return;
    $fallback.focus();
    e.preventDefault();
  }
};

const FOCUSABLE_SELECTOR = 'a[href], button, input, textarea, select, details, summary, output, [tabindex]:not([tabindex="-1"])';

/**
 * Gets keyboard-focusable elements within a specified root element
 * @param root - root element
 * @param ignoreVisibility - ignore visibility check
 */
export const getKeyboardFocusableElements = (root: HTMLElement | Document = document, ignoreVisibility = false): Element[] => {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && !el.closest('[inert]') && (ignoreVisibility || isVisible(el))
  );
};
