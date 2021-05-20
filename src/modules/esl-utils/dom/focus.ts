import {TAB} from './keys';

/**
 * Chain focus order between two elements.
 * Passive (should be called inside keyboard event handler)
 */
export const handleFocusChain = (e: KeyboardEvent, first: HTMLElement, last: HTMLElement) => {
  if (e.key !== TAB ) return;
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
