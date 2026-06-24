import type {ESLToggleable} from './esl-toggleable';

/** Focus flow behaviors */
export type ESLA11yType = 'none' | 'autofocus' | 'popup' | 'dialog' | 'modal';

/**
 * Manager interface for controlling focus scope and lifecycle of {@link ESLToggleable} elements.
 *
 * Responsibilities:
 * - Maintains a stack of active toggleable elements
 * - Manages focus transitions and keyboard navigation (Tab key handling)
 * - Tracks relationships between related toggleables (e.g., nested popups)
 * - Handles outside interaction detection for auto-closing behavior
 */
export interface ESLToggleableManager {
  /** Changes focus scope to the specified element. Previous scope saved in the stack. */
  attach(element: ESLToggleable): void;

  /** Removes the specified element from the known focus scopes. */
  detach(element: ESLToggleable, fallback?: HTMLElement | null): void;

  /** Checks if the element is related to the specified toggleable open chain */
  isRelates(element: HTMLElement, related: ESLToggleable): boolean;
}
