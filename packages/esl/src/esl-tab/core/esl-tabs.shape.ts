import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLTabs} from './esl-tabs';

/**
 * Tag declaration interface of {@link ESLTabs} element
 * Used for TSX declaration
 */
export interface ESLTabsTagShape extends ESLBaseElementShape<ESLTabs> {
  /**
   * Defines scrollable mode.
   * Supported types for different breakpoints ('disabled' by default):
   * - 'disabled' or not defined -  scroll behavior is disabled;
   * - 'center' - scroll behavior is enabled, tab is center-aligned;
   * - 'side' - scroll behavior is enabled, tab is side-aligned;
   * - empty or unsupported value - scroll behavior is enabled, tab is side-aligned;
   */
  'scrollable'?: string;

  /** Defines inner element to contain {@link ESLTab} collection. Will be scrolled in a scrollable mode */
  'scrollable-target'?: string;

  /** Allowed children */
  children?: any;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLTabs} custom tag */
    'esl-tabs': ESLTabsTagShape;
  }
}
