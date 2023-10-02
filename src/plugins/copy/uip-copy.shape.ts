import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPCopy} from './uip-copy';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uip-copy': ESLBaseElementShape<UIPCopy>;
    }
  }
}
