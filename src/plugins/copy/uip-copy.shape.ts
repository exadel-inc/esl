import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPCopy} from './uip-copy';

interface UIPCopyShape extends ESLBaseElementShape<UIPCopy> {
  children?: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uip-copy': UIPCopyShape;
    }
  }
}
