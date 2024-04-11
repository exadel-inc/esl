import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen, memoize, prop, ready} from '../../../esl-utils/decorators';
import {ARROW_LEFT, ARROW_RIGHT} from '../../../esl-utils/dom/keys';
import {ESLBaseElement} from '../../../esl-base-element/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {indexToGroup} from '../../core/nav/esl-carousel.nav.utils';
import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

import type {ESLCarousel} from '../../core/esl-carousel';
import type {DelegatedEvent} from '../../../esl-event-listener/core/types';

export type ESLCarouselNavDotsBuilder = (index: number, $dots: ESLCarouselNavDots) => HTMLElement;
export type ESLCarouselNavDotsUpdater = ($dot: HTMLElement, isActive: boolean, $dots: ESLCarouselNavDots) => void;

/**
 * {@link ESLCarousel} Dots navigation element
 *
 * Example:
 * ```
 * <esl-carousel-dots></esl-carousel-dots>
 * ```
 */
@ExportNs('Carousel.Dots')
export class ESLCarouselNavDots extends ESLBaseElement {
  public static override is = 'esl-carousel-dots';
  public static observedAttributes = ['target', 'mode'];

  /** Default dot template */
  public static defaultDotBuilder: ESLCarouselNavDotsBuilder = (index: number, {tabIndex, mode}: ESLCarouselNavDots): HTMLElement => {
    const dot = document.createElement('button');
    dot.className = 'esl-carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('tabindex', tabIndex >= 0 ? '-1' : '0');
    dot.setAttribute('esl-carousel-dot', `${index}`);
    dot.setAttribute('aria-label', `Show ${mode} ${index + 1}`);
    return dot;
  };
  /** Default dot updater */
  public static defaultDotUpdater: ESLCarouselNavDotsUpdater = ($dot: HTMLElement, active: boolean): void => {
    $dot.toggleAttribute('active', active);
    $dot.setAttribute('aria-current', active.toString());
  };

  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance */
  @attr({
    name: 'target',
    defaultValue: '::parent([esl-carousel-container])::find(esl-carousel)'
  })
  public carousel: string;

  /** Rendering mode: dot per slide / dot per group(set) */
  @attr({defaultValue: 'group'}) public mode: 'group' | 'slide';

  @prop(ESLCarouselNavDots.defaultDotBuilder) public builder: ESLCarouselNavDotsBuilder;
  @prop(ESLCarouselNavDots.defaultDotUpdater) public updater: ESLCarouselNavDotsUpdater;

  public get count(): number {
    if (!this.$carousel) return 0;
    const {count, size} = this.$carousel.state;
    return this.mode === 'group' ? Math.ceil(size / count) : size;
  }

  public get active(): number {
    if (!this.$carousel) return 0;
    const {activeIndex, count, size} = this.$carousel.state;
    return this.mode === 'group' ? indexToGroup(activeIndex, count, size) : activeIndex;
  }
  public get prev(): number {
    return this.active > 0 ? this.active - 1 : this.count - 1;
  }
  public get next(): number {
    return this.active < this.count - 1 ? this.active + 1 : 0;
  }

  @memoize()
  public get $dots(): HTMLElement[] {
    return [...this.querySelectorAll('[esl-carousel-dot]')] as HTMLElement[];
  }
  public set $dots(dots: HTMLElement[]) {
    memoize.clear(this, '$dots');
    this.replaceChildren(...dots);
  }

  /** @returns ESLCarousel instance; based on {@link carousel} attribute */
  @memoize()
  public get $carousel(): ESLCarousel | null {
    return ESLTraversingQuery.first(this.carousel, this) as ESLCarousel;
  }

  @ready
  public override async connectedCallback(): Promise<void> {
    this.$$attr('disabled', true);
    if (!this.$carousel) return;
    await customElements.whenDefined(this.$carousel.tagName.toLowerCase());
    super.connectedCallback();
    this.rebuild();
    this.update();
    this.updateA11y();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, '$carousel');
  }

  public override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (!this.connected) return;
    if (name === 'target') {
      memoize.clear(this, '$carousel');
      this.$$off(this._onSlideChange);
      this.$$on(this._onSlideChange);
    }
    this.rebuild();
    this.update();
    this.updateA11y();
  }

  public rebuild(): void {
    if (!this.$carousel) return;
    const {count} = this;
    this.$dots = new Array(count).fill(null).map((_, index) => this.builder(index, this));
  }

  public update(): void {
    if (!this.$carousel) return;
    const {$dots, active} = this;
    $dots.forEach(($dot, index) => this.updater($dot, index === active, this));
  }

  protected updateA11y(): void {
    this.$$attr('role', 'tablist');
    if (!this.hasAttribute('aria-label')) {
      this.$$attr('aria-label', 'Carousel dots');
    }
  }

  /** Handles carousel state changes */
  @listen({
    event: `${ESLCarouselSlideEvent.AFTER} ${ESLCarouselChangeEvent.TYPE}`,
    target: ($el: ESLCarouselNavDots) => $el.$carousel
  })
  protected _onSlideChange(e: Event): void {
    if (this.$carousel !== e.target) return;
    if (this.$dots.length !== this.count) this.rebuild();
    this.update();
  }

  /** Handles `click` on the dots */
  @listen({event: 'click', selector: '[esl-carousel-dot]'})
  protected _onClick(event: DelegatedEvent<PointerEvent>): void {
    if (!this.$carousel || typeof this.$carousel.goTo !== 'function') return;
    const $btn = event.$delegate as HTMLElement;
    const target = $btn.getAttribute('esl-carousel-dot') || '';
    this.$carousel.goTo(`${this.mode}:${+target}`);
    (this.tabIndex >= 0 ? this : $btn).focus({preventScroll: true});
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (ARROW_LEFT === event.key) {
      this.$dots[this.prev]?.click();
    }
    if (ARROW_RIGHT === event.key) {
      this.$dots[this.next]?.click();
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Dots: typeof ESLCarouselNavDots;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-dots': ESLCarouselNavDots;
  }
}
