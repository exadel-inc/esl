import type {ESLIntrinsicElements} from '@exadel/esl';

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements extends ESLIntrinsicElements {}
  }
}
