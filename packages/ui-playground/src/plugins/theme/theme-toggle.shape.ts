import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';
import type {UIPThemeSwitcher} from './theme-toggle';

export interface UIPThemeSwitcherShape extends ESLBaseElementShape<UIPThemeSwitcher> {
  children?: any;
}

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements {
      'uip-theme-toggle': UIPThemeSwitcherShape;
    }
  }
}
