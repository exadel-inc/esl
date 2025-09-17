import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLShareButton} from './esl-share-button';

/**
 * Tag declaration interface of ESL Share Button element
 * Used for TSX declaration
 */
export interface ESLShareButtonTagShape extends ESLBaseElementShape<ESLShareButton> {
  /** Define the name of share action that occurs after button click */
  action: string;
  /** Define the link to share on a social network */
  link: string;
  /** Define the string social network identifier (no spaces) */
  name: string;
  /** Define additional params to pass into a button (can be used by share actions) */
  additional?: string;
  /** Define URL to share (current page URL by default) */
  'share-url'?: string;
  /** Define title to share (current document title by default) */
  'share-title'?: string;
  /** Marker to render default icon inside button on init */
  'default-icon'?: boolean;

  /** Allowed children */
  children?: any;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLShareButton} custom tag */
    'esl-share-button': ESLShareButtonTagShape;
  }
}
