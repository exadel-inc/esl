/**
 * Tag declaration interface of {@link ESLA11yGroup} element
 * Used for JSX declaration
 */
export interface ESLA11yGroupShape {
  /** Define target elements multiple selector ({@link TraversingQuery} syntax) */
  'targets'?: string;

  /** Enable activation target (via click event) on selection */
  'activate-selected'?: boolean;

  /** Allowed children */
  children: any[];
}
