import type {UIPSnippetsTitle} from './snippets-title';
import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';

type UIPSnippetsShape = ESLBaseElementShape<UIPSnippetsTitle>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'uip-snippets-title': UIPSnippetsShape;
    }
  }
}
