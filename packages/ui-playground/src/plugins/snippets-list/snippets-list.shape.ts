import type {UIPSnippetsList} from './snippets-list';
import type {ESLBaseElementShape} from '@exadel/esl/modules/esl-base-element/core';

type UIPSnippetsShape = ESLBaseElementShape<UIPSnippetsList>;

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements {
      'uip-snippets-list': UIPSnippetsShape;
    }
  }
}
