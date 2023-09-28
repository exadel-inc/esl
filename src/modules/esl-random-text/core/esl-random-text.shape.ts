import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLRandomText} from './esl-random-text';

export interface ESLRandomTextShape extends ESLBaseElementShape<ESLRandomText> {
  /**
   * Choose words randomly from {@link DICTIONARY} rather than sequentially
   * @see ESLRandomText#shuffle
   */
  shuffle: boolean;
  /**
   * Maximum number of words in generated text
   * @see ESLRandomText#words
   */
  words: number;

  /**
   * Maximum number words in paragraph
   * @see ESLRandomText#wordsPerParagraph
   */
  wordsPerParagraph: number;

  /**
   * Maximum number of paragraphs in generated text
   * @see ESLRandomText#paragraphs
   */
  paragraphs: number;

  /** No children allowed */
  children: never | [];
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLRandomTextShape} custom tag */
      'esl-random-text': ESLRandomTextShape;
    }
  }
}
