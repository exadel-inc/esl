import type {ESLScrollbarTagShape, ESLToggleableTagShape, ESLTriggerTagShape} from '@exadel/esl';

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements {
      'esl-scrollbar': ESLScrollbarTagShape;
      'esl-trigger': ESLTriggerTagShape;
      'esl-toggleable': ESLToggleableTagShape;
    }
  }
}
