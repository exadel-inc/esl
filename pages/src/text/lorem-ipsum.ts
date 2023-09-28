import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {attr} from '@exadel/esl/modules/esl-utils/decorators';

const WORDS = [
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

export class ESLDemoLoremIpsum extends ESLBaseElement {
  static override readonly is = 'lorem-ipsum';
  static override readonly observedAttributes = ['paragraphs', 'words'];

  @attr({parser: parseInt, defaultValue: 3}) public paragraphs: number;
  @attr({parser: parseInt, defaultValue: NaN}) public words: number;

  public rerender(): void {
    const paragraphs = isNaN(this.paragraphs) ? 3 : this.paragraphs;
    const words = isNaN(this.words) ? paragraphs * 100 : this.words;
    this.style.display = 'contents';
    this.innerHTML = ESLDemoLoremIpsum.buildParagraphs(words);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.rerender();
  }
  protected override disconnectedCallback(): void {
    this.innerHTML = '';
    this.style.display = '';
    super.disconnectedCallback();
  }
  protected override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'paragraphs' || name === 'words') this.rerender();
  }

  // Static API
  /** Capitalize first word in sentence */
  protected static capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   * Build a dummy string text.
   * @param count - number of words in string
   */
  public static buildString(count: number): string {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    return words.join(' ');
  }

  /**
   * Build a dummy paragraph.
   * @param words - number of words in paragraph
   */
  public static buildParagraph(words: number = 100): string {
    const sentences = [];
    while (words > 0) {
      const sentence = this.buildString(Math.min(10, words));
      sentences.push(this.capitalize(sentence) + '.');
      words -= 10;
    }
    return `<p>${sentences.join(' ')}</p>`;
  }

  /**
   * Build a dummy text.
   * @param words - number of words in text
   */
  public static buildParagraphs(words: number = 100): string {
    const result = [];
    while (words > 0) {
      const paragraph = this.buildParagraph(Math.min(100, words));
      result.push(paragraph);
      words -= 100;
    }
    return result.join('');
  }
}
