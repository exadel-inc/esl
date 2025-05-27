import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLMedia, ESLMediaFillMode} from './esl-media';

/**
 * Tag declaration interface of ESLMedia element
 * Used for TSX declaration
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
  'media-type'?: string;
}) & {
  /** Define media player group */
  group?: string;
  /** Define media fill mode */
  'fill-mode'?: ESLMediaFillMode;
  /** Define preferable aspect ratio */
  'aspect-ratio'?: string;

  /** Define lazy loading mode */
  lazy?: 'auto' | 'manual' | 'none' | '';
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
  'preload'?: 'none' | 'metadata' | 'auto' | '';
  /** Allow play media inline */
  'playsinline'?: boolean;
  /** Allows to start viewing a resource from a specific time offset */
  'start-time'?: number;

  /** Optional BC provider player id */
  'data-player-id'?: string;
  /** Optional BC provider account id */
  'data-account-id'?: string;

  /** Define ready state class for ESl Media element */
  'ready-class'?: string;

  /** Define condition {@link ESLMediaQuery} to allow load of media resource */
  'load-condition'?: string;
  /** Define class / classes to add when load media is accepted. Supports multiple and inverted classes */
  'load-condition-class'?: string;
  /** Defines target element {@link ESLTraversingQuery} selector to toggle `load-condition-class` classes */
  'load-condition-class-target'?: string;

  /** Children are not allowed for ESLMedia */
  children?: never[];
} & ESLBaseElementShape<ESLMedia>;

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLMedia} custom tag */
      'esl-media': ESLMediaTagShape;
    }
  }
}
