/**
 * Tag declaration interface of ESL Scrollbar
 * Used for JSX declaration
 */
export interface ESLScrollbarTagShape {
  /** Define ESL Traversing Query for container element to observe with ESL Scrollbar */
  target: string;

  /** Marker to make scrollbar oriented horizontally */
  horizontal?: boolean;

  /** thumb inner element class. 'scrollbar-thumb' by default. */
  'thumb-class'?: string;
  /** track inner element class. 'scrollbar-track' by default. */
  'track-class'?: string;

  /** Allowed children */
  children: [];
}
