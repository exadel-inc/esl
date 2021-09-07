/**
 * Tag declaration interface of {@link ESLA11yGroup} element
 * Used for JSX declaration
 */
export interface ESLA11yGroupTagShape {
  /** Define target elements multiple selector ({@link TraversingQuery} syntax) */
  'targets'?: string;

  /** Enable activation target (via click event) on selection */
  'activate-selected'?: boolean;

  /** Children are not allowed for ESLA11yGroup */
  children: [];
}
