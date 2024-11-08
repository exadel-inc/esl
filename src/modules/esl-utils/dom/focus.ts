import {TAB} from './keys';

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

/**
 * TODO: add visibility check
 * Gets keyboard-focusable elements within a specified root element
 * @param root - root element
 */
export const getKeyboardFocusableElements = (root: HTMLElement | Document = document): Element[] => {
  return Array.from(root.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'))
    .filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};
