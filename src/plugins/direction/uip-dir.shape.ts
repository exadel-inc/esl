import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPDirSwitcher} from './uip-dir';

export interface UIPDirSwitcherShape extends ESLBaseElementShape<UIPDirSwitcher> {
  children?: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uip-toggle-dir': UIPDirSwitcherShape;
    }
  }
}
