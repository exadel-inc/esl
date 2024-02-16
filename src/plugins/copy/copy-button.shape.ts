import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPCopy} from './copy-button';

export interface UIPCopyShape extends ESLBaseElementShape<UIPCopy> {
  source?: 'javascript' | 'js' | 'html';
  children?: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uip-copy': UIPCopyShape;
    }
  }
}
