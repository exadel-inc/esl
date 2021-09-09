/**
 * Tag declaration interface of {@link ESLTabs} element
 * Used for JSX declaration
 */
export interface ESLTabsTagShape {
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
  children: any;
}
