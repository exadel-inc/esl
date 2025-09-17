import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLAnchornav} from './esl-anchornav';

/**
 * Tag declaration interface of {@link ESLAnchornav} element
 * Used for TSX declaration
 */
export interface ESLAnchornavTagShape<T extends ESLAnchornav = ESLAnchornav> extends ESLBaseElementShape<T> {
  /** Item renderer which is used to build inner markup */
  renderer?: string;
  /** CSS classes to set on active item */
  'active-class'?: string;

  /** Allowed children */
  children?: any;
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLAnchornav} custom tag */
    'esl-anchornav': ESLAnchornavTagShape;
  }
}
