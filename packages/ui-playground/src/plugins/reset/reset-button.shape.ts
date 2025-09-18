import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPReset} from './reset-button';
import type {UIPEditableSource} from '../../core/base/source';

export interface UIPResetShape extends ESLBaseElementShape<UIPReset> {
  source?: UIPEditableSource;
  children?: any;
}

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements {
      'uip-reset': UIPResetShape;
    }
  }
}
