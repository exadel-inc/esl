/**
 * Tag declaration interface of ESLMedia element
 * Used for JSX declaration
 */
export type ESLMediaTagShape = ({
  /** Define media player id */
  'media-id': string;
  /** Define media player type */
  'media-type': string;
} | {
  /** Define media source path */
  'media-src': string;
  /** Define media player type */
  'media-type': string;
}) & {
  /** Define media player group */
  group: string;
  /** Define media fill mode */
  'fill-mode'?: string;
  /** Define preferable aspect ratio */
  'aspect-ratio'?: string;

  /** Define prevent loading marker */
  disabled?: boolean;
  /** Define autoplay marker */
  autoplay?: boolean;
  /** Define auto grab focus on play marker */
  autofocus?: boolean;
  /** Mute media source */
  muted?: boolean;
  /** Define play in loop marker */
  loop?: boolean;
  /** Allow show controls */
  controls?: boolean;
  /** Define viewport control marker */
  'play-in-viewport'?: boolean;
  /** Define preload media param */
  'preload'?: string;
  /** Allow play media inline */
  'playsinline'?: boolean;

  /** Optional BC provider player id */
  'data-player-id'?: string;
  /** Optional BC provider account id */
  'data-account-id'?: string;

  /** Define ready state class for ESl Media element */
  'ready-class'?: string;

  /** Define ESL Traversing Query to find target for load-cls-accepted / load-cls-declined */
  'load-cls-target'?: string;
  /** Define class to mark player accepted state */
  'load-cls-accepted'?: string;
  /** Define class to mark player declined state */
  'load-cls-declined'?: string;

  /** Allowed children */
  children: [];
};
