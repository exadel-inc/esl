import {ESLBaseElement, attr} from '@exadel/esl';

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

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export class ESLDemoLoremIpsum extends ESLBaseElement {
  public static override readonly is = 'esl-d-lorem-ipsum';

  @attr({parser: parseInt, defaultValue: 3}) public paragraphs: number;
  @attr({parser: parseInt, defaultValue: NaN}) public words: number;

  public buildString(count: number): string {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    return words.join(' ');
  }

  public buildParagraph(words: number = 100): string {
    const sentences = [];
    while (words > 0) {
      const sentence = this.buildString(Math.min(10, words));
      sentences.push(capitalize(sentence) + '.');
      words -= 10;
    }
    return `<p>${sentences.join(' ')}</p>`;
  }

  public buildParagraphs(words: number = 100): string {
    const result = [];
    while (words > 0) {
      const paragraph = this.buildParagraph(Math.min(100, words));
      result.push(paragraph);
      words -= 100;
    }
    return result.join('');
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    const paragraphs = isNaN(this.paragraphs) ? 3 : this.paragraphs;
    const words = isNaN(this.words) ? paragraphs * 100 : this.words;
    this.innerHTML = this.buildParagraphs(words);
  }
  protected override disconnectedCallback(): void {
    this.innerHTML = '';
    super.disconnectedCallback();
  }
}
