import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr} from '../../esl-utils/decorators';
import {capitalize} from '../../esl-utils/misc/format';

export class ESLRandomText extends ESLBaseElement {
  public static override readonly is = 'esl-random-text';
  public static readonly observedAttributes = [
    'paragraphs',
    'words-per-paragraph',
    'shuffle'
  ];

  /** Last used word index in dictionary */
  protected static pointer: number = -1;
  /** Words dictionary to use in random text generation. */
  public static DICTIONARY: string[] = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet',
    'consectetur', 'adipiscing', 'elit', 'curabitur',
    'ultrices', 'et', 'mi', 'suscipit', 'eget', 'vulputate', 'ante',
    'proin', 'vel', 'pretium', 'enim', 'vivamus', 'venenatis', 'eu',
    'urna', 'tempor', 'blandit', 'nullam', 'pellentesque', 'metus',
    'rhoncus', 'mauris', 'mollis', 'neque', 'sed', 'tincidunt', 'tellus',
    'nunc', 'ac', 'nulla', 'ut', 'purus', 'etiam', 'id', 'dui', 'justo',
    'sapien', 'scelerisque', 'viverra', 'ligula', 'aenean', 'porta',
    'condimentum', 'nibh', 'dictum', 'congue', 'odio', 'facilisis',
    'finibus', 'mattis', 'vehicula', 'lacinia', 'risus', 'placerat',
    'augue', 'fringilla', 'at', 'facilisi', 'arcu', 'diam', 'laoreet'
  ];

  /** Number of words in sentence */
  public static readonly WORDS_PER_SENTENCE = 10;
  /** Number of words in paragraph */
  public static readonly WORDS_PER_PARAGRAPH = 100;

  /** Choose words randomly from {@link DICTIONARY} rather than sequentially */
  @boolAttr() public shuffle: boolean;
  /** Maximum number of paragraphs in generated text */
  @attr({parser: parseFloat, defaultValue: 1}) public paragraphs: number;
  /** Maximum number of words in paragraph */
  @attr({parser: parseInt, defaultValue: 100}) public wordsPerParagraph: number;

  /** Redraws random text content */
  public refresh(): void {
    // Normalize values
    if (isNaN(this.paragraphs)) this.paragraphs = 1;
    if (isNaN(this.wordsPerParagraph)) this.wordsPerParagraph = 100;

    const {paragraphs, wordsPerParagraph, shuffle} = this;
    const words = Math.ceil(paragraphs * wordsPerParagraph);
    this.style.display = 'contents';
    this.innerHTML = ESLRandomText.generateTextHTML(words, wordsPerParagraph, shuffle);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.refresh();
  }
  protected override disconnectedCallback(): void {
    this.innerHTML = '';
    this.style.display = '';
    super.disconnectedCallback();
  }
  protected override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.refresh();
  }

  /**
   * Generates a dummy word.
   * @param random - choose word randomly from {@link DICTIONARY} rather than sequentially
   */
  protected static generateWord(random = false): string {
    if (random) return this.DICTIONARY[Math.floor(Math.random() * this.DICTIONARY.length)];
    this.pointer = (this.pointer + 1) % this.DICTIONARY.length;
    return this.DICTIONARY[this.pointer];
  }

  /**
   * Builds a dummy text
   * @param words - number of words in text
   * @param shuffle - shuffle words randomly
   */
  protected static buildText(words: number, shuffle: boolean = false): string {
    const sentences = [];
    while (words > 0) {
      const count = Math.min(this.WORDS_PER_SENTENCE, words);
      const buffer = Array.apply(0, new Array(count));
      const sentence = buffer.map(() => this.generateWord(shuffle)).join(' ');
      sentences.push(capitalize(sentence) + '.');
      words -= this.WORDS_PER_SENTENCE;
    }
    return sentences.join(' ');
  }

  /**
   * Generates a dummy text.
   * @param words - number of words in text
   * @param shuffle - shuffle words randomly
   */
  public static generateText(words: number, shuffle: boolean = false): string {
    this.pointer = -1;
    return this.buildText(words, shuffle);
  }

  /**
   * Generates a dummy text.
   * @param words - number of words in text
   * @param wordsPerParagraph - number of words in paragraph
   * @param shuffle - shuffle words randomly
   */
  public static generateTextHTML(
    words: number = this.WORDS_PER_PARAGRAPH,
    wordsPerParagraph = Math.min(this.WORDS_PER_PARAGRAPH, words),
    shuffle = false
  ): string {
    this.pointer = -1;
    const result = [];
    while (words > 0) {
      const text = this.buildText(Math.min(wordsPerParagraph, words), shuffle);
      result.push(`<p>${text}</p>`);
      words -= wordsPerParagraph;
    }
    return result.join('');
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-random-text': ESLRandomText;
  }
}
