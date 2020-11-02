/**
 * Tag declaration interface of ESL Image element
 * Used for JSX declaration
 */
export interface ESLImageTag {
  /** Define {SmartRule} query for image source */
  'data-src': string;
  /** Define image alt text */
  alt: string;
  /** Define image rendering mode */
  mode?: string;
  /** Define source base path */
  'data-src-base'?: string;
  /** Define element title */
  title?: string;
  /** Define loading mode of the image */
  lazy?: boolean | 'none' | 'manual' | 'auto';
  /** Define load-allowed marker for lazy images */
  'lazy-triggered'?: boolean;
  /** Define query change behaviour */
  'refresh-on-update'?: boolean;
  /** Define CSS class for inner image */
  'inner-image-class'?: string;

  /** Allowed children */
  children: [];
}
