import {ESLBaseElement, ESLIntersectionTarget, listen, memoize} from '@exadel/esl';

export class ESLDemoMarqueeOwl extends ESLBaseElement {
  static override is = 'esl-d-marquee-owl';

  static readonly INITIAL_TIMEOUT = 4000;
  static readonly RESET_TIMEOUT = 4000;
  static readonly MAX_LINES_LENGTH = 16;

  static readonly INITIAL_PHRASE = 'Did you come to contribute?';
  static readonly PHRASES = [
    'Yes...',
    'What\'s up?',
    'What do you want?',
    'What?',
    'I am not going to fly away...',
    'Whoo, whoo, whoo!!!',
    'Well, let\'s say Caw, caw, caw!'
  ];

  protected _timeout: number = 0;

  @memoize()
  protected get $text(): SVGTextElement[] {
    return [...this.querySelectorAll('text')];
  }

  public get text(): string {
    return this.$text.map(($line) => $line.textContent || '').join(' ');
  }
  public set text(text: string) {
    const words = text.split(' ').reverse();
    for (const $line of this.$text) {
      let line: string = words.pop() || '';
      while (words.length && (line.length + words.at(-1)!.length < ESLDemoMarqueeOwl.MAX_LINES_LENGTH)) {
        line += ` ${words.pop()}`;
      }
      $line.textContent = line;
    }
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.text = ESLDemoMarqueeOwl.INITIAL_PHRASE;
  }

  // Activator of interactive actions
  @listen({
    event: 'intersects:in',
    target: ESLIntersectionTarget.for,
    once: true
  })
  protected _onIntersectIn(): void {
    this._timeout = window.setTimeout(() => this.$$attr('active', true), ESLDemoMarqueeOwl.INITIAL_TIMEOUT);
  }

  @listen({
    event: 'intersects:out',
    target: ESLIntersectionTarget.for,
    once: true
  })
  protected _onIntersectOut(): void {
    window.clearTimeout(this._timeout);
  }

  // Click actions
  @listen({
    event: 'click',
    target: '::find(image)',
  })
  protected _onClick(): void {
    this.text = ESLDemoMarqueeOwl.PHRASES[Math.floor(ESLDemoMarqueeOwl.PHRASES.length * Math.random())];
    clearTimeout(this._timeout);
    this._timeout = window.setTimeout(() => this.text = ESLDemoMarqueeOwl.INITIAL_PHRASE, ESLDemoMarqueeOwl.RESET_TIMEOUT);
  }
}
