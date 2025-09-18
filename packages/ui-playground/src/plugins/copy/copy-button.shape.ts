import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPCopy} from './copy-button';
import type {UIPEditableSource} from '../../core/base/source';

export interface UIPCopyShape extends ESLBaseElementShape<UIPCopy> {
  source?: UIPEditableSource;
  children?: any;
}

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements {
      'uip-copy': UIPCopyShape;
    }
  }
}
