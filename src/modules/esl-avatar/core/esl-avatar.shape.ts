import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLAvatar} from './esl-avatar';

/**
 * Tag declaration interface of ESL Avatar element
 * Used for TSX declaration
 */
export interface ESLAvatarTagShape extends ESLBaseElementShape<ESLAvatar> {
  /** URL of the avatar image */
  'image-url'?: string;
  /** The name of the user for whom the avatar is displayed */
  username?: string;
  /** Policy of loading image that is outside of the viewport */
  loading?: 'eager' | 'lazy';

  /** Children are not allowed for ESLAvatar */
  children?: never[];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLAvatar} custom tag */
      'esl-avatar': ESLAvatarTagShape;
    }
  }
}
